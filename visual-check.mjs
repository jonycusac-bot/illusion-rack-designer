import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });
const click = async (text) => {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const label = await button.evaluate(el => (el.innerText || '').replace(/\s+/g, ' ').trim());
    if (label.toLowerCase().includes(text.toLowerCase())) {
      await button.evaluate(el => el.click());
      return;
    }
  }
  throw new Error(`No encontrado: ${text}`);
};
await click('Modo Demostración');
await new Promise(resolve => setTimeout(resolve, 300));
await click('Redes');
await click('UniFi Dream Machine Pro');
await click('UniFi Switch Pro 48 PoE');
await click('Audio');
await click('Sonos Amp');
await click('Sonos Amp');
await new Promise(resolve => setTimeout(resolve, 300));
await page.screenshot({ path: 'C:/Users/Usuario/AppData/Local/hermes/profiles/creativo/workspace/illusion-rack-designer/audit-output/06-documentation-card.png', fullPage: true });
console.log(await page.evaluate(() => ({
  pdfButton: [...document.querySelectorAll('button')].find(b => b.innerText.includes('dossier PDF'))?.innerText,
  documentationTitle: document.body.innerText.includes('Documentación del proyecto'),
  bodyWidth: document.body.scrollWidth,
  viewportWidth: document.body.clientWidth
})));
await browser.close();
