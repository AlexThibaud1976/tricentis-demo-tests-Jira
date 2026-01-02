#!/usr/bin/env node

/**
 * Generate PDF from Playwright HTML report
 * Uses Playwright's built-in PDF generation for reliable conversion
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const htmlPath = path.resolve('playwright-report/index.html');
  const pdfPath = path.resolve('playwright-report/report.pdf');

  console.log('================================================');
  console.log('PDF GENERATION FROM HTML REPORT');
  console.log('================================================');

  // Check if HTML report exists
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Error: HTML report not found at', htmlPath);
    process.exit(1);
  }

  console.log('✓ HTML report found:', htmlPath);
  console.log('📄 Generating PDF...');

  let browser;
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Load the HTML file
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for content to be fully loaded
    await page.waitForTimeout(2000);

    // Generate PDF with proper options
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('✅ PDF generated successfully:', pdfPath);

    // Check PDF file size
    const stats = fs.statSync(pdfPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 PDF size: ${fileSizeInKB} KB`);

    if (stats.size < 1024) {
      console.warn('⚠️  Warning: PDF file is very small, may be empty or incomplete');
    }

  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log('================================================');
  console.log('PDF GENERATION COMPLETE');
  console.log('================================================');
}

// Run the script
generatePDF().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
