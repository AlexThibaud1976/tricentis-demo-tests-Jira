/**
 * Configuration centralisée BrowserStack
 *
 * Cette version cible uniquement les navigateurs desktop via les variables
 * d'environnement BS_OS, BS_OS_VERSION, BS_BROWSER et BS_BROWSER_VERSION.
 */

const runInOrder = process.env.BS_RUN_IN_ORDER !== 'false';
const requestedWorkers = parseInt(process.env.BS_WORKERS || '5', 10);
const now = new Date();

const isMobile = Boolean(process.env.BS_DEVICE);

// Définition des capacités (desktop par défaut, mobile si BS_DEVICE est défini)
const capabilities = isMobile
  ? {
      // Mobile (ex. iPhone 15 Pro Max)
      device: process.env.BS_DEVICE,
      osVersion: process.env.BS_OS_VERSION || '17',
      browser: process.env.BS_BROWSER || 'safari',

      // Options communes BrowserStack pour Playwright
      'browserstack.console': 'info',
      'browserstack.networkLogs': 'true',
      'browserstack.debug': 'true',
      'browserstack.video': 'true',
    }
  : {
      // Système d'exploitation desktop
      os: process.env.BS_OS || 'Windows',
      osVersion: process.env.BS_OS_VERSION || '11',

      // Navigateur desktop
      browser: process.env.BS_BROWSER || 'chrome',
      browserVersion: process.env.BS_BROWSER_VERSION || 'latest',

      // Options communes BrowserStack pour Playwright
      'browserstack.console': 'info',
      'browserstack.networkLogs': 'true',
      'browserstack.debug': 'true',
      'browserstack.video': 'true',
    };

module.exports = {
  // Identifiants d'authentification BrowserStack (injectés par GitHub Actions ou .env)
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_ACCESS_KEY,

  // Déterminer l'exécution séquentielle vs parallèle
  runInOrder,

  // Nom du build visible dans le tableau de bord BrowserStack
  buildName:
    process.env.BROWSERSTACK_BUILD_NAME ||
    `Tricentis Demo Tests - ${now.toISOString().split('T')[0]} ${now
      .toTimeString()
      .slice(0, 5)}`,

  // Nom du projet dans BrowserStack
  projectName: 'Tricentis Demo Web Shop',
  testObservability: true,

  // Capacités desktop (mode unique)
  capabilities,

  // Nombre de workers (1 en séquentiel, sinon la valeur demandée)
  workers: runInOrder ? 5 : requestedWorkers,

  // Timeout global des tests (en ms)
  timeout: 90000,

  // Pas de retry côté BrowserStack (géré par Playwright si nécessaire)
  retries: 0,
};
