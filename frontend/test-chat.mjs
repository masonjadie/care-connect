import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4200');
  await page.waitForTimeout(3000); // Wait for autoGreeting
  await page.screenshot({ path: 'chat_screenshot.png' });
  await browser.close();
})();
