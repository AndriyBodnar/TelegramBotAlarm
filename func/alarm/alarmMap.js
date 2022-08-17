import "dotenv/config";
import puppeteer from "puppeteer";
import { delay } from "../helpFunction/helpFunc.js";
import cron from "node-cron";

export async function alarmMap() {
  const browser = await puppeteer
    .launch({
      // args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // executablePath: "/usr/bin/chromium-browser",
      // headless: true,
    })
    .catch((e) => console.log(e));
  const page = await browser.newPage().catch((e) => console.log(e));
  await page
    .goto(process.env.URL_MAP, {
      darkMode: true,
    })
    .catch((e) => console.log(e));
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "dark" },
  ]);
  await page.addStyleTag({
    content: ` body{
          background-color: #15212f
        }
                `,
  });

  await delay(3000);
  await page.screenshot({
    path: "assets/img/screenshotMap.png",
  });

  await browser.close();
}

alarmMap();

cron.schedule("*/30 * * * * *", alarmMap, {
  timezone: "Europe/Kiev",
});
