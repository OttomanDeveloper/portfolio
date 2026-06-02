// scripts/gen-batch3-mockups.mjs
// Hand-designed SVG screen mockups -> AVIF for projects with NO real screenshots.
// Faithful to each app's REAL brand colours/labels/features pulled from source.
//   daghta       (Arabic-first social-media downloader + file manager): blue   #0776E8
//   puzzleur     (HTML5 games hub via WebView + AdMob):                 purple #8E47F8 / #3A1688
//   blood-donors (offline-first emergency donor locator, PK):          red    #D60033 / pink #FBE5EB
//   snaptok      (multi-platform no-watermark video downloader):       dark   #121212 / coral #df4759
// Phone canvas 540x1200 (9:20), rasterized by sharp. Fonts: Segoe UI / Arial.
import sharp from 'sharp';
import { resolve, join } from 'node:path';

const OUT = resolve('./public/screens');
const W = 540, H = 1200;
const FONT = `'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rect = (x, y, w, h, r, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, s, { size = 20, fill = '#fff', weight = 400, anchor = 'start', spacing = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''}>${esc(s)}</text>`;
const circle = (cx, cy, r, fill, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, w = 2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;
const path = (d, { fill = 'none', stroke = 'none', w = 2 } = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const tri = (cx, cy, r, fill) => path(`M ${cx - r * 0.5} ${cy - r * 0.62} L ${cx + r * 0.7} ${cy} L ${cx - r * 0.5} ${cy + r * 0.62} Z`, { fill });
const star = (cx, cy, r, fill) => {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const ao = -Math.PI / 2 + (i * 2 * Math.PI) / 5, ai = ao + Math.PI / 5;
    d += `${i ? 'L' : 'M'} ${(cx + r * Math.cos(ao)).toFixed(1)} ${(cy + r * Math.sin(ao)).toFixed(1)} `;
    d += `L ${(cx + r * 0.45 * Math.cos(ai)).toFixed(1)} ${(cy + r * 0.45 * Math.sin(ai)).toFixed(1)} `;
  }
  return path(d + 'Z', { fill });
};
const statusBar = (dark = false) => {
  const c = dark ? '#fff' : '#1A1430';
  return `${text(28, 30, '9:41', { size: 19, fill: c, weight: 700 })}
    ${[0, 1, 2, 3].map((i) => rect(W - 116 + i * 7, 20 - i * 2, 4, 6 + i * 4, 1, c)).join('')}
    ${path(`M ${W - 78} 18 a 9 9 0 0 1 13 0`, { stroke: c, w: 2 })}
    ${path(`M ${W - 74} 22 a 4 4 0 0 1 5 0`, { stroke: c, w: 2 })}
    ${circle(W - 71.5, 26, 1.4, c)}
    ${rect(W - 52, 16, 26, 13, 3, 'none', `stroke="${c}" stroke-width="1.6"`)}
    ${rect(W - 49, 19, 18, 7, 1.5, c)}
    ${rect(W - 25, 19, 2, 6, 1, c)}`;
};
const wrap = (bg, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${bg}${inner}</svg>`;
async function render(name, svg) {
  await sharp(Buffer.from(svg)).resize(W, H).avif({ quality: 70, effort: 6 }).toFile(join(OUT, `${name}.avif`));
  console.log(`✓ ${name}.avif`);
}

// generic 3/4-tab bottom nav with simple glyphs
function bottomNav(items, active, { card, on, off, h = 88 }) {
  const n = items.length, pad = 54, dx = (W - pad * 2) / (n - 1);
  let s = rect(0, H - h, W, h, 0, card, `stroke="rgba(0,0,0,.06)" stroke-width="1"`);
  items.forEach((it, i) => {
    const x = pad + i * dx, c = i === active ? on : off, fill = i === active ? on : 'none';
    let ic = '';
    const yy = H - h + 26;
    if (it.g === 'home') ic = path(`M ${x - 11} ${yy + 4} L ${x} ${yy - 7} L ${x + 11} ${yy + 4} L ${x + 11} ${yy + 16} L ${x - 11} ${yy + 16} Z`, { stroke: c, w: 2.2, fill });
    if (it.g === 'search') ic = circle(x - 3, yy + 2, 9, 'none', `stroke="${c}" stroke-width="2.2"`) + line(x + 5, yy + 10, x + 11, yy + 16, c, 2.4);
    if (it.g === 'files') ic = path(`M ${x - 12} ${yy - 4} h 7 l 3 4 h 14 v 16 h -24 Z`, { stroke: c, w: 2.2, fill });
    if (it.g === 'settings') ic = circle(x, yy + 5, 6, 'none', `stroke="${c}" stroke-width="2.2"`) + [0, 60, 120, 180, 240, 300].map((a) => { const rad = a * Math.PI / 180; return line(x + Math.cos(rad) * 9, yy + 5 + Math.sin(rad) * 9, x + Math.cos(rad) * 13, yy + 5 + Math.sin(rad) * 13, c, 2.2); }).join('');
    if (it.g === 'down') ic = line(x, yy - 7, x, yy + 9, c, 2.4) + path(`M ${x - 7} ${yy + 2} L ${x} ${yy + 9} L ${x + 7} ${yy + 2}`, { stroke: c, w: 2.4 }) + line(x - 9, yy + 16, x + 9, yy + 16, c, 2.4);
    if (it.g === 'menu') ic = [0, 7, 14].map((o) => line(x - 11, yy - 3 + o, x + 11, yy - 3 + o, c, 2.4)).join('');
    if (it.g === 'add') ic = circle(x, yy + 4, 12, 'none', `stroke="${c}" stroke-width="2.2"`) + line(x - 6, yy + 4, x + 6, yy + 4, c, 2.2) + line(x, yy - 2, x, yy + 10, c, 2.2);
    if (it.g === 'user') ic = circle(x, yy, 6, 'none', `stroke="${c}" stroke-width="2.2"`) + path(`M ${x - 10} ${yy + 17} a 10 9 0 0 1 20 0`, { stroke: c, w: 2.2, fill });
    if (it.g === 'drop') ic = path(`M ${x} ${yy - 8} C ${x + 10} ${yy + 4} ${x + 8} ${yy + 14} ${x} ${yy + 16} C ${x - 8} ${yy + 14} ${x - 10} ${yy + 4} ${x} ${yy - 8} Z`, { stroke: c, w: 2, fill });
    s += ic + text(x, H - 22, it.l, { size: 12, fill: c, weight: i === active ? 700 : 500, anchor: 'middle' });
  });
  return s;
}

// ================================================================== DAGHTA ====
const DG = { p: '#0776E8', pd: '#0560C0', bg: '#F1F3F8', card: '#FFFFFF', ink: '#0E1B2E', mut: '#8590A3', line: '#E6EAF2' };
const dgDefs = `<defs><linearGradient id="dgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${DG.p}"/><stop offset="1" stop-color="#3D9BFF"/></linearGradient>
  <linearGradient id="dgpro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1B2A4A"/><stop offset="1" stop-color="${DG.pd}"/></linearGradient></defs>`;
const dgNav = (a) => bottomNav([{ g: 'search', l: 'Search' }, { g: 'files', l: 'Files' }, { g: 'settings', l: 'Settings' }], a, { card: DG.card, on: DG.p, off: DG.mut });

// platform tile
function platTile(x, y, w, color, kind, label) {
  let s = rect(x, y, w, w, 20, color);
  const cx = x + w / 2, cy = y + w / 2 - 2;
  if (kind === 'play') s += tri(cx, cy, 13, '#fff');
  if (kind === 'cam') s += rect(cx - 13, cy - 10, 26, 20, 6, 'none', `stroke="#fff" stroke-width="2.4"`) + circle(cx, cy, 6, 'none', `stroke="#fff" stroke-width="2.4"`) + circle(cx + 9, cy - 6, 1.8, '#fff');
  if (kind === 'f') s += text(cx, cy + 9, 'f', { size: 26, fill: '#fff', weight: 800, anchor: 'middle' });
  if (kind === 'note') s += circle(cx - 5, cy + 7, 4, '#fff') + circle(cx + 7, cy + 4, 4, '#fff') + line(cx - 1, cy + 7, cx - 1, cy - 9, '#fff', 2.4) + line(cx + 11, cy + 4, cx + 11, cy - 12, '#fff', 2.4) + path(`M ${cx - 1} ${cy - 9} L ${cx + 11} ${cy - 12}`, { stroke: '#fff', w: 2.4 });
  if (kind === 'ghost') s += path(`M ${cx - 11} ${cy + 10} V ${cy - 2} a 11 11 0 0 1 22 0 V ${cy + 10} l -4 -3 l -3 3 l -4 -3 l -3 3 l -4 -3 Z`, { fill: '#fff' }) + circle(cx - 4, cy - 2, 1.8, color) + circle(cx + 4, cy - 2, 1.8, color);
  s += text(cx, y + w + 22, label, { size: 12.5, fill: DG.ink, weight: 600, anchor: 'middle' });
  return s;
}

function dgSearch() {
  let s = dgDefs;
  s += rect(0, 0, W, H, 0, DG.bg);
  s += rect(0, 0, W, 196, 0, 'url(#dgg)');
  s += statusBar(true);
  s += text(28, 84, 'Daghta', { size: 25, fill: '#fff', weight: 800 });
  s += text(28, 108, 'Download from anywhere', { size: 13.5, fill: '#D6E9FF' });
  // pro chip
  s += rect(W - 150, 64, 126, 34, 17, 'rgba(255,255,255,.18)');
  s += star(W - 134, 81, 7, '#FFD66B') + text(W - 122, 86, '5 scans left', { size: 12.5, fill: '#fff', weight: 600 });
  // paste field
  s += rect(24, 150, W - 48, 88, 18, '#fff', `filter="drop-shadow(0 10px 24px rgba(7,72,150,.22))"`);
  s += text(44, 184, 'Paste a link', { size: 13, fill: DG.mut });
  s += rect(44, 196, 300, 24, 6, '#F1F3F8');
  s += text(54, 213, 'https://tiktok.com/@user/video/…', { size: 12.5, fill: '#A9B2C2' });
  s += rect(W - 150, 174, 110, 44, 12, DG.p) + text(W - 95, 201, 'Paste', { size: 14.5, fill: '#fff', weight: 700, anchor: 'middle' });
  // platforms
  let y = 286;
  s += text(28, y, 'Download from', { size: 17, fill: DG.ink, weight: 700 });
  y += 22;
  const plats = [['#000000', 'play', 'TikTok'], ['#E1306C', 'cam', 'Instagram'], ['#FF0000', 'play', 'YouTube'], ['#1877F2', 'f', 'Facebook'], ['#1DA1F2', 'play', 'Twitter'], ['#FFC400', 'ghost', 'Snapchat']];
  const tw = (W - 48 - 2 * 22) / 3;
  plats.forEach((p, i) => {
    const x = 24 + (i % 3) * (tw + 22), py = y + Math.floor(i / 3) * 116;
    s += platTile(x + (tw - 76) / 2, py, 76, p[0], p[1], p[2]);
  });
  // browse web
  y += 252;
  s += rect(24, y, W - 48, 64, 16, '#fff', `stroke="${DG.line}" stroke-width="1"`);
  s += circle(58, y + 32, 17, '#EAF3FF') + circle(58, y + 32, 11, 'none', `stroke="${DG.p}" stroke-width="2"`) + path(`M 47 32 h 22 M 58 21 a 16 16 0 0 1 0 22 a 16 16 0 0 1 0 -22`, { stroke: DG.p, w: 1.6 });
  s += text(90, y + 28, 'Browse the web', { size: 15.5, fill: DG.ink, weight: 700 });
  s += text(90, y + 48, 'Open the in-app browser to grab media', { size: 12.5, fill: DG.mut });
  s += path(`M ${W - 50} ${y + 26} l 6 6 l -6 6`, { stroke: DG.mut, w: 2.2 });
  // recent label
  y += 90;
  s += text(28, y, 'Recent downloads', { size: 15, fill: DG.ink, weight: 700 });
  [['sunset_reel.mp4', '#FF0000', 'MP4'], ['lofi_beat.mp3', '#1DB954', 'MP3']].forEach(([nm, c, ext], i) => {
    const yy = y + 18 + i * 64;
    s += rect(24, yy, W - 48, 54, 14, '#fff', `stroke="${DG.line}" stroke-width="1"`);
    s += rect(38, yy + 11, 32, 32, 8, c) + text(54, yy + 32, ext, { size: 10, fill: '#fff', weight: 700, anchor: 'middle' });
    s += text(86, yy + 26, nm, { size: 13.5, fill: DG.ink, weight: 600 });
    s += text(86, yy + 44, 'Completed', { size: 11.5, fill: DG.mut });
  });
  s += dgNav(0);
  return wrap('', s);
}

function dgFiles() {
  let s = dgDefs;
  s += rect(0, 0, W, H, 0, DG.bg);
  s += rect(0, 0, W, 120, 0, 'url(#dgg)');
  s += statusBar(true);
  s += text(W / 2, 86, 'File Manager', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // tabs
  s += rect(24, 140, W - 48, 50, 14, '#fff', `stroke="${DG.line}" stroke-width="1"`);
  s += rect(28, 144, (W - 56) / 2, 42, 11, DG.p);
  s += text(28 + (W - 56) / 4, 171, 'My Files', { size: 14.5, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(28 + (W - 56) * 0.75, 171, 'In Progress', { size: 14.5, fill: DG.mut, weight: 600, anchor: 'middle' });
  // category chips
  const cats = ['All', 'Video', 'Audio', 'Docs', 'Images'];
  let cx = 24;
  cats.forEach((c, i) => {
    const w = c.length * 9 + 28, on = i === 0;
    s += rect(cx, 208, w, 34, 17, on ? '#EAF3FF' : '#fff', `stroke="${on ? DG.p : DG.line}" stroke-width="1"`);
    s += text(cx + w / 2, 230, c, { size: 13, fill: on ? DG.p : DG.mut, weight: on ? 700 : 500, anchor: 'middle' });
    cx += w + 10;
  });
  // file list
  const files = [['sunset_reel.mp4', '24.5 MB · 0:38', '#FF0000', 'MP4'], ['podcast_ep12.mp3', '18.2 MB · 12:04', '#1DB954', 'MP3'], ['contract_v3.pdf', '1.2 MB', '#E5484D', 'PDF'], ['beach_trip.jpg', '3.4 MB', '#0776E8', 'JPG'], ['promo_clip.mp4', '52.1 MB · 1:20', '#FF0000', 'MP4'], ['voice_note.m4a', '2.0 MB · 1:42', '#1DB954', 'M4A']];
  let y = 264;
  files.forEach(([nm, meta, c, ext]) => {
    s += rect(24, y, W - 48, 76, 16, '#fff', `stroke="${DG.line}" stroke-width="1"`);
    s += rect(40, y + 16, 44, 44, 11, c) + text(62, y + 43, ext, { size: 12, fill: '#fff', weight: 700, anchor: 'middle' });
    s += text(100, y + 36, nm, { size: 15, fill: DG.ink, weight: 600 });
    s += text(100, y + 58, meta, { size: 12.5, fill: DG.mut });
    s += circle(W - 44, y + 30, 2.4, DG.mut) + circle(W - 44, y + 38, 2.4, DG.mut) + circle(W - 44, y + 46, 2.4, DG.mut);
    y += 88;
  });
  s += dgNav(1);
  return wrap('', s);
}

function dgSettings() {
  let s = dgDefs;
  s += rect(0, 0, W, H, 0, DG.bg);
  s += rect(0, 0, W, 120, 0, 'url(#dgg)');
  s += statusBar(true);
  s += text(W / 2, 86, 'Settings', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // pro card
  s += rect(24, 148, W - 48, 110, 20, 'url(#dgpro)');
  s += star(58, 188, 13, '#FFD66B');
  s += text(86, 184, 'Daghta Pro', { size: 19, fill: '#fff', weight: 800 });
  s += text(86, 210, 'Unlimited downloads · no limits', { size: 12.5, fill: '#C9D6EC' });
  s += rect(40, 224, 130, 22, 11, 'rgba(255,255,255,.16)') + text(105, 240, 'Most popular', { size: 11, fill: '#fff', anchor: 'middle' });
  s += rect(W - 148, 188, 108, 44, 22, '#fff') + text(W - 94, 215, 'Upgrade', { size: 14, fill: DG.pd, weight: 800, anchor: 'middle' });
  // toggle rows
  const toggles = [['App Lock', true], ['Auto Link Paste', true], ['Picture-in-Picture', false], ['Full Screen', false]];
  let y = 286;
  s += text(28, y, 'Preferences', { size: 13, fill: DG.mut, weight: 700, spacing: 1 });
  y += 14;
  s += rect(24, y, W - 48, toggles.length * 64, 18, '#fff', `stroke="${DG.line}" stroke-width="1"`);
  toggles.forEach(([nm, on], i) => {
    const ry = y + i * 64;
    if (i) s += line(60, ry, W - 40, ry, DG.line, 1);
    s += rect(40, ry + 20, 26, 26, 8, '#EAF3FF');
    s += text(82, ry + 40, nm, { size: 14.5, fill: DG.ink, weight: 600 });
    s += rect(W - 84, ry + 22, 44, 24, 12, on ? DG.p : '#D7DCE6');
    s += circle(on ? W - 52 : W - 72, ry + 34, 9, '#fff');
  });
  // selection rows
  y += toggles.length * 64 + 26;
  s += text(28, y, 'General', { size: 13, fill: DG.mut, weight: 700, spacing: 1 });
  y += 14;
  const sels = [['Language', 'English'], ['Theme', 'System']];
  s += rect(24, y, W - 48, sels.length * 64, 18, '#fff', `stroke="${DG.line}" stroke-width="1"`);
  sels.forEach(([k, v], i) => {
    const ry = y + i * 64;
    if (i) s += line(60, ry, W - 40, ry, DG.line, 1);
    s += rect(40, ry + 20, 26, 26, 8, '#EAF3FF');
    s += text(82, ry + 40, k, { size: 14.5, fill: DG.ink, weight: 600 });
    s += text(W - 60, ry + 40, v, { size: 13.5, fill: DG.mut, anchor: 'end' });
    s += path(`M ${W - 48} ${ry + 26} l 6 6 l -6 6`, { stroke: DG.mut, w: 2 });
  });
  s += dgNav(2);
  return wrap('', s);
}

// ================================================================ PUZZLEUR ====
const PZ = { p: '#8E47F8', pd: '#3A1688', bg: '#160A2E', card: '#241046', ink: '#FFFFFF', mut: '#B7A6E0', line: 'rgba(255,255,255,.10)' };
const pzDefs = `<defs><linearGradient id="pzg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PZ.p}"/><stop offset="1" stop-color="${PZ.pd}"/></linearGradient>
  ${[['ga', '#FF6CAB', '#7366FF'], ['gb', '#42E695', '#3BB2B8'], ['gc', '#FFB75E', '#ED8F03'], ['gd', '#4FACFE', '#00F2FE'], ['ge', '#FA709A', '#FEE140'], ['gf', '#A18CD1', '#FBC2EB']].map(([id, a, b]) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join('')}</defs>`;

function pzAppBar(title, withMenu = true) {
  let s = rect(0, 0, W, 150, 0, 'url(#pzg)');
  s += statusBar(true);
  if (withMenu) s += [0, 8, 16].map((o) => line(28, 72 + o, 52, 72 + o, '#fff', 2.6)).join('');
  s += text(withMenu ? 72 : 28, 90, title, { size: 23, fill: '#fff', weight: 800 });
  s += circle(W - 42, 80, 18, 'rgba(255,255,255,.16)') + circle(W - 45, 77, 7, 'none', `stroke="#fff" stroke-width="2.2"`) + line(W - 39, 83, W - 34, 88, '#fff', 2.4);
  return s;
}
function gameCard(x, y, w, h, grad, name, shape) {
  let s = rect(x, y, w, h, 18, grad);
  const cx = x + w / 2, cy = y + (h - 30) / 2;
  if (shape === 'ball') s += circle(cx, cy, 22, 'rgba(255,255,255,.35)') + circle(cx, cy, 13, 'rgba(255,255,255,.6)');
  if (shape === 'stack') s += [0, 1, 2].map((i) => rect(cx - 20 + i * 4, cy - 18 + i * 14, 40 - i * 8, 11, 4, 'rgba(255,255,255,.5)')).join('');
  if (shape === 'car') s += rect(cx - 22, cy - 4, 44, 14, 5, 'rgba(255,255,255,.5)') + rect(cx - 12, cy - 14, 22, 12, 4, 'rgba(255,255,255,.45)') + circle(cx - 12, cy + 12, 6, 'rgba(255,255,255,.6)') + circle(cx + 12, cy + 12, 6, 'rgba(255,255,255,.6)');
  if (shape === '2048') s += [0, 1].flatMap((a) => [0, 1].map((b) => rect(cx - 22 + a * 24, cy - 22 + b * 24, 20, 20, 4, 'rgba(255,255,255,.45)'))).join('');
  if (shape === 'bubble') s += circle(cx - 12, cy - 8, 11, 'rgba(255,255,255,.5)') + circle(cx + 12, cy - 6, 9, 'rgba(255,255,255,.4)') + circle(cx, cy + 12, 13, 'rgba(255,255,255,.55)');
  if (shape === 'slice') s += path(`M ${cx - 20} ${cy + 16} A 26 26 0 0 1 ${cx + 20} ${cy - 16}`, { stroke: 'rgba(255,255,255,.6)', w: 6 }) + circle(cx + 8, cy + 8, 8, 'rgba(255,255,255,.5)');
  // play badge + title bar
  s += circle(cx, cy, 0, '#fff');
  s += rect(x, y + h - 30, w, 30, 0, 'rgba(0,0,0,.28)');
  s += text(x + 12, y + h - 11, name, { size: 12.5, fill: '#fff', weight: 700 });
  return s;
}

function pzHome() {
  let s = pzDefs;
  s += rect(0, 0, W, H, 0, PZ.bg);
  s += pzAppBar('Puzzleur');
  // staggered grid: two columns, varied heights
  const col1 = [['ga', 'Bubble Tower 3D', 'bubble', 168], ['gc', 'Moto X3M', 'car', 140], ['ge', 'Fruit Slice', 'slice', 156]];
  const col2 = [['gb', 'Stack Ball', 'stack', 140], ['AD', '', '', 120], ['gd', '2048 Merge', '2048', 168], ['gf', 'Tower Crash', 'ball', 132]];
  const gap = 16, cw = (W - 48 - gap) / 2;
  let y1 = 170;
  col1.forEach(([g, nm, sh, h]) => { s += gameCard(24, y1, cw, h, `url(#${g})`, nm, sh); y1 += h + gap; });
  let y2 = 170;
  col2.forEach(([g, nm, sh, h]) => {
    const x = 24 + cw + gap;
    if (g === 'AD') {
      s += rect(x, y2, cw, h, 18, PZ.card, `stroke="${PZ.line}" stroke-width="1"`);
      s += rect(x + 12, y2 + 12, 34, 16, 4, 'rgba(255,255,255,.12)') + text(x + 29, y2 + 24, 'Ad', { size: 10.5, fill: PZ.mut, weight: 700, anchor: 'middle' });
      s += rect(x + 14, y2 + 40, cw - 28, 36, 8, 'rgba(255,255,255,.08)');
      s += circle(x + 30, y2 + 58, 11, 'rgba(255,255,255,.14)');
      s += text(x + 14, y2 + 96, 'Sponsored', { size: 12, fill: PZ.mut });
    } else { s += gameCard(x, y2, cw, h, `url(#${g})`, nm, sh); }
    y2 += h + gap;
  });
  // section heading overlay
  return wrap('', s);
}

function pzGame() {
  let s = pzDefs;
  s += rect(0, 0, W, H, 0, PZ.bg);
  // mini app bar
  s += rect(0, 0, W, 104, 0, PZ.pd);
  s += statusBar(true);
  s += path('M 44 60 L 34 70 L 44 80', { stroke: '#fff', w: 2.6 });
  s += text(W / 2, 76, 'Bubble Tower 3D', { size: 17, fill: '#fff', weight: 700, anchor: 'middle' });
  // progress bar
  s += rect(0, 104, W, 4, 0, 'rgba(255,255,255,.15)') + rect(0, 104, W * 0.7, 4, 0, '#42E695');
  // game canvas
  s += `<defs><linearGradient id="canvas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1466"/><stop offset="1" stop-color="#120636"/></linearGradient></defs>`;
  s += rect(0, 108, W, 880, 0, 'url(#canvas)');
  // bubbles cluster
  const cols = ['#FF6CAB', '#42E695', '#FFB75E', '#4FACFE', '#FA709A', '#A18CD1'];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const bx = 70 + c * 80 + (r % 2) * 40, by = 200 + r * 74;
    if (bx < W - 40) s += circle(bx, by, 30, cols[(r + c) % cols.length], `opacity="0.92"`) + circle(bx - 9, by - 9, 8, 'rgba(255,255,255,.4)');
  }
  // cannon + aim
  s += line(W / 2, 880, W / 2, 720, 'rgba(255,255,255,.3)', 3);
  s += circle(W / 2, 900, 40, '#3A1688') + circle(W / 2, 900, 26, '#FF6CAB') + circle(W / 2 - 8, 892, 7, 'rgba(255,255,255,.4)');
  s += text(40, 150, 'Score 1,240', { size: 16, fill: '#fff', weight: 700 });
  s += text(W - 40, 150, 'Lv 7', { size: 16, fill: '#fff', weight: 700, anchor: 'end' });
  // banner ad
  s += rect(0, H - 112, W, 112, 0, PZ.card, `stroke="${PZ.line}" stroke-width="1"`);
  s += rect(24, H - 96, 44, 18, 4, 'rgba(255,255,255,.12)') + text(46, H - 83, 'Ad', { size: 11, fill: PZ.mut, weight: 700, anchor: 'middle' });
  s += rect(24, H - 72, 64, 48, 10, 'url(#gd)');
  s += text(102, H - 56, 'Play Word Blitz', { size: 15, fill: '#fff', weight: 700 });
  s += text(102, H - 36, 'Free · 4.6 ★ · Install now', { size: 12.5, fill: PZ.mut });
  s += rect(W - 116, H - 60, 92, 36, 18, '#42E695') + text(W - 70, H - 36, 'Install', { size: 13.5, fill: '#0B3D24', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

function pzDrawer() {
  let s = pzDefs;
  s += rect(0, 0, W, H, 0, PZ.pd);
  // drawer panel (left)
  s += text(40, 150, 'Puzzleur', { size: 24, fill: '#fff', weight: 800 });
  s += rect(40, 172, 64, 64, 18, 'url(#pzg)') + tri(72, 204, 16, '#fff');
  s += text(40, 268, 'Free HTML5 games', { size: 13, fill: PZ.mut });
  const menu = [['home', 'Home'], ['share', 'Share App'], ['star', 'Rate Us'], ['shield', 'Privacy Policy']];
  let y = 330;
  menu.forEach(([ic, l], i) => {
    const on = i === 0;
    if (on) s += rect(24, y - 28, 230, 50, 14, 'rgba(255,255,255,.12)');
    const gx = 52;
    if (ic === 'home') s += path(`M ${gx - 10} ${y + 4} L ${gx} ${y - 7} L ${gx + 10} ${y + 4} L ${gx + 10} ${y + 14} L ${gx - 10} ${y + 14} Z`, { stroke: '#fff', w: 2.2, fill: on ? '#fff' : 'none' });
    if (ic === 'share') s += circle(gx - 8, y + 4, 5, 'none', `stroke="#fff" stroke-width="2"`) + circle(gx + 8, y - 6, 5, 'none', `stroke="#fff" stroke-width="2"`) + circle(gx + 8, y + 14, 5, 'none', `stroke="#fff" stroke-width="2"`) + line(gx - 4, y + 1, gx + 4, y - 4, '#fff', 2) + line(gx - 4, y + 7, gx + 4, y + 12, '#fff', 2);
    if (ic === 'star') s += star(gx, y + 3, 11, '#FFD66B');
    if (ic === 'shield') s += path(`M ${gx} ${y - 10} l 11 4 v 8 a 11 13 0 0 1 -11 12 a 11 13 0 0 1 -11 -12 v -8 Z`, { stroke: '#fff', w: 2, fill: 'none' });
    s += text(78, y + 8, l, { size: 16, fill: '#fff', weight: on ? 700 : 500 });
    y += 64;
  });
  s += text(40, H - 60, 'v1.0.1 · made with Flutter', { size: 12, fill: PZ.mut });
  // scaled home peek (right)
  s += `<g transform="translate(300,150) scale(0.62)" opacity="0.96">`;
  s += rect(-10, -10, W, H, 40, PZ.bg, `filter="drop-shadow(0 20px 50px rgba(0,0,0,.5))"`);
  s += rect(-10, -10, W, 150, 40, 'url(#pzg)');
  const peek = [['ga', 168], ['gc', 140], ['ge', 150]], peek2 = [['gb', 140], ['gd', 168], ['gf', 132]];
  const cw = (W - 48 - 16) / 2; let py1 = 170;
  peek.forEach(([g, h]) => { s += rect(24, py1, cw, h, 18, `url(#${g})`); py1 += h + 16; });
  let py2 = 170; peek2.forEach(([g, h]) => { s += rect(24 + cw + 16, py2, cw, h, 18, `url(#${g})`); py2 += h + 16; });
  s += `</g>`;
  return wrap('', s);
}

// ============================================================ BLOOD DONORS ====
const BD = { p: '#D60033', soft: '#FBE5EB', bg: '#FFF5F7', card: '#FFFFFF', ink: '#2A1018', mut: '#9C8A90', line: '#F1E2E7', green: '#1B9E55', wa: '#25D366' };
const bdDefs = `<defs><linearGradient id="bdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BD.p}"/><stop offset="1" stop-color="#FF3D6E"/></linearGradient></defs>`;
const bdNav = (a) => bottomNav([{ g: 'home', l: 'Donors' }, { g: 'search', l: 'Find' }, { g: 'add', l: 'Register' }, { g: 'user', l: 'Profile' }], a, { card: BD.card, on: BD.p, off: BD.mut });
const drop = (cx, cy, r, fill, extra = '') => path(`M ${cx} ${cy - r} C ${cx + r} ${cy} ${cx + r * 0.8} ${cy + r} ${cx} ${cy + r} C ${cx - r * 0.8} ${cy + r} ${cx - r} ${cy} ${cx} ${cy - r} Z`, { fill, ...(extra ? {} : {}) });

function bdGroupBadge(cx, cy, r, g, fill = BD.p, tc = '#fff') {
  return circle(cx, cy, r, fill) + text(cx, cy + r * 0.32, g, { size: r * 0.78, fill: tc, weight: 800, anchor: 'middle' });
}

function bdHome() {
  let s = bdDefs;
  s += rect(0, 0, W, H, 0, BD.bg);
  s += rect(0, 0, W, 168, 0, 'url(#bdg)');
  s += statusBar(true);
  s += drop(40, 80, 15, '#fff');
  s += text(64, 78, 'Blood Donors', { size: 22, fill: '#fff', weight: 800 });
  s += text(64, 100, '243 GB · Faisalabad', { size: 12.5, fill: '#FFD7E0' });
  // sync pill
  s += rect(W - 168, 64, 144, 32, 16, 'rgba(255,255,255,.18)');
  s += circle(W - 152, 80, 5, '#7CFFB0') + text(W - 140, 85, 'Synced · 2m ago', { size: 12, fill: '#fff', weight: 600 });
  // blood group filter chips
  const groups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+'];
  let cx = 24;
  groups.forEach((g, i) => {
    const w = g.length * 10 + 26, on = i === 5;
    s += rect(cx, 186, w, 36, 18, on ? BD.p : '#fff', `stroke="${on ? BD.p : BD.line}" stroke-width="1"`);
    s += text(cx + w / 2, 209, g, { size: 13.5, fill: on ? '#fff' : BD.ink, weight: on ? 700 : 600, anchor: 'middle' });
    cx += w + 10;
  });
  // emergency banner
  s += rect(24, 240, W - 48, 70, 16, BD.soft);
  s += drop(56, 275, 16, BD.p);
  s += text(86, 270, 'Need blood urgently?', { size: 15, fill: BD.ink, weight: 700 });
  s += text(86, 292, 'Search O+ donors near you in seconds', { size: 12.5, fill: '#8A6A72' });
  // donor cards
  const donors = [['Imran Ali', 'O+', '243 GB · 1.2 km', true], ['Sana Khan', 'O+', 'Jaranwala Rd · 3 km', true], ['Bilal Ahmed', 'O+', 'Samundri · 6 km', false]];
  let y = 330;
  const bw = 210; // action button width
  donors.forEach(([nm, g, loc, avail]) => {
    s += rect(24, y, W - 48, 134, 18, BD.card, `stroke="${BD.line}" stroke-width="1"`);
    s += circle(60, y + 48, 24, BD.soft) + circle(60, y + 42, 9, '#D9B5BE') + path(`M 44 ${y + 66} a 16 14 0 0 1 32 0`, { fill: '#D9B5BE' });
    s += bdGroupBadge(W - 58, y + 46, 21, g);
    s += text(98, y + 42, nm, { size: 16.5, fill: BD.ink, weight: 700 });
    s += circle(102, y + 64, 4, avail ? BD.green : '#C9B9BE') + text(114, y + 69, avail ? 'Available now' : 'Unavailable', { size: 12.5, fill: avail ? BD.green : BD.mut, weight: 600 });
    s += text(98, y + 90, loc, { size: 12.5, fill: BD.mut });
    // action row (bottom): Call (outline) + WhatsApp (green)
    const ry = y + 100;
    s += rect(40, ry, bw, 28, 14, '#fff', `stroke="${BD.p}" stroke-width="1.4"`);
    s += path(`M 64 ${ry + 9} a 7 7 0 0 1 7 -2 l 2 4 l -3 3 a 12 12 0 0 0 6 6 l 3 -3 l 4 2 a 7 7 0 0 1 -2 7 a 16 16 0 0 1 -17 -17 Z`, { fill: BD.p });
    s += text(40 + bw / 2 + 10, ry + 19, 'Call', { size: 13, fill: BD.p, weight: 700, anchor: 'middle' });
    const wx = W - 40 - bw;
    s += rect(wx, ry, bw, 28, 14, BD.wa);
    s += path(`M ${wx + 30} ${ry + 7} a 9 9 0 1 0 -8 14 l -2 4 l 5 -1 a 9 9 0 0 0 5 1 a 9 9 0 0 0 0 -18 Z`, { fill: '#fff' }) + circle(wx + 30, ry + 16, 3.2, BD.wa);
    s += text(wx + bw / 2 + 12, ry + 19, 'WhatsApp', { size: 12.5, fill: '#fff', weight: 700, anchor: 'middle' });
    y += 146;
  });
  s += bdNav(0);
  return wrap('', s);
}

function bdSearch() {
  let s = bdDefs;
  s += rect(0, 0, W, H, 0, BD.bg);
  s += rect(0, 0, W, 120, 0, 'url(#bdg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Find a Donor', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(28, 168, 'Select blood group', { size: 17, fill: BD.ink, weight: 700 });
  // 4x2 group grid
  const grps = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const gw = (W - 48 - 3 * 14) / 4;
  grps.forEach((g, i) => {
    const x = 24 + (i % 4) * (gw + 14), y = 190 + Math.floor(i / 4) * (gw + 14), on = i === 5;
    s += rect(x, y, gw, gw, 18, on ? BD.p : BD.card, `stroke="${on ? BD.p : BD.line}" stroke-width="${on ? 2 : 1}"`);
    s += drop(x + gw / 2, y + gw / 2 - 6, 16, on ? 'rgba(255,255,255,.9)' : BD.soft);
    s += text(x + gw / 2, y + gw / 2 + 3, g, { size: 18, fill: on ? BD.p : BD.ink, weight: 800, anchor: 'middle' });
  });
  // results
  let y = 190 + 2 * (gw + 14) + 24;
  s += rect(24, y, W - 48, 56, 14, BD.soft);
  s += text(44, y + 34, '12 O- donors found near 243 GB', { size: 14.5, fill: BD.ink, weight: 700 });
  y += 74;
  const res = [['Hassan Raza', 'O-', '243 GB · 0.8 km', true], ['Ayesha Noor', 'O-', 'Ghulam Mohd Abad · 4 km', true]];
  res.forEach(([nm, g, loc, avail]) => {
    s += rect(24, y, W - 48, 92, 18, BD.card, `stroke="${BD.line}" stroke-width="1"`);
    s += circle(62, y + 40, 22, BD.soft) + circle(62, y + 34, 8, '#D9B5BE') + path(`M 48 ${y + 56} a 14 12 0 0 1 28 0`, { fill: '#D9B5BE' });
    s += bdGroupBadge(W - 58, y + 38, 20, g);
    s += text(98, y + 36, nm, { size: 16, fill: BD.ink, weight: 700 });
    s += circle(102, y + 58, 4, BD.green) + text(114, y + 63, 'Available now', { size: 12.5, fill: BD.green, weight: 600 });
    s += text(98, y + 82, loc, { size: 12, fill: BD.mut });
    y += 104;
  });
  // offline note
  s += rect(24, y, W - 48, 44, 12, '#FFF0D6');
  s += circle(48, y + 22, 6, '#E08A00') + text(64, y + 27, 'Works offline — last 12 donors cached', { size: 12.5, fill: '#8A5A00', weight: 600 });
  s += bdNav(1);
  return wrap('', s);
}

function bdRegister() {
  let s = bdDefs;
  s += rect(0, 0, W, H, 0, BD.bg);
  s += rect(0, 0, W, 120, 0, 'url(#bdg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Register as Donor', { size: 19, fill: '#fff', weight: 700, anchor: 'middle' });
  // photo
  s += circle(W / 2, 186, 44, BD.soft) + circle(W / 2, 174, 15, '#D9B5BE') + path(`M ${W / 2 - 26} 208 a 26 22 0 0 1 52 0`, { fill: '#D9B5BE' });
  s += circle(W / 2 + 32, 210, 16, BD.p) + line(W / 2 + 32, 204, W / 2 + 32, 216, '#fff', 2.4) + line(W / 2 + 26, 210, W / 2 + 38, 210, '#fff', 2.4);
  // fields
  const field = (y, label, val, ph = false) => rect(24, y, W - 48, 56, 14, '#fff', `stroke="${BD.line}" stroke-width="1"`) + text(40, y - 6, label, { size: 12.5, fill: BD.mut, weight: 600 }) + text(44, y + 34, val, { size: 14.5, fill: ph ? '#B9A8AE' : BD.ink, weight: ph ? 400 : 600 });
  let y = 268;
  s += field(y, 'Full name', 'Muhammad Usman'); y += 80;
  // blood group select
  s += text(40, y - 6, 'Blood group', { size: 12.5, fill: BD.mut, weight: 600 });
  const grps = ['A+', 'B+', 'O+', 'O-', 'AB+'];
  const gw = (W - 48 - 4 * 10) / 5;
  grps.forEach((g, i) => {
    const x = 24 + i * (gw + 10), on = i === 2;
    s += rect(x, y, gw, 48, 12, on ? BD.p : '#fff', `stroke="${on ? BD.p : BD.line}" stroke-width="1"`);
    s += text(x + gw / 2, y + 30, g, { size: 15, fill: on ? '#fff' : BD.ink, weight: 700, anchor: 'middle' });
  });
  y += 72;
  s += field(y, 'City / Area', '243 GB, Faisalabad'); y += 80;
  s += field(y, 'Phone (WhatsApp)', '+92 3•• ••• ••••'); y += 80;
  // availability toggle
  s += rect(24, y, W - 48, 60, 14, '#fff', `stroke="${BD.line}" stroke-width="1"`);
  s += text(44, y + 30, 'Available to donate', { size: 14.5, fill: BD.ink, weight: 700 });
  s += text(44, y + 48, 'Show me in donor searches', { size: 12, fill: BD.mut });
  s += rect(W - 86, y + 18, 46, 26, 13, BD.green) + circle(W - 53, y + 31, 10, '#fff');
  y += 78;
  // offline hint
  s += rect(24, y, W - 48, 44, 12, '#FFF0D6');
  s += circle(48, y + 22, 6, '#E08A00') + text(64, y + 27, 'Saved offline — syncs when you reconnect', { size: 12.5, fill: '#8A5A00', weight: 600 });
  // save
  s += rect(24, H - 92, W - 48, 58, 29, BD.p);
  s += text(W / 2, H - 55, 'Save & Register', { size: 16.5, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// ================================================================= SNAPTOK ====
const ST = { bg: '#121212', card: '#1E1E1E', card2: '#252525', accent: '#df4759', teal: '#25C2D6', ink: '#E8E8E8', mut: '#9A9A9A', line: '#2C2C2C' };
const stDefs = `<defs><linearGradient id="stg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${ST.accent}"/><stop offset="1" stop-color="#FF6A8A"/></linearGradient></defs>`;
const stNav = (a) => bottomNav([{ g: 'home', l: 'Home' }, { g: 'down', l: 'Downloads' }, { g: 'menu', l: 'Menu' }], a, { card: ST.card, on: ST.accent, off: ST.mut });
function stStatus() { return statusBar(true); }

function stChip(x, y, color, kind, label) {
  let s = rect(x, y, 116, 44, 22, ST.card2, `stroke="${ST.line}" stroke-width="1"`);
  s += circle(x + 24, y + 22, 12, color);
  if (kind === 'play') s += tri(x + 24, y + 22, 7, '#fff');
  if (kind === 'f') s += text(x + 24, y + 29, 'f', { size: 16, fill: '#fff', weight: 800, anchor: 'middle' });
  s += text(x + 44, y + 27, label, { size: 13, fill: ST.ink, weight: 600 });
  return s;
}

function stHome() {
  let s = stDefs;
  s += rect(0, 0, W, H, 0, ST.bg);
  s += stStatus();
  // header
  s += text(28, 88, 'SnapTok', { size: 26, fill: '#fff', weight: 800 });
  s += text(28, 112, 'TT Video Getter', { size: 13, fill: ST.mut });
  s += circle(W - 44, 84, 19, ST.card2) + path(`M ${W - 50} 84 a 8 8 0 1 0 11 -7 a 9 9 0 0 1 -11 7 Z`, { fill: '#FFD66B' });
  // paste card
  s += rect(24, 150, W - 48, 132, 20, ST.card, `stroke="${ST.line}" stroke-width="1"`);
  s += text(44, 184, 'Paste a video link', { size: 14, fill: ST.ink, weight: 600 });
  s += rect(44, 198, W - 200, 46, 12, '#161616', `stroke="${ST.line}" stroke-width="1"`);
  s += text(58, 226, 'https://vt.tiktok.com/…', { size: 13, fill: ST.mut });
  s += rect(W - 148, 198, 104, 46, 12, 'url(#stg)') + text(W - 96, 226, 'Paste', { size: 14.5, fill: '#fff', weight: 800, anchor: 'middle' });
  // download big button
  s += rect(44, 254, W - 88, 0, 0, 'none');
  // platforms
  let y = 318;
  s += text(28, y, 'Supported platforms', { size: 14, fill: ST.mut, weight: 600 });
  y += 18;
  s += stChip(24, y, '#000000', 'play', 'TikTok') + stChip(24 + 132, y, '#FF0000', 'play', 'YouTube');
  s += stChip(24, y + 60, '#1877F2', 'f', 'Facebook') + stChip(24 + 132, y + 60, '#FF4D4D', 'play', 'MxTakaTak');
  // download button
  s += rect(24, y + 144, W - 48, 60, 30, 'url(#stg)');
  s += line(W / 2 - 60, y + 174, W / 2 - 60, y + 162, '#fff', 2.6) + path(`M ${W / 2 - 67} ${y + 168} L ${W / 2 - 60} ${y + 176} L ${W / 2 - 53} ${y + 168}`, { stroke: '#fff', w: 2.6 });
  s += text(W / 2 + 6, y + 180, 'Download', { size: 17, fill: '#fff', weight: 800, anchor: 'middle' });
  // no-watermark badge
  s += rect(24, y + 224, W - 48, 50, 14, ST.card);
  s += circle(50, y + 249, 9, 'none', `stroke="${ST.teal}" stroke-width="2"`) + path(`M 46 ${y + 249} l 3 3 l 5 -6`, { stroke: ST.teal, w: 2 });
  s += text(72, y + 254, 'No watermark · HD MP4 · audio & thumbnail', { size: 12.5, fill: ST.mut });
  // disclaimer
  s += text(28, y + 312, 'Please respect creators’ copyright. Download only', { size: 11.5, fill: '#6E6E6E' });
  s += text(28, y + 330, 'content you have the rights to.', { size: 11.5, fill: '#6E6E6E' });
  s += stNav(0);
  return wrap('', s);
}

function stDownload() {
  let s = stDefs;
  s += rect(0, 0, W, H, 0, ST.bg);
  s += stStatus();
  s += path('M 44 84 L 34 94 L 44 104', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 100, 'Download', { size: 19, fill: '#fff', weight: 700, anchor: 'middle' });
  // video preview
  s += rect(24, 140, W - 48, 270, 18, '#000');
  s += `<defs><linearGradient id="vid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A2A33"/><stop offset="1" stop-color="#15151A"/></linearGradient></defs>`;
  s += rect(24, 140, W - 48, 270, 18, 'url(#vid)');
  s += circle(W / 2, 275, 34, 'rgba(255,255,255,.16)') + tri(W / 2, 275, 18, '#fff');
  s += rect(40, 384, 64, 18, 6, 'rgba(0,0,0,.5)') + text(72, 397, '0:38', { size: 11.5, fill: '#fff', anchor: 'middle' });
  s += rect(W - 92, 156, 56, 22, 11, 'rgba(0,0,0,.45)') + text(W - 64, 171, 'HD', { size: 12, fill: '#fff', weight: 700, anchor: 'middle' });
  // title + author
  s += text(28, 446, 'Golden hour rooftop edit', { size: 17, fill: '#fff', weight: 700 });
  s += circle(40, 474, 13, ST.card2) + circle(40, 470, 5, ST.mut) + path('M 31 482 a 9 8 0 0 1 18 0', { fill: ST.mut });
  s += text(60, 478, '@aerial.films', { size: 13, fill: ST.mut });
  // music meta
  s += rect(24, 500, W - 48, 70, 16, ST.card);
  s += rect(40, 516, 38, 38, 9, 'url(#stg)') + circle(59, 535, 6, '#fff') + circle(59, 535, 2, ST.accent);
  s += text(90, 532, 'original sound', { size: 14, fill: ST.ink, weight: 600 });
  s += text(90, 552, 'aerial.films · 0:38', { size: 12, fill: ST.mut });
  s += path(`M ${W - 56} 524 v 18 M ${W - 56} 524 l 10 -3 v 18`, { stroke: ST.teal, w: 2 }) + circle(W - 58, 544, 4, ST.teal) + circle(W - 48, 541, 4, ST.teal);
  // format options
  s += text(28, 608, 'Choose format', { size: 14, fill: ST.mut, weight: 600 });
  const opts = [['Video', 'HD MP4 · 12.4 MB', 'url(#stg)', '#fff', true], ['Music', 'MP3 · 0.9 MB', ST.card, ST.ink, false], ['Thumbnail', 'JPG · 240 KB', ST.card, ST.ink, false]];
  let y = 626;
  opts.forEach(([t, sub, bg, tc, on]) => {
    s += rect(24, y, W - 48, 62, 16, bg, on ? '' : `stroke="${ST.line}" stroke-width="1"`);
    const ic = on ? '#fff' : ST.accent;
    if (t === 'Video') s += rect(42, y + 20, 26, 22, 5, 'none', `stroke="${ic}" stroke-width="2"`) + tri(55, y + 31, 6, ic);
    if (t === 'Music') s += circle(48, y + 36, 5, ic) + line(53, y + 36, 53, y + 20, ic, 2) + path(`M 53 ${y + 20} l 8 -2 v 14`, { stroke: ic, w: 2 }) + circle(61, y + 34, 4, ic);
    if (t === 'Thumbnail') s += rect(42, y + 20, 28, 22, 4, 'none', `stroke="${ic}" stroke-width="2"`) + circle(50, y + 28, 3, ic) + path(`M 44 ${y + 40} l 8 -8 l 6 5 l 6 -7 l 4 4`, { stroke: ic, w: 2 });
    s += text(82, y + 28, t, { size: 15, fill: tc, weight: 700 });
    s += text(82, y + 48, sub, { size: 12, fill: on ? 'rgba(255,255,255,.8)' : ST.mut });
    s += circle(W - 48, y + 31, 11, 'none', `stroke="${on ? '#fff' : ST.line}" stroke-width="2"`);
    if (on) s += circle(W - 48, y + 31, 5, '#fff');
    y += 74;
  });
  s += stNav(1);
  return wrap('', s);
}

function stLibrary() {
  let s = stDefs;
  s += rect(0, 0, W, H, 0, ST.bg);
  s += stStatus();
  s += text(28, 100, 'Downloads', { size: 22, fill: '#fff', weight: 800 });
  // tabs
  s += text(40, 150, 'Videos', { size: 15, fill: '#fff', weight: 700 });
  s += rect(34, 162, 56, 3, 2, ST.accent);
  s += text(140, 150, 'Music', { size: 15, fill: ST.mut, weight: 600 });
  s += text(230, 150, 'Photos', { size: 15, fill: ST.mut, weight: 600 });
  // grid of videos
  const vids = [['Golden hour edit', '12.4 MB', '#3A2A4A'], ['Street food tour', '21.0 MB', '#2A3A33'], ['Sunset timelapse', '8.7 MB', '#3A2A2A'], ['Dance challenge', '15.2 MB', '#2A2A3A']];
  const cw = (W - 48 - 16) / 2;
  vids.forEach(([nm, sz, c], i) => {
    const x = 24 + (i % 2) * (cw + 16), y = 188 + Math.floor(i / 2) * 250;
    s += rect(x, y, cw, 232, 16, ST.card);
    s += rect(x, y, cw, 150, 16, c);
    s += circle(x + cw / 2, y + 75, 26, 'rgba(255,255,255,.14)') + tri(x + cw / 2, y + 75, 13, '#fff');
    s += rect(x + cw - 60, y + 16, 48, 20, 10, 'rgba(0,0,0,.5)') + text(x + cw - 36, y + 30, 'MP4', { size: 10.5, fill: '#fff', weight: 700, anchor: 'middle' });
    s += text(x + 14, y + 178, nm, { size: 13.5, fill: ST.ink, weight: 600 });
    s += text(x + 14, y + 200, sz, { size: 11.5, fill: ST.mut });
    s += rect(x + 14, y + 210, 54, 14, 0, 'none');
    // play + share row
    s += circle(x + cw - 58, y + 206, 13, ST.card2) + tri(x + cw - 58, y + 206, 6, ST.accent);
    s += circle(x + cw - 26, y + 206, 13, ST.card2) + path(`M ${x + cw - 32} ${y + 206} l 6 -5 v 10 Z M ${x + cw - 26} ${y + 201} h 6 v 10 h -10`, { stroke: ST.teal, w: 1.6 });
    s += line(x + cw - 30, y + 206, x + cw - 24, y + 203, ST.teal, 1.6);
  });
  s += stNav(1);
  return wrap('', s);
}

// ---- run --------------------------------------------------------------------
await render('daghta_search', dgSearch());
await render('daghta_files', dgFiles());
await render('daghta_settings', dgSettings());
await render('puzzleur_home', pzHome());
await render('puzzleur_game', pzGame());
await render('puzzleur_drawer', pzDrawer());
await render('blooddonors_home', bdHome());
await render('blooddonors_search', bdSearch());
await render('blooddonors_register', bdRegister());
await render('snaptok_home', stHome());
await render('snaptok_download', stDownload());
await render('snaptok_library', stLibrary());
console.log('done — batch 3 mockups');
