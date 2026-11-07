/**
 * 将贴边连通的深色背景变为透明，保留圆内与背景不相连的图形（如脉线）。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public/brand/dbcnet-mark-source.png");
const output = path.join(root, "public/brand/dbcnet-mark.png");

const DARK = 48; // 视为背景的亮度上限（RGB 和）

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const n = w * h;
  const out = Buffer.from(data);
  const vis = new Uint8Array(n);
  const q = [];

  const dark = (i) => {
    const o = i * 4;
    return out[o + 3] > 0 && out[o] + out[o + 1] + out[o + 2] <= DARK;
  };

  const push = (i) => {
    if (i < 0 || i >= n || vis[i]) return;
    if (!dark(i)) return;
    vis[i] = 1;
    q.push(i);
  };

  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }

  while (q.length) {
    const i = q.pop();
    const y = Math.floor(i / w);
    const x = i - y * w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (y > 0) push(i - w);
    if (y < h - 1) push(i + w);
  }

  for (let i = 0; i < n; i++) {
    if (vis[i]) out[i * 4 + 3] = 0;
  }

  await sharp(out, {
    raw: {
      width: w,
      height: h,
      channels: 4,
    },
  })
    .png()
    .toFile(output);

  console.log("Wrote", output);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
