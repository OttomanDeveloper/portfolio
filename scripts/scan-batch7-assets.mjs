import { readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import sharp from 'sharp';
const roots = {
  grouper: 'D:/FlutterProject/grouper',
  grouper_admin: 'D:/FlutterProject/grouper_admin',
  footballwallpaper: 'D:/FlutterProject/footballwallpaper',
  WallpaperAdmin: 'D:/FlutterProject/WallpaperAdmin',
  bill_checker: 'D:/FlutterProject/bill_checker',
  hostelfinder: 'D:/ClientProjects/hostelfinder',
  adminhostelfinder: 'D:/ClientProjects/adminhostelfinder',
  meetbook: 'D:/ClientProjects/fahad_hanif/meetbook',
};
const IMG = new Set(['.png', '.jpg', '.jpeg', '.webp']);
function walk(dir, acc, depth = 0) {
  if (depth > 7) return;
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
  // only print likely-screenshot candidates (tall, h>=900) + a count of the rest
  const shots = rows.filter(([p, w, h]) => h >= 900 && (h / w) >= 1.6);
  console.log('\n===== ' + name + ' (' + rows.length + ' images, ' + shots.length + ' tall-candidates) =====');
  for (const [p, w, h] of shots) console.log('  SHOT ' + w + 'x' + h + '  r' + (h / w).toFixed(2) + '  ' + p);
  // also show any medium images that might be framed mockups (h 500-900)
  const med = rows.filter(([p, w, h]) => h >= 500 && h < 900 && (h / w) >= 1.2);
  for (const [p, w, h] of med.slice(0, 8)) console.log('  med? ' + w + 'x' + h + '  r' + (h / w).toFixed(2) + '  ' + p);
}
