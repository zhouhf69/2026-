import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:4173";
const outputDir = "/workspace/artifacts/previews";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1720, height: 980 } });

await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${outputDir}/01-login.png`, fullPage: true });

await page.getByRole("button", { name: "离线演示登录" }).click();
await page.waitForURL("**/dashboard");
await page.waitForTimeout(700);
await page.screenshot({ path: `${outputDir}/02-dashboard.png`, fullPage: true });

await page.goto(`${baseUrl}/transformation`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: `${outputDir}/03-transformation.png`, fullPage: true });

await page.goto(`${baseUrl}/permissions`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: `${outputDir}/04-rbac.png`, fullPage: true });

await page.goto(`${baseUrl}/system-settings`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: `${outputDir}/05-system-settings.png`, fullPage: true });

await browser.close();
console.log("Preview screenshots saved under /workspace/artifacts/previews");
