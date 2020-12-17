import { launch } from "puppeteer";
import 'console.table';
import { Cookie } from "./models";
import HTML from "./html";
import { checklist } from "./checklist";
import * as moment from "moment";

const getCookiesFromPage = async () => {
  return new Promise(async (resolve) => {
    const cookieGets = checklist.map((url, index) => {
      return new Promise(async (resolve) => {
        try {
          const browser = await launch();
          const page = await browser.newPage();
          await page.setDefaultTimeout(90000);
          console.log(`navigating to ${url} ...`)
          await page.goto(url);
          await page.screenshot({path: index+'.png'});
          const data = await (page as any)._client.send('Network.getAllCookies');
          await browser.close();
          const cookiesWithUrl = data.cookies.map(cookie => { 
            cookie.expires = moment.unix(cookie.expires).toLocaleString();
            return { originalWebsite: url, ...cookie  } 
          });
          return resolve(cookiesWithUrl);
        } catch (error) {
          console.error(error)
        }
      })
    })
    await Promise.all(cookieGets).then(result => resolve(result)).catch((error) => null)
  })
}

const arrFlatten = (arr: any): Array<Cookie> => {
  return [].concat.apply([], arr)
}

(async () => {
  const allCookies = await getCookiesFromPage().then(result => {
    return arrFlatten(result)
  })
  console.log(`Total of ${allCookies.length} cookies found`)
  HTML.createFile(allCookies)
})();