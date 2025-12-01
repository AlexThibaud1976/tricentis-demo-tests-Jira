/**
 * Reporter personnalisé pour BrowserStack
 * Met à jour automatiquement le statut des tests dans BrowserStack
 */

class BrowserStackReporter {
  constructor() {
    this.results = [];
  }

  onBegin(config, suite) {
    console.log(`🚀 Démarrage des tests BrowserStack - Build: ${process.env.BROWSERSTACK_BUILD_NAME || 'Local'}`);
    console.log(`   Configuration: ${process.env.BS_OS || 'Windows'} ${process.env.BS_OS_VERSION || '11'} - ${process.env.BS_BROWSER || 'Chrome'} ${process.env.BS_BROWSER_VERSION || 'latest'}`);
    console.log(`   Workers: ${process.env.BS_WORKERS || '5'}`);
  }

  onTestEnd(test, result) {
    const testName = test.titlePath().slice(1).join(' › ');
    const status = result.status === 'passed' ? '✅' : '❌';
    
    this.results.push({
      name: testName,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
    });

    console.log(`${status} ${testName} (${(result.duration / 1000).toFixed(2)}s)`);
  }

  async onEnd(result) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;

    console.log('\n📊 Résumé BrowserStack:');
    console.log(`   Total: ${total} tests`);
    console.log(`   ✅ Réussis: ${passed}`);
    console.log(`   ❌ Échoués: ${failed}`);
    console.log(`   ⏱️  Durée totale: ${(result.duration / 1000).toFixed(2)}s`);
    
    if (process.env.BROWSERSTACK_USERNAME) {
      console.log(`\n🔗 Voir les résultats: https://automate.browserstack.com/dashboard/v2`);
    }
  }
}

module.exports = BrowserStackReporter;
