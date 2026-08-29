import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const out = 'C:/Users/Usuario/AppData/Local/hermes/profiles/creativo/workspace/illusion-rack-designer/audit-output';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') errors.push(`[console:${msg.type()}] ${msg.text()}`); });
page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`));
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0', timeout: 60000 });
await page.screenshot({ path: path.join(out, '01-login-desktop.png'), fullPage: true });

async function clickButton(text) {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const label = await button.evaluate(el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim());
    if (label.toLocaleLowerCase('es').includes(text.toLocaleLowerCase('es'))) { await button.click(); return label; }
  }
  throw new Error(`Button not found: ${text}`);
}

await clickButton('Modo Demostración');
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(out, '02-designer-empty.png'), fullPage: true });

await clickButton('Redes');
await new Promise(r => setTimeout(r, 100));
await clickButton('UniFi Dream Machine Pro');
await clickButton('UniFi Switch Pro 48 PoE');
await clickButton('Audio');
await new Promise(r => setTimeout(r, 100));
await clickButton('Sonos Amp');
await clickButton('Sonos Amp');
await clickButton('Cinema');
await new Promise(r => setTimeout(r, 100));
await clickButton('Marantz AV Processor');
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(out, '03-designer-configured.png'), fullPage: true });

const metrics = await page.evaluate(() => ({
  bodyScrollWidth: document.body.scrollWidth,
  bodyClientWidth: document.body.clientWidth,
  bodyScrollHeight: document.body.scrollHeight,
  bodyClientHeight: document.body.clientHeight,
  text: document.body.innerText,
  buttons: [...document.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean)
}));

const client = await page.createCDPSession();
await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: out });
await clickButton('DESCARGAR DOSSIER');
let downloaded = null;
for (let i = 0; i < 60; i++) {
  await new Promise(r => setTimeout(r, 500));
  const pdfs = fs.readdirSync(out).filter(f => f.toLowerCase().endsWith('.pdf'));
  if (pdfs.length) { downloaded = pdfs[0]; break; }
}

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.reload({ waitUntil: 'networkidle0' });
await page.screenshot({ path: path.join(out, '04-login-mobile.png'), fullPage: true });
await clickButton('Modo Demostración');
await new Promise(r => setTimeout(r, 500));
const mobileMetrics = await page.evaluate(() => ({
  bodyScrollWidth: document.body.scrollWidth,
  bodyClientWidth: document.body.clientWidth,
  bodyScrollHeight: document.body.scrollHeight,
  bodyClientHeight: document.body.clientHeight,
  htmlScrollWidth: document.documentElement.scrollWidth,
  htmlClientWidth: document.documentElement.clientWidth
}));
await page.screenshot({ path: path.join(out, '05-designer-mobile.png'), fullPage: true });

fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify({ metrics, mobileMetrics, errors, downloaded }, null, 2));
console.log(JSON.stringify({ metrics: { ...metrics, text: metrics.text.slice(0, 1200), buttons: metrics.buttons.slice(0, 30) }, mobileMetrics, errors, downloaded }, null, 2));
await browser.close();
