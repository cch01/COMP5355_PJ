import {launch} from "puppeteer";
import 'console.table';
import { Cookie } from "./models";
import HTML from "./html"

const URLs: string[] = [
    "https://www.ons.gov.uk/visualisations/dvc368/dashboard/index.html",
    "https://www.ons.gov.uk/visualisations/dvc638/maps/flow/",

]

const getCookiesFromPage = async() => {
    return new Promise(async(resolve, reject) => {
        const cookieGets = URLs.map((url, index) => {
            return new Promise(async(resolve, reject) => {
                try {
                    const browser = await launch();
                    const page = await browser.newPage();
                    console.log(`navigating to ${url} ...`)
                    await page.goto(url);
                    //await page.screenshot({path: index+'.png'});
                    const data = await (page as any)._client.send('Network.getAllCookies'); 
                    await browser.close();
                    resolve(data.cookies)
                }catch(error) {
                    console.error(error)
                    reject(error)
                }
            })
        })
        await Promise.all(cookieGets).then(result => {resolve(result)}).catch((error)=>{reject(error)})     
    })
}

const arrFlatten = (arr: any): Array<Cookie> => {
    return [].concat.apply([], arr)
}

// const removeDuplicates = (arr) => {
//     return [...new Set(arr)]
// }

(async ()=> {
    const allCookies = await getCookiesFromPage().then(result => {
        return arrFlatten(result)
    })
    //const uniqueCookies = removeDuplicates(allCookies)
    console.clear()
    console.table(allCookies)
    console.log(`Total of ${allCookies.length} cookies found`)
    HTML.createFile(allCookies)
})();