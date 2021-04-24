const puppeteer = require('puppeteer');

let browser = null;

async function ssr(path, port) {

  let html = '';
  let page = null
  try {
    if(browser == null)
    {
      browser = await puppeteer.launch({ headless: true, args: [`--user-agent=Puppeteer SSR`]});
    }
      
    const url = `http://localhost:${port}${path}`;    
    page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', req => {
      const allowlist = ['document', 'script', 'xhr', 'fetch'];
      if (!allowlist.includes(req.resourceType())) {
        return req.abort();
      }
      req.continue();
    });

    await page.goto(url, {waitUntil: 'networkidle0'});
    //html = await page.content();
    html = await page.evaluate(() => {
      for (const script of document.documentElement.querySelectorAll('script')) script.remove();
      for (const link of document.documentElement.querySelectorAll('link')) link.remove();
      return document.documentElement.innerHTML;
    });

  } catch (err) {
    console.error(err);
  }

  await page.close();
  return html;  
}

module.exports = ssr;