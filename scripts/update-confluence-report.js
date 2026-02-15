#!/usr/bin/env node

/**
 * Met à jour une page Confluence avec un tableau de reporting high-level
 * après chaque exécution de tests sur BrowserStack.
 *
 * Ajoute une ligne au tableau historique des exécutions sur la page Confluence cible.
 * Si la page n'existe pas, elle est créée avec la structure initiale.
 *
 * Variables d'environnement requises:
 *   CONFLUENCE_URL          - URL de base Confluence (ex: https://domaine.atlassian.net/wiki)
 *   CONFLUENCE_USER         - Email utilisateur Confluence
 *   CONFLUENCE_API_TOKEN    - Token API Atlassian
 *   CONFLUENCE_SPACE_KEY    - Clé de l'espace Confluence (ex: QA)
 *   CONFLUENCE_PAGE_TITLE   - Titre de la page dashboard (ex: Dashboard Qualité - Tricentis Demo)
 *
 * Variables d'environnement optionnelles (pour le contenu du rapport):
 *   CONFLUENCE_PARENT_PAGE_ID - ID de la page parente (optionnel)
 *   DEVICE_NAME             - Nom du device testé
 *   BS_OS                   - Système d'exploitation
 *   BS_OS_VERSION           - Version OS
 *   BS_BROWSER              - Navigateur
 *   BS_BROWSER_VERSION      - Version navigateur
 *
 * Arguments CLI (passés par le workflow):
 *   --exec-key <key>        - Clé Jira de la Test Execution
 *   --test-result <result>  - Résultat (PASS/FAIL)
 *   --test-scope <scope>    - Périmètre de test
 *   --run-number <n>        - Numéro du run GitHub Actions
 *   --run-id <id>           - ID du run GitHub Actions
 *   --repository <repo>     - Nom du repository GitHub (owner/repo)
 *   --browserstack-url <u>  - URL du build BrowserStack (optionnel)
 */

const https = require('https');
const { URL } = require('url');

// ── CLI argument parsing ────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    parsed[key] = args[i + 1];
  }
  return parsed;
}

const cliArgs = parseArgs();

// ── Configuration ───────────────────────────────────────────────────────────

const config = {
  confluenceUrl: process.env.CONFLUENCE_URL,
  user: process.env.CONFLUENCE_USER,
  apiToken: process.env.CONFLUENCE_API_TOKEN,
  spaceKey: process.env.CONFLUENCE_SPACE_KEY,
  pageTitle: process.env.CONFLUENCE_PAGE_TITLE || 'Dashboard Qualité - Tricentis Demo',
  parentPageId: process.env.CONFLUENCE_PARENT_PAGE_ID || '',
};

const reportData = {
  date: new Date().toISOString().split('T')[0],
  time: new Date().toISOString().split('T')[1].substring(0, 5),
  execKey: cliArgs.execKey || '',
  testResult: cliArgs.testResult || 'UNKNOWN',
  testScope: cliArgs.testScope || 'All Tests',
  deviceName: process.env.DEVICE_NAME || 'unknown',
  os: process.env.BS_OS || '',
  osVersion: process.env.BS_OS_VERSION || '',
  browser: process.env.BS_BROWSER || '',
  browserVersion: process.env.BS_BROWSER_VERSION || '',
  runNumber: cliArgs.runNumber || '',
  runId: cliArgs.runId || '',
  repository: cliArgs.repository || '',
  browserstackUrl: cliArgs.browserstackUrl || '',
};

// ── Validation ──────────────────────────────────────────────────────────────

function validateConfig() {
  const required = ['confluenceUrl', 'user', 'apiToken', 'spaceKey'];
  const missing = required.filter(k => !config[k]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Required: CONFLUENCE_URL, CONFLUENCE_USER, CONFLUENCE_API_TOKEN, CONFLUENCE_SPACE_KEY');
    process.exit(1);
  }
  
  // Validate Confluence URL format
  if (!config.confluenceUrl.includes('/wiki')) {
    console.warn('⚠️  WARNING: CONFLUENCE_URL does not contain "/wiki".');
    console.warn('   For Atlassian Cloud, Confluence URL should be: https://domain.atlassian.net/wiki');
    console.warn('   Current value:', config.confluenceUrl);
  }
}

// ── HTTP helper ─────────────────────────────────────────────────────────────

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    // Fix: concatenate baseUrl + path to preserve /wiki in the URL
    // new URL(path, baseUrl) with path starting with / would remove /wiki
    const fullUrl = config.confluenceUrl + path;
    const url = new URL(fullUrl);
    const auth = Buffer.from(`${config.user}:${config.apiToken}`).toString('base64');

    // Debug logging (only for first request)
    if (!request._debugLogged) {
      console.log(`[DEBUG] Requesting: ${method} ${url.href}`);
      request._debugLogged = true;
    }

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          // Check if we're getting JIRA HTML instead of Confluence API response
          if (data.includes('JIRA') && data.includes('<!DOCTYPE html>')) {
            return reject(new Error(
              `Confluence API ${res.statusCode}: Received JIRA page instead of Confluence API response.\n` +
              `Check that CONFLUENCE_URL points to Confluence (should end with /wiki), not JIRA.\n` +
              `Current URL: ${config.confluenceUrl}`
            ));
          }
          return reject(new Error(`Confluence API ${res.statusCode}: ${data}`));
        }
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── Confluence Storage Format builders ──────────────────────────────────────

function buildResultEmoji(result) {
  if (result === 'PASS') return '&#x2705;';  // ✅
  if (result === 'FAIL') return '&#x274C;';  // ❌
  return '&#x26AA;';                          // ⚪
}

function buildResultBadge(result) {
  if (result === 'PASS') {
    return '<ac:structured-macro ac:name="status"><ac:parameter ac:name="colour">Green</ac:parameter><ac:parameter ac:name="title">PASS</ac:parameter></ac:structured-macro>';
  }
  if (result === 'FAIL') {
    return '<ac:structured-macro ac:name="status"><ac:parameter ac:name="colour">Red</ac:parameter><ac:parameter ac:name="title">FAIL</ac:parameter></ac:structured-macro>';
  }
  return '<ac:structured-macro ac:name="status"><ac:parameter ac:name="colour">Grey</ac:parameter><ac:parameter ac:name="title">UNKNOWN</ac:parameter></ac:structured-macro>';
}

function buildJiraLink(key) {
  if (!key) return '-';
  const jiraUrl = process.env.JIRA_URL || config.confluenceUrl.replace('/wiki', '');
  return `<a href="${jiraUrl}/browse/${key}">${key}</a>`;
}

function buildGitHubActionsLink() {
  if (!reportData.repository || !reportData.runId) return '-';
  const url = `https://github.com/${reportData.repository}/actions/runs/${reportData.runId}`;
  return `<a href="${url}">#${reportData.runNumber}</a>`;
}

function buildBrowserStackLink() {
  if (!reportData.browserstackUrl) return '-';
  return `<a href="${reportData.browserstackUrl}">Build</a>`;
}

function buildNewRow() {
  return [
    `<tr>`,
    `<td>${reportData.date} ${reportData.time}</td>`,
    `<td>${buildResultBadge(reportData.testResult)}</td>`,
    `<td>${reportData.testScope}</td>`,
    `<td>${reportData.os} ${reportData.osVersion}</td>`,
    `<td>${reportData.browser} ${reportData.browserVersion}</td>`,
    `<td>${buildJiraLink(reportData.execKey)}</td>`,
    `<td>${buildGitHubActionsLink()}</td>`,
    `<td>${buildBrowserStackLink()}</td>`,
    `</tr>`,
  ].join('');
}

/**
 * Construit le contenu initial complet de la page Confluence (Storage Format).
 * Inclut un en-tête avec les macros Xray recommandées et le tableau historique.
 */
function buildInitialPageContent(firstRow) {
  return [
    // En-tête
    `<h1>${buildResultEmoji(reportData.testResult)} Dashboard Qualit&#233; - Tricentis Demo Shop</h1>`,
    `<p><em>Page mise &#224; jour automatiquement par le pipeline CI/CD.</em></p>`,
    `<hr/>`,

    // Section macros Xray (info panel)
    `<ac:structured-macro ac:name="info">`,
    `<ac:parameter ac:name="title">Compl&#233;ter avec les macros Xray</ac:parameter>`,
    `<ac:rich-text-body>`,
    `<p>Pour un dashboard complet, ajoutez manuellement les macros Xray suivantes au-dessus du tableau :</p>`,
    `<ul>`,
    `<li><strong>Xray Test Plan Board</strong> : vue d'ensemble de la couverture</li>`,
    `<li><strong>Xray Test Execution Status</strong> : &#233;tat d'avancement par Test Plan</li>`,
    `<li><strong>Jira Issue/Filter</strong> : tableau dynamique bas&#233; sur JQL</li>`,
    `</ul>`,
    `<p>Voir le guide : <strong>CONFLUENCE_REPORTING_GUIDE.md</strong></p>`,
    `</ac:rich-text-body>`,
    `</ac:structured-macro>`,

    // Séparateur
    `<h2>Historique des ex&#233;cutions CI/CD</h2>`,
    `<p>Les 50 derni&#232;res ex&#233;cutions sont affich&#233;es ci-dessous (les plus r&#233;centes en premier).</p>`,

    // Marqueur de début de tableau (pour le parsing)
    `<!-- CONFLUENCE_CI_TABLE_START -->`,
    `<table>`,
    `<colgroup><col/><col/><col/><col/><col/><col/><col/><col/></colgroup>`,
    `<thead><tr>`,
    `<th>Date</th>`,
    `<th>R&#233;sultat</th>`,
    `<th>Scope</th>`,
    `<th>OS</th>`,
    `<th>Navigateur</th>`,
    `<th>Jira</th>`,
    `<th>GitHub</th>`,
    `<th>BrowserStack</th>`,
    `</tr></thead>`,
    `<tbody>`,
    firstRow,
    `</tbody>`,
    `</table>`,
    `<!-- CONFLUENCE_CI_TABLE_END -->`,
  ].join('\n');
}

// ── Max rows management ─────────────────────────────────────────────────────

const MAX_ROWS = 50;

function insertRowInTable(existingBody, newRow) {
  const tableStartMarker = '<!-- CONFLUENCE_CI_TABLE_START -->';
  const tableEndMarker = '<!-- CONFLUENCE_CI_TABLE_END -->';

  const startIdx = existingBody.indexOf(tableStartMarker);
  const endIdx = existingBody.indexOf(tableEndMarker);

  if (startIdx === -1 || endIdx === -1) {
    // Markers not found — rebuild the page with initial content
    console.log('Table markers not found, rebuilding page content.');
    return buildInitialPageContent(newRow);
  }

  // Extract table section
  const tableSection = existingBody.substring(startIdx, endIdx + tableEndMarker.length);

  // Insert new row after <tbody>
  const tbodyOpen = '<tbody>';
  const tbodyIdx = tableSection.indexOf(tbodyOpen);
  if (tbodyIdx === -1) {
    console.log('<tbody> not found in table, rebuilding.');
    return buildInitialPageContent(newRow);
  }

  const insertPoint = tbodyIdx + tbodyOpen.length;
  let updatedTable = tableSection.substring(0, insertPoint) + '\n' + newRow + tableSection.substring(insertPoint);

  // Enforce max rows: count <tr> in tbody and remove excess
  const tbodyContent = updatedTable.substring(updatedTable.indexOf(tbodyOpen) + tbodyOpen.length, updatedTable.indexOf('</tbody>'));
  const rows = tbodyContent.match(/<tr>[\s\S]*?<\/tr>/g) || [];

  if (rows.length > MAX_ROWS) {
    const keepRows = rows.slice(0, MAX_ROWS);
    const newTbodyContent = '\n' + keepRows.join('\n') + '\n';
    updatedTable = updatedTable.substring(0, updatedTable.indexOf(tbodyOpen) + tbodyOpen.length)
      + newTbodyContent
      + updatedTable.substring(updatedTable.indexOf('</tbody>'));
    console.log(`Trimmed table from ${rows.length} to ${MAX_ROWS} rows.`);
  }

  // Replace table section in full body
  return existingBody.substring(0, startIdx) + updatedTable + existingBody.substring(endIdx + tableEndMarker.length);
}

// ── Confluence API operations ───────────────────────────────────────────────

async function findPage() {
  const title = encodeURIComponent(config.pageTitle);
  const spaceKey = encodeURIComponent(config.spaceKey);
  const path = `/rest/api/content?title=${title}&spaceKey=${spaceKey}&expand=body.storage,version`;
  const result = await request('GET', path);
  if (result.results && result.results.length > 0) {
    return result.results[0];
  }
  return null;
}

async function createPage(content) {
  const body = {
    type: 'page',
    title: config.pageTitle,
    space: { key: config.spaceKey },
    body: {
      storage: {
        value: content,
        representation: 'storage',
      },
    },
  };

  if (config.parentPageId) {
    body.ancestors = [{ id: config.parentPageId }];
  }

  const page = await request('POST', '/rest/api/content', body);
  return page;
}

async function updatePage(pageId, currentVersion, newContent) {
  const body = {
    id: pageId,
    type: 'page',
    title: config.pageTitle,
    space: { key: config.spaceKey },
    version: { number: currentVersion + 1 },
    body: {
      storage: {
        value: newContent,
        representation: 'storage',
      },
    },
  };

  const page = await request('PUT', `/rest/api/content/${pageId}`, body);
  return page;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  validateConfig();

  console.log('==============================================');
  console.log('[Confluence Report] Starting update');
  console.log(`  URL:    ${config.confluenceUrl}`);
  console.log(`  Space:  ${config.spaceKey}`);
  console.log(`  Page:   ${config.pageTitle}`);
  console.log(`  Result: ${reportData.testResult}`);
  console.log(`  Scope:  ${reportData.testScope}`);
  console.log(`  Device: ${reportData.deviceName}`);
  console.log('==============================================');

  const newRow = buildNewRow();

  // Check if page already exists
  let page = await findPage();

  if (page) {
    console.log(`Page found: ${page.id} (version ${page.version.number})`);
    const existingBody = page.body.storage.value;
    const updatedContent = insertRowInTable(existingBody, newRow);

    await updatePage(page.id, page.version.number, updatedContent);
    console.log(`Page updated successfully (version ${page.version.number + 1}).`);
  } else {
    console.log('Page not found, creating new page...');
    const initialContent = buildInitialPageContent(newRow);
    page = await createPage(initialContent);
    console.log(`Page created: ${page.id}`);
  }

  const pageUrl = `${config.confluenceUrl}/spaces/${config.spaceKey}/pages/${page.id}`;
  console.log('==============================================');
  console.log('[Confluence Report] Completed');
  console.log(`  View: ${pageUrl}`);
  console.log('==============================================');
}

main().catch(err => {
  console.error('[Confluence Report] Error:', err.message);
  process.exit(1);
});
