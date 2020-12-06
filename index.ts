import { launch } from "puppeteer";
import 'console.table';
import { Cookie } from "./models";
import HTML from "./html";
import { checklist } from "./checklist";

const getCookiesFromPage = async () => {
  return new Promise(async (resolve, reject) => {
    const cookieGets = checklist.map((url, index) => {
      return new Promise(async (resolve, reject) => {
        try {
          const browser = await launch();
          const page = await browser.newPage();
          await page.setDefaultTimeout(90000);
          console.log(`navigating to ${url} ...`)
          await page.goto(url).catch(e => null);
          await page.screenshot({path: index+'.png'});
          const data = await (page as any)._client.send('Network.getAllCookies');
          await browser.close();
          const cookiesWithUrl = data.cookies.map(cookie => { return { originalWebsite: url, ...cookie  } });
          resolve(cookiesWithUrl);
        } catch (error) {
          console.error(error)

        }
      })
    })
    await Promise.all(cookieGets).then(result => { resolve(result) }).catch((error) => { })
  })
}

const arrFlatten = (arr: any): Array<Cookie> => {
  return [].concat.apply([], arr)
}

// const removeDuplicates = (arr) => {
//     return [...new Set(arr)]
// }

(async () => {
  const allCookies = await getCookiesFromPage().then(result => {
    return arrFlatten(result)
  })
  //const uniqueCookies = removeDuplicates(allCookies)
  // console.clear()
  // console.table(allCookies)
  console.log(`Total of ${allCookies.length} cookies found`)
  HTML.createFile(allCookies)
})();