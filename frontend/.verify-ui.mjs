import { chromium } from "playwright-core";

const SHOT_DIR = process.env.SCREENSHOT_DIR || "/tmp/shots";
import fs from "node:fs";
fs.mkdirSync(SHOT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:5173/login", { waitUntil: "networkidle" });
await page.waitForSelector("text=byterun", { timeout: 10000 });
await page.screenshot({ path: `${SHOT_DIR}/login.png` });

await page.goto("http://localhost:5173/register", { waitUntil: "networkidle" });
await page.waitForSelector("text=byterun", { timeout: 10000 });
await page.screenshot({ path: `${SHOT_DIR}/register.png` });

const uniq = Date.now();
await page.fill('#username', `uitest${uniq}`);
await page.fill('#email', `uitest${uniq}@example.com`);
await page.fill('#password', "TestPassword123!");
await page.fill('#confirmPassword', "TestPassword123!");
await page.click('button:has-text("Sign up")');
await page.waitForTimeout(2000);
console.log("url right after signup click:", page.url());
await page.screenshot({ path: `${SHOT_DIR}/after-signup.png` });

await page.waitForSelector("select", { timeout: 15000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${SHOT_DIR}/dashboard.png` });

console.log("current url after signup:", page.url());
console.log("console/page errors so far:", JSON.stringify(errors));

await browser.close();
