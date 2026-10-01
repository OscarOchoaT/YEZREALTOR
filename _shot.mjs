import puppeteer from "puppeteer-core";

const out = "C:/Users/oscar/AppData/Local/Temp/claude/E--OSCAROCHOASTUDIO-YEZREALTOR/88156b37-d382-41d3-b2b1-6d28087df7db/scratchpad";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3456/", { waitUntil: "networkidle0" });
await page.screenshot({ path: `${out}/g1-early.png` });
await wait(600);
await page.screenshot({ path: `${out}/g1-mid.png` });
await wait(3000);
await page.screenshot({ path: `${out}/g1-done.png` });
const btns = await page.evaluate(() => [...document.querySelectorAll(".entry-gate button")].map((b) => b.textContent));
console.log("step1 buttons", btns, page.url());

const startPath = new URL(page.url()).pathname;
const target = startPath === "/en" ? "Español" : "English";
await page.evaluate((t) => [...document.querySelectorAll(".entry-gate button")].find((b) => b.textContent === t).click(), target);
await wait(2500);
console.log("after pick", page.url());
await page.screenshot({ path: `${out}/g2.png` });
console.log("checkboxes", await page.evaluate(() => document.querySelectorAll(".entry-gate input").length));
await page.click('.entry-gate input[type="checkbox"]');
await page.evaluate(() => [...document.querySelectorAll(".entry-gate button")].find((b) => /Entr/.test(b.textContent) || /Enter/.test(b.textContent)).click());
await wait(1200);
console.log("gate gone", await page.evaluate(() => !document.querySelector(".entry-gate")), await page.evaluate(() => [localStorage.getItem("yez-entry"), localStorage.getItem("yez-sound")]));
await browser.close();
