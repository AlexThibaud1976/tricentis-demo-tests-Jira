/**
 * Fixtures Playwright pour BrowserStack
 *
 * Cette version gère deux modes d'exécution :
 * - Mode local : si aucune clé BrowserStack n'est trouvée, on lance Chromium en local.
 * - Mode BrowserStack : une session BrowserStack desktop est créée par test.
 */

const base = require('@playwright/test');
const { chromium } = require('playwright');
const bsConfig = require('./browserstack.config');
const cp = require('child_process');

// Compteur global pour assigner un ID unique à chaque session
let sessionCounter = 0;

// Détermine si on doit exécuter sur BrowserStack en fonction des creds
const isBrowserStackRun = () =>
  Boolean(bsConfig.username && bsConfig.accessKey);

// Formatte un nom de test unique à partir du titre et d'un ID de session
const formatTestName = (testInfo, sessionId) => {
  const titlePath = Array.isArray(testInfo.titlePath)
    ? testInfo.titlePath
    : typeof testInfo.titlePath === 'function'
    ? testInfo.titlePath()
    : [testInfo.title || 'Unknown Test'];

  // Supprime le nom de fichier (premier segment) et ajoute un ID unique
  const testName = titlePath.slice(1).join(' › ');
  return `[${sessionId}] ${testName}`;
};

// Envoie une commande spécifique à BrowserStack (par ex. setSessionStatus)
const sendBrowserStackCommand = async (page, action, args) => {
  const payload = `browserstack_executor: ${JSON.stringify({
    action,
    arguments: args,
  })}`;

  try {
    await page.evaluate(() => {}, payload);
    console.log(`[BrowserStack] ${action} executed successfully`);
  } catch (error) {
    console.warn(`[BrowserStack] ${action} failed: ${error.message}`);
  }
};

// Extension des fixtures Playwright
const test = base.test.extend({
  // Override du contexte : crée une session distincte pour chaque test
  context: async ({}, use, testInfo) => {
    // ➖ Mode local : pas de credentials BrowserStack, on exécute en local
    if (!isBrowserStackRun()) {
      const isCI = `${process.env.CI}` === 'true';
      console.log('[BrowserStack] No credentials detected → running locally');
      const browser = await chromium.launch({ headless: isCI });
      const context = await browser.newContext();
      await use(context);
      await context.close();
      await browser.close();
      return;
    }

    // ➕ Mode BrowserStack
    const clientPlaywrightVersion = cp
      .execSync('npx playwright --version')
      .toString()
      .trim()
      .split(' ')[1];

    if (!bsConfig.username || !bsConfig.accessKey) {
      console.error(
        '❌ BROWSERSTACK_USERNAME ou BROWSERSTACK_ACCESS_KEY manquant dans bsConfig'
      );
      throw new Error('Missing BrowserStack credentials');
    }

    // Attribution d'un ID de session et formatage du nom de test
    const sessionId = `S${++sessionCounter}`;
    const testName = formatTestName(testInfo, sessionId);

    // Base des capabilities communes (desktop ou mobile)
    const baseCaps = {
      project: bsConfig.projectName,
      build: bsConfig.buildName,
      name: testName,
      // Authentification
      'browserstack.username': bsConfig.username,
      'browserstack.accessKey': bsConfig.accessKey,
      // Options BrowserStack
      'browserstack.console': bsConfig.capabilities['browserstack.console'],
      'browserstack.networkLogs': bsConfig.capabilities['browserstack.networkLogs'],
      'browserstack.debug': bsConfig.capabilities['browserstack.debug'],
      'browserstack.video': bsConfig.capabilities['browserstack.video'],
      // Versions de Playwright (client et serveur)
      'browserstack.playwrightVersion': '1.latest',
      'client.playwrightVersion': clientPlaywrightVersion,
    };

    const isMobile = Boolean(bsConfig.capabilities.device);

    const caps = isMobile
      ? {
          ...baseCaps,
          device: bsConfig.capabilities.device,
          os_version: bsConfig.capabilities.osVersion,
          browser: bsConfig.capabilities.browser,
        }
      : {
          ...baseCaps,
          os: bsConfig.capabilities.os,
          os_version: bsConfig.capabilities.osVersion,
          browser: bsConfig.capabilities.browser,
          browser_version: bsConfig.capabilities.browserVersion,
        };

    // Construction de l'URL WebSocket pour se connecter à BrowserStack
    const wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
      JSON.stringify(caps)
    )}`;

    let browser;
    let context;

    try {
      console.log(
        `[BrowserStack] Connecting session ${sessionId} for test: ${testInfo.title}`
      );

      // Connexion en utilisant le protocole Playwright
      browser = await chromium.connect({ wsEndpoint });

      // Récupérer ou créer le contexte en appliquant les options du projet Playwright
      const contexts = browser.contexts();
      const contextOptions = testInfo.project.use || {};
      context =
        contexts.length > 0
          ? contexts[0]
          : await browser.newContext(contextOptions);

      // Exécuter le test avec ce contexte
      await use(context);

      // Mise à jour du statut dans le dashboard BrowserStack
      console.log(
        `[BrowserStack] Test ${sessionId} finished with status: ${testInfo.status}`
      );
      const pages = context.pages();
      if (pages.length > 0 && !pages[0].isClosed()) {
        const page = pages[0];
        const isExpected =
          testInfo.status === 'passed' ||
          testInfo.status === testInfo.expectedStatus;
        const status = isExpected ? 'passed' : 'failed';
        const reason =
          testInfo.error?.message?.slice(0, 250) ||
          (status === 'passed'
            ? 'Test passed successfully'
            : `Test ${testInfo.status}`);

        console.log(`[BrowserStack] Setting status to: ${status}`);
        await sendBrowserStackCommand(page, 'setSessionStatus', {
          status,
          reason,
        });
        // Petite pause pour s'assurer de l'envoi
        await page.waitForTimeout(500);
      }
    } catch (error) {
      console.error(
        `[BrowserStack] Error in session ${sessionId}: ${error.message}`
      );
      console.error(
        '[BrowserStack] Connection failed. Vérifie les credentials et la version Playwright.'
      );
      throw new Error(`BrowserStack connection failed: ${error.message}`);
    } finally {
      // Fermeture du contexte et du navigateur
      if (context) {
        try {
          await context.close();
          console.log(`[BrowserStack] Context closed for ${sessionId}`);
        } catch (e) {
          console.warn(
            `[BrowserStack] Error closing context: ${e.message}`
          );
        }
      }
      if (browser) {
        try {
          await browser.close();
          console.log(`[BrowserStack] Browser closed for ${sessionId}`);
        } catch (e) {
          console.warn(
            `[BrowserStack] Error closing browser: ${e.message}`
          );
        }
      }
    }
  },

  // Override de page : utilise la page du contexte ou en crée une nouvelle
  page: async ({ context }, use, testInfo) => {
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();
    await use(page);
    
    // Capture pleine page en cas d'échec
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = testInfo.outputPath(`failure-fullpage.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('failure-fullpage', {
        path: screenshotPath,
        contentType: 'image/png'
      });
      console.log('📸 Full page screenshot captured on failure');
    }
  },
});

module.exports = { test, expect: base.expect };
