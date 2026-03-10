import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3001';
const ROUTES = [
  '/',
  '/admin/login',
  '/admin/dashboard',
  '/admin/projects',
  '/admin/experience',
  '/admin/reviews',
  '/admin/messages',
  '/admin/about',
  '/admin/settings'
];

const VIEWPORTS = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 }
];

async function runAudit() {
  console.log('🚀 Starting Comprehensive automated audit...\n');
  const browser = await chromium.launch({ headless: true });
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const viewport of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`📱 Testing Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log(`======================================================\n`);
    
    // Create an isolated context for this viewport
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    
    for (const route of ROUTES) {
      console.log(`  🔍 Auditing: ${route}`);
      const url = `${BASE_URL}${route}`;
      
      let pageErrors = [];
      let consoleErrors = [];
      
      // Catch exceptions
      page.on('pageerror', exception => {
        pageErrors.push(exception.message);
        totalErrors++;
      });
      
      // Catch console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          // consoleErrors.push(msg.text()); // Mute generic text if we capture responses
        }
        if (msg.type() === 'warning') {
            totalWarnings++;
        }
      });

      page.on('response', response => {
        if (!response.ok() && response.status() === 404) {
          if (!response.url().includes('_vercel/speed-insights')) {
            consoleErrors.push(`[404] ${response.url()}`);
            totalErrors++;
          }
        }
      });

      try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        
        if (!response.ok()) {
           console.log(`    ❌ [HTTP ERROR] ${response.status()} on ${route}`);
           totalErrors++;
        }

        // Simulate scrolling to trigger all intersection observers / animations
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });

        // Give React a second to settle any delayed renders
        await page.waitForTimeout(1000);
        
        if (pageErrors.length > 0) {
           console.log(`    🚨 [PAGE EXCEPTIONS] (${pageErrors.length})`);
           pageErrors.forEach(e => console.log(`       - ${e.substring(0, 150)}...`));
        }
        
        if (consoleErrors.length > 0) {
           console.log(`    ❗ [CONSOLE ERRORS] (${consoleErrors.length})`);
           // Filter out known noisy React dev errors if any, usually we want to see them all
           consoleErrors.forEach(e => console.log(`       - ${e.substring(0, 150)}...`));
        }

        if (pageErrors.length === 0 && consoleErrors.length === 0 && response.ok()) {
           console.log(`    ✅ Clean`);
        }

      } catch (err) {
        console.log(`    ❌ [NAVIGATION FAILED] ${err.message}`);
        totalErrors++;
      }
    }
    await context.close();
  }
  
  await browser.close();
  
  console.log('\n======================================================');
  console.log(`🏁 Audit Complete! Total Errors: ${totalErrors} | Total Warnings: ${totalWarnings}`);
  
  if (totalErrors > 0) {
      process.exit(1);
  } else {
      process.exit(0);
  }
}

runAudit().catch(console.error);
