// Renders public/icons/icon.svg into the PNG sizes required by the web app manifest.
// Usage: node scripts/generate-icons.mjs  (requires Playwright + Chromium)
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const svg = await readFile(new URL("../public/icons/icon.svg", import.meta.url), "utf8");
const browser = await chromium.launch();
const page = await browser.newPage();

async function render(size, file, { maskable = false } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const inner = maskable ? size * 0.8 : size;
  const body = maskable
    ? `<div style="width:${size}px;height:${size}px;background:#1a73e8;display:grid;place-items:center">${svg.replace("<svg", `<svg width="${inner}" height="${inner}"`)}</div>`
    : svg.replace("<svg", `<svg width="${size}" height="${size}"`);
  await page.setContent(`<html><body style="margin:0;background:transparent">${body}</body></html>`);
  await page.screenshot({ path: new URL(`../public/icons/${file}`, import.meta.url).pathname, omitBackground: true });
}

await render(192, "icon-192.png");
await render(512, "icon-512.png");
await render(512, "icon-maskable-512.png", { maskable: true });
await browser.close();
