import express, { Application, Request, Response } from "express"
import cors from "cors"
import puppeteer from "puppeteer"
import path from "path"
import fs from "fs"

const app: Application = express();

// const URL: string = "https://www.football365.com/"

app.use(cors());
app.use(express.json());


const paparScriptII = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    try {
        const page = await browser.newPage();
        await page.goto("https://footystats.org/", {
            waitUntil: "load",
        });

        // await page.waitForTimeout(3000);

        const scroll = async () => {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
        };

        for (let i: number = 0; i <= 8; i++) {
            await scroll();
            await page.waitForTimeout(3000);
        }
        // await page.screenshot({
        //     path: path.join(__dirname, "images", `./goalll${Math.floor(Math.random() * 1000) + Date.now()}.png`,), fullPage: false
        // });

        const data = await page.evaluate(() => {
            const data = Array.from(document.querySelectorAll("ul"));
            const helper = (data: string) => {
                return parseFloat(data);
            };

            const id:any = `${":data-team-id"}  `

            return data.map((props) => ({
                category: props.querySelector("a")?.getAttribute("href"),

                title: props.querySelector("flag.flag-gb-eng.fa-adjust-14")?.textContent,

                team1: props.querySelector("span.hover-modal-parent.hover-modal-ajax-team")?.textContent,

                odd1: helper(props.querySelector("div.form-box.good")?.textContent!),

                time: props.querySelector("li")?.textContent,
            }));
        });

        fs.writeFile(
            path.join(__dirname, "scrapedData", `./data.json`),
            JSON.stringify(data),
            () => {
                console.log();
                console.log("done scraping");
            }
        );
        console.log(data)
    } catch (error:any) {
        console.log(error.message);
    } finally {
        await browser.close();

        console.log("done");
    }
};

// document.querySelector("#ctlg > div > div:nth-child(8) > section > div > div > div:nth-child(1) > article > a > div.prc")

// #ctlg > div > div: nth - child(7) > section > div > div > div: nth - child(1) > article > a > div.bdg._dsct
paparScriptII();

// async function ourBrowser(
//     article: string
//     //   title: string,
//     //   image: string,
//     //   rating: string,
//     //   url: string
// ) {
//     const browser = await puppeteer.launch({ headless: false });
//     try {
//         const page = await browser.newPage();
//         await page.goto(URL);

//         const scrollDown = async () => {
//             await page.evaluate(() => {
//                 window.scrollBy(0, window.innerHeight);
//             });
//         };

//         for (let i: number = 0; i <= 14; i++) {
//             await scrollDown();
//             await page.waitForTimeout(500);
//         }

//         const data = await page.evaluate((URL) => {
//             const helper = (data: string) => {
//                 return parseFloat(data);
//             };

//             const data = Array.from(document.querySelectorAll(article));
//             return data.map((props) => ({
//                 title: props.querySelector("h3")?.textContent,
//                 img: props.querySelector("img")?.getAttribute("src"),
//                 rating: helper(
//                     props.querySelector("a")?.getAttribute("data-dimension27")!
//                 ),
//                 url: URL + props.querySelector("a")?.getAttribute("href"),
//             }));
//         }, URL);

//         console.log(data);
//         console.log("Article: ", article);
//     } catch (error) {
//         console.log(error);
//     } finally {
//         console.log("done");
//         await browser.close();
//     }
// }

// ourBrowser(
//     "article"
//     //  "h3",
//     //  "img",
//     //  "a",
//     //  "a"
// );

app.get("/", (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: "DevOps web scraping class",
        });
    } catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});

app.listen(3377, () => {
    console.log();
    console.log("server connected...🚀🚀🚀");
});