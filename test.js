const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
// const fs = require("fs");
// // require('events').EventEmitter.defaultMaxListeners = Infinity;
// const xlsx = require('xlsx')
// // var wb = xlsx.readFile(process.argv[3])
// var ws = wb.Sheets['Шаблон для поставщика']


const LAUNCH_PUPPETEER_OPTS = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  };

  const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000
  };


const str = 'https://www.detmir.ru/catalog/index/name/podushki/page/100500/'
getCoords(str)
async function getCoords(uri){
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
    const lilPage = await browser.newPage(PAGE_PUPPETEER_OPTS)
    await lilPage.goto(uri, PAGE_PUPPETEER_OPTS)
    
    const header = await lilPage.$('div["_4v"]');
    const rect = await lilPage.evaluate((header) => {
    const {top, left, bottom, right} = header.getBoundingClientRect();
    return {top, left, bottom, right};
  }, header);
  console.log(rect);
const content = await lilPage.content()
    await browser.close()
        return content;
}

// getPageContent(str)

// async function getPageContent(uri){
//     const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
//     const lilPage = await browser.newPage(PAGE_PUPPETEER_OPTS)
//     await lilPage.goto(uri, PAGE_PUPPETEER_OPTS)
//     const content = await lilPage.content()
//     browser.close()
//         return content;
// }