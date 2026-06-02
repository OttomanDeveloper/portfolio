import { readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import sharp from 'sharp';
const roots = {
  saveit: 'D:/FlutterProject/saveit',
  fbsaver: 'D:/FlutterProject/fbsaver',
  statusgetter: 'D:/statusgetter',
  udownload: 'D:/ClientProjects/fahad_hanif/udownload',
};
const IMG = new Set(['.png', '.jpg', '.jpeg', '.webp']);
function walk(dir, acc, depth = 0) {
  if (depth > 6) return;
  let ents;
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (['build', '.git', 'node_modules', '.dart_tool', 'ios', 'windows', 'macos', 'linux'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc, depth + 1);
    else if (IMG.has(extname(e.name).toLowerCase())) acc.push(p);
  }
}
for (const [name, root] of Object.entries(roots)) {
  const files = [];
  walk(root, files);
  const rows = [];
  for (const f of files) {
    try { const m = await sharp(f).metadata(); rows.push([relative(root, f), m.width, m.height]); } catch {}
  }
  rows.sort((a, b) => (b[2] || 0) - (a[2] || 0));
  console.log('\n===== ' + name + ' (' + rows.length + ' images) =====');
  for (const [p, w, h] of rows) {
    const ratio = (h && w) ? (h / w).toFixed(2) : '?';
    const tall = h >= 900 && (h / w) >= 1.6;
    console.log((tall ? 'SHOT ' : '     ') + w + 'x' + h + '  r' + ratio + '  ' + p);
  }
}
