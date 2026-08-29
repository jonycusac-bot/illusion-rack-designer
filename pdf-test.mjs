import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const out='C:/Users/Usuario/AppData/Local/hermes/profiles/creativo/workspace/illusion-rack-designer/audit-output/pdf-test';
fs.mkdirSync(out,{recursive:true});
for(const f of fs.readdirSync(out)) fs.unlinkSync(`${out}/${f}`);
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
const browserSession=await browser.target().createCDPSession();
await browserSession.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:out,eventsEnabled:true});
const page=await browser.newPage();
page.on('console',m=>console.log('CONSOLE',m.type(),m.text()));
page.on('pageerror',e=>console.log('PAGEERROR',e.message));
await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle0'});
const click=async t=>{const hs=await page.$$('button');for(const h of hs){const x=await h.evaluate(e=>e.innerText);if(x.toLowerCase().includes(t.toLowerCase())){await h.evaluate(e=>e.click());return x;}}throw Error('not found '+t)};
await click('Modo Demostración');
await new Promise(r=>setTimeout(r,300));
await page.evaluate(() => {
  window.__downloads = [];
  window.__errors = [];
  const originalError = console.error;
  console.error = (...args) => { window.__errors.push(args.map(a => String(a)).join(' ')); originalError(...args); };
  const originalClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function() {
    window.__downloads.push({ href: this.href, download: this.download });
    return originalClick.call(this);
  };
});
console.log('REACT PROPS', await page.evaluate(() => {
  const b=[...document.querySelectorAll('button')].find(e=>e.innerText.includes('PDF'));
  const key=Object.keys(b).find(k=>k.startsWith('__reactProps$'));
  return {key, propKeys:key?Object.keys(b[key]):[], onClickType:key?typeof b[key].onClick:'none', onClickSource:key?b[key].onClick.toString().slice(0,300):''};
}));
console.log('CLICK', await page.evaluate(() => {
  const b=[...document.querySelectorAll('button')].find(e=>e.innerText.includes('PDF'));
  const key=Object.keys(b).find(k=>k.startsWith('__reactProps$'));
  b[key].onClick();
  return b.innerText;
}));
await new Promise(r=>setTimeout(r,500));
console.log('PAGE STATE', await page.evaluate(() => ({ errors: window.__errors, downloads: window.__downloads, pdfButtons: [...document.querySelectorAll('button')].filter(b => b.innerText.includes('PDF') || b.innerText.includes('Generando')).map(b => ({text:b.innerText,disabled:b.disabled,outer:b.outerHTML.slice(0,800)})) })));
for(let i=0;i<5;i++){await new Promise(r=>setTimeout(r,500));const files=fs.readdirSync(out);if(i%10===0) console.log('FILES',i,files);if(files.some(f=>f.endsWith('.pdf'))){console.log('DOWNLOADED',files);break;}}
console.log('FINAL',fs.readdirSync(out));
await browser.close();
