#!/usr/bin/env node

/**
 * Fetch BrowserStack build link by build name and expose it for GitHub Actions.
 * Requires env: BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY, BROWSERSTACK_BUILD_NAME.
 */

const https = require('https');

const {
  BROWSERSTACK_USERNAME,
  BROWSERSTACK_ACCESS_KEY,
  BROWSERSTACK_BUILD_NAME,
  GITHUB_OUTPUT
} = process.env;

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY || !BROWSERSTACK_BUILD_NAME) {
  fail('Missing required env vars: BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY, BROWSERSTACK_BUILD_NAME');
}

function fetchBuilds() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.browserstack.com',
      path: '/automate/builds.json?limit=50',
      method: 'GET',
      auth: `${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}`
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`BrowserStack API returned ${res.statusCode}: ${data}`));
        }
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('Fetching BrowserStack builds to locate link...');
  const builds = await fetchBuilds();

  const match = builds.find(item => {
    const name = item?.automation_build?.name;
    return name === BROWSERSTACK_BUILD_NAME;
  });

  if (!match) {
    console.log(`No build found with name: ${BROWSERSTACK_BUILD_NAME}`);
    return;
  }

  const build = match.automation_build;
  const hashedId = build.hashed_id;

  const buildUrl = hashedId
    ? `https://automate.browserstack.com/dashboard/v2/builds/${hashedId}`
    : build.url || '';

  if (!buildUrl) {
    console.log('Build found but no URL returned.');
    return;
  }

  console.log(`BrowserStack build URL: ${buildUrl}`);

  // Export for GitHub Actions
  if (GITHUB_OUTPUT) {
    const fs = require('fs');
    fs.appendFileSync(GITHUB_OUTPUT, `build_url=${buildUrl}\n`);
  }
}

main().catch(err => {
  console.error('Error fetching BrowserStack build link:', err.message);
  process.exit(1);
});