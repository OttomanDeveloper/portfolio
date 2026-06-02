// scripts/gen-batch4-mockups.mjs
// Hand-designed SVG screen mockups -> AVIF for multi-app systems with NO real screenshots.
// Each entry shows 2 user screens + 1 admin screen to convey the dual-app system.
// Faithful to each app's REAL brand colours/labels/features pulled from source.
//   profit-hub  (earning/rewards platform + admin): user blue #1976D2 / gold; admin green #006D40
//   calculator  (calculator + payout admin):        green #30D328 / coral #F16C4E; dark #010101
//   meesho      (marketplace + admin):              maroon #580A46 / magenta #9F2089 / orange #FF9C00
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

function bottomNav(items, active, { card, on, off, h = 88 }) {
  const n = items.length, pad = 46, dx = (W - pad * 2) / (n - 1);
  let s = rect(0, H - h, W, h, 0, card, `stroke="rgba(0,0,0,.06)" stroke-width="1"`);
  items.forEach((it, i) => {
    const x = pad + i * dx, c = i === active ? on : off, fill = i === active ? on : 'none', yy = H - h + 26;
    let ic = '';
    if (it.g === 'home') ic = path(`M ${x - 11} ${yy + 4} L ${x} ${yy - 7} L ${x + 11} ${yy + 4} L ${x + 11} ${yy + 16} L ${x - 11} ${yy + 16} Z`, { stroke: c, w: 2.2, fill });
    if (it.g === 'grid') ic = [0, 1].flatMap((a) => [0, 1].map((b) => rect(x - 11 + a * 13, yy - 5 + b * 13, 9, 9, 2, fill, `stroke="${c}" stroke-width="2"`))).join('');
    if (it.g === 'box') ic = path(`M ${x - 11} ${yy - 3} l 11 -5 l 11 5 v 12 l -11 5 l -11 -5 Z`, { stroke: c, w: 2, fill }) + line(x - 11, yy - 3, x + 11, yy - 3, c, 2);
    if (it.g === 'user') ic = circle(x, yy, 6, fill, `stroke="${c}" stroke-width="2.2"`) + path(`M ${x - 10} ${yy + 17} a 10 9 0 0 1 20 0`, { stroke: c, w: 2.2, fill });
    if (it.g === 'help') ic = circle(x, yy + 4, 12, 'none', `stroke="${c}" stroke-width="2.2"`) + text(x, yy + 10, '?', { size: 16, fill: c, weight: 800, anchor: 'middle' });
    if (it.g === 'wallet') ic = rect(x - 12, yy - 5, 24, 17, 4, fill, `stroke="${c}" stroke-width="2"`) + circle(x + 6, yy + 4, 2.6, i === active ? '#fff' : c);
    if (it.g === 'pkg') ic = path(`M ${x - 11} ${yy - 3} l 11 -5 l 11 5 v 12 l -11 5 l -11 -5 Z`, { stroke: c, w: 2, fill });
    if (it.g === 'req') ic = rect(x - 10, yy - 6, 20, 22, 3, fill, `stroke="${c}" stroke-width="2"`) + line(x - 5, yy, x + 5, yy, i === active ? '#fff' : c, 2) + line(x - 5, yy + 6, x + 3, yy + 6, i === active ? '#fff' : c, 2);
    if (it.g === 'settings') ic = circle(x, yy + 5, 6, 'none', `stroke="${c}" stroke-width="2.2"`) + [0, 60, 120, 180, 240, 300].map((a) => { const r = a * Math.PI / 180; return line(x + Math.cos(r) * 9, yy + 5 + Math.sin(r) * 9, x + Math.cos(r) * 13, yy + 5 + Math.sin(r) * 13, c, 2.2); }).join('');
    if (it.g === 'chart') ic = line(x - 11, yy + 14, x - 11, yy - 6, c, 2.2) + line(x - 11, yy + 14, x + 12, yy + 14, c, 2.2) + [[-6, 8], [0, 2], [6, 6], [11, -3]].map(([dx2, dy], k) => k ? '' : '').join('') + path(`M ${x - 6} ${yy + 8} L ${x} ${yy + 2} L ${x + 5} ${yy + 6} L ${x + 11} ${yy - 4}`, { stroke: c, w: 2.2 });
    s += ic + text(x, H - 22, it.l, { size: 11.5, fill: c, weight: i === active ? 700 : 500, anchor: 'middle' });
  });
  return s;
}

// =============================================================== PROFIT HUB ===
const PH = { p: '#1976D2', pd: '#0D47A1', gold: '#F5B301', bg: '#EDF1F8', card: '#FFFFFF', ink: '#11223A', mut: '#7E8AA0', line: '#E4E9F2', green: '#1B9E55' };
const phDefs = `<defs><linearGradient id="phg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PH.p}"/><stop offset="1" stop-color="#42A5F5"/></linearGradient>
  <linearGradient id="phbal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PH.pd}"/><stop offset="1" stop-color="#1976D2"/></linearGradient>
  <linearGradient id="phgold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F5B301"/><stop offset="1" stop-color="#FFCE54"/></linearGradient></defs>`;
const phNav = (a) => bottomNav([{ g: 'home', l: 'Home' }, { g: 'pkg', l: 'Packages' }, { g: 'wallet', l: 'Wallet' }, { g: 'user', l: 'Profile' }], a, { card: PH.card, on: PH.p, off: PH.mut });

function phHome() {
  let s = phDefs;
  s += rect(0, 0, W, H, 0, PH.bg);
  s += rect(0, 0, W, 250, 0, 'url(#phg)');
  s += statusBar(true);
  s += text(28, 82, 'Hi, Usman', { size: 22, fill: '#fff', weight: 800 });
  s += text(28, 106, 'Profit Hub · Pakistan', { size: 12.5, fill: '#CFE5FB' });
  s += circle(W - 42, 84, 18, 'rgba(255,255,255,.16)') + path(`M ${W - 50} 80 a 8 8 0 0 1 16 0 v 4 l 3 5 h -22 l 3 -5 Z`, { stroke: '#fff', w: 2 }) + circle(W - 42, 94, 3, PH.gold);
  // balance card
  s += rect(24, 144, W - 48, 132, 22, 'url(#phbal)', `filter="drop-shadow(0 14px 30px rgba(13,71,161,.3))"`);
  s += text(44, 180, 'Available balance', { size: 13, fill: '#BBD7F5' });
  s += text(44, 218, '248.50', { size: 38, fill: '#fff', weight: 800 });
  s += text(176, 218, 'USDT', { size: 15, fill: '#BBD7F5', weight: 600 });
  s += rect(40, 234, 130, 30, 15, 'rgba(255,255,255,.16)') + path(`M 58 249 l 0 -10 m -5 5 l 5 -5 l 5 5`, { stroke: '#7CFFB0', w: 2 }) + text(108, 254, 'Deposit', { size: 13, fill: '#fff', weight: 600, anchor: 'middle' });
  s += rect(180, 234, 130, 30, 15, 'rgba(255,255,255,.16)') + path(`M 200 240 l 0 10 m -5 -5 l 5 5 l 5 -5`, { stroke: '#FFCE54', w: 2 }) + text(250, 254, 'Withdraw', { size: 13, fill: '#fff', weight: 600, anchor: 'middle' });
  // earn actions grid
  let y = 308;
  s += text(28, y, 'Ways to earn', { size: 17, fill: PH.ink, weight: 700 });
  y += 18;
  const acts = [['pkg', 'Buy Package', '#E7F0FB', PH.p], ['task', 'Daily Tasks', '#E9F8EF', PH.green], ['spin', 'Spin & Win', '#FFF4DC', '#E0930A'], ['watch', 'Watch & Earn', '#F3EAFE', '#8E47F8']];
  const tw = (W - 48 - 3 * 14) / 4;
  acts.forEach(([g, l, bg, c], i) => {
    const x = 24 + i * (tw + 14);
    s += rect(x, y, tw, 96, 16, PH.card, `stroke="${PH.line}" stroke-width="1"`);
    s += rect(x + (tw - 44) / 2, y + 14, 44, 44, 12, bg);
    const cx = x + tw / 2, cy = y + 36;
    if (g === 'pkg') s += path(`M ${cx - 10} ${cy - 4} l 10 -5 l 10 5 v 11 l -10 5 l -10 -5 Z`, { stroke: c, w: 2 });
    if (g === 'task') s += path(`M ${cx - 9} ${cy} l 4 5 l 10 -10`, { stroke: c, w: 2.4 }) + rect(cx - 12, cy - 11, 24, 24, 5, 'none', `stroke="${c}" stroke-width="1.6"`);
    if (g === 'spin') s += circle(cx, cy, 11, 'none', `stroke="${c}" stroke-width="2"`) + path(`M ${cx + 9} ${cy - 6} l 4 -2 l -1 4`, { stroke: c, w: 2 }) + line(cx, cy, cx + 6, cy - 5, c, 2);
    if (g === 'watch') s += rect(cx - 12, cy - 9, 24, 18, 4, 'none', `stroke="${c}" stroke-width="2"`) + tri(cx, cy, 6, c);
    s += text(cx, y + 80, l, { size: 11, fill: PH.ink, weight: 600, anchor: 'middle' });
  });
  // active package
  y += 120;
  s += text(28, y, 'Active package', { size: 17, fill: PH.ink, weight: 700 });
  y += 18;
  s += rect(24, y, W - 48, 110, 18, PH.card, `stroke="${PH.line}" stroke-width="1"`);
  s += rect(40, y + 20, 56, 56, 14, '#FFF4DC') + star(68, y + 48, 15, PH.gold);
  s += text(116, y + 44, 'Gold Plan', { size: 17, fill: PH.ink, weight: 700 });
  s += text(116, y + 66, '2.5% daily · 60 days', { size: 13, fill: PH.mut });
  s += text(W - 40, y + 44, '+$6.21', { size: 16, fill: PH.green, weight: 800, anchor: 'end' });
  s += text(W - 40, y + 66, 'today', { size: 12, fill: PH.mut, anchor: 'end' });
  s += rect(40, y + 88, W - 80, 8, 4, '#EDF1F8') + rect(40, y + 88, (W - 80) * 0.42, 8, 4, PH.gold);
  // referral
  y += 130;
  s += rect(24, y, W - 48, 64, 16, '#FFF4DC');
  s += circle(58, y + 32, 17, 'url(#phgold)') + path(`M 50 ${y + 36} a 8 8 0 0 1 16 0`, { fill: '#fff' }) + circle(58, y + 26, 5, '#fff');
  s += text(90, y + 28, 'Invite & earn 10%', { size: 15, fill: '#7A5A00', weight: 700 });
  s += text(90, y + 48, 'Get commission on every referral deposit', { size: 12, fill: '#A07A1A' });
  s += phNav(0);
  return wrap('', s);
}

function phPackages() {
  let s = phDefs;
  s += rect(0, 0, W, H, 0, PH.bg);
  s += rect(0, 0, W, 120, 0, 'url(#phg)');
  s += statusBar(true);
  s += text(W / 2, 86, 'Earning Packages', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  const pkgs = [['Starter', '$20', '1.5%', '30 days', '#90A4AE', false], ['Silver', '$100', '2.0%', '45 days', '#78909C', false], ['Gold', '$500', '2.5%', '60 days', PH.gold, true], ['Platinum', '$1,000', '3.0%', '90 days', '#7E57C2', false]];
  let y = 148;
  pkgs.forEach(([nm, price, rate, dur, c, pop]) => {
    s += rect(24, y, W - 48, 118, 18, PH.card, `stroke="${pop ? PH.gold : PH.line}" stroke-width="${pop ? 2 : 1}"`);
    if (pop) s += rect(W - 130, y - 10, 106, 26, 13, PH.gold) + text(W - 77, y + 7, 'MOST POPULAR', { size: 10, fill: '#fff', weight: 800, anchor: 'middle' });
    s += rect(40, y + 22, 56, 56, 14, c) + star(68, y + 50, 15, '#fff');
    s += text(116, y + 44, nm + ' Plan', { size: 18, fill: PH.ink, weight: 700 });
    s += text(116, y + 68, 'Invest ' + price + ' · ' + dur, { size: 13, fill: PH.mut });
    s += text(W - 40, y + 44, rate, { size: 22, fill: PH.green, weight: 800, anchor: 'end' });
    s += text(W - 40, y + 64, 'daily return', { size: 11, fill: PH.mut, anchor: 'end' });
    s += rect(40, y + 90, W - 80, 14, 0, 'none');
    s += rect(116, y + 86, 120, 0, 0, 'none');
    y += 130;
  });
  // activate button
  s += rect(24, H - 96, W - 48, 60, 30, PH.p);
  s += text(W / 2, H - 58, 'Activate Gold Plan', { size: 16.5, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

function phAdmin() {
  const A = { g: '#006D40', gl: '#95F7B9', bg: '#F1F6F2', card: '#fff', ink: '#10231A', mut: '#6E8278', line: '#E2EBE5' };
  let s = `<defs><linearGradient id="adg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${A.g}"/><stop offset="1" stop-color="#1E8E5A"/></linearGradient></defs>`;
  s += rect(0, 0, W, H, 0, A.bg);
  s += rect(0, 0, W, 230, 0, 'url(#adg)');
  s += statusBar(true);
  s += text(28, 84, 'Profit Hub Admin', { size: 21, fill: '#fff', weight: 800 });
  s += text(28, 107, 'Dashboard overview', { size: 12.5, fill: '#BFE9D2' });
  // KPI cards
  const kpis = [['Total users', '3,482'], ['Active deposits', '$48.2k'], ['Pending payouts', '12']];
  kpis.forEach(([k, v], i) => {
    const cw = (W - 48 - 2 * 12) / 3, x = 24 + i * (cw + 12);
    s += rect(x, 150, cw, 96, 16, '#fff', `filter="drop-shadow(0 10px 22px rgba(0,109,64,.16))"`);
    s += text(x + 14, 184, k, { size: 11.5, fill: A.mut });
    s += text(x + 14, 218, v, { size: 22, fill: A.g, weight: 800 });
  });
  // withdrawal requests
  let y = 286;
  s += text(28, y, 'Withdrawal requests', { size: 17, fill: A.ink, weight: 700 });
  s += text(W - 28, y, '12 pending', { size: 12.5, fill: '#C26A00', weight: 600, anchor: 'end' });
  y += 18;
  const reqs = [['Ahmed R.', '$120 · Easypaisa'], ['Sana K.', '$85 · JazzCash'], ['Bilal M.', '$300 · BTC'], ['Hira S.', '$60 · Bank']];
  reqs.forEach(([nm, meta]) => {
    s += rect(24, y, W - 48, 92, 16, '#fff', `stroke="${A.line}" stroke-width="1"`);
    s += circle(58, y + 36, 20, A.gl) + text(58, y + 42, nm[0], { size: 17, fill: A.g, weight: 700, anchor: 'middle' });
    s += text(92, y + 34, nm, { size: 15.5, fill: A.ink, weight: 700 });
    s += text(92, y + 56, meta, { size: 12.5, fill: A.mut });
    s += rect(40, y + 70, 96, 0, 0, 'none');
    s += rect(W - 200, y + 60, 76, 30, 15, '#fff', `stroke="${A.g}" stroke-width="1.4"`) + text(W - 162, y + 80, 'Reject', { size: 12.5, fill: A.g, weight: 700, anchor: 'middle' });
    s += rect(W - 116, y + 60, 92, 30, 15, A.g) + text(W - 70, y + 80, 'Approve', { size: 12.5, fill: '#fff', weight: 700, anchor: 'middle' });
    y += 104;
  });
  // admin nav
  s += bottomNav([{ g: 'chart', l: 'Dashboard' }, { g: 'user', l: 'Users' }, { g: 'req', l: 'Requests' }, { g: 'settings', l: 'Settings' }], 0, { card: A.card, on: A.g, off: A.mut });
  return wrap('', s);
}

// =============================================================== CALCULATOR ===
const CA = { green: '#30D328', coral: '#F16C4E', dbg: '#010101', dbtn: '#242424', dlime: '#A7F059', dtext: '#FCFAFA', lbg: '#FCFCFC', lbtn: '#F1F1F3', lgreen: '#569415', ltext: '#3A3838', mut: '#8A8A8A' };

function calcKeypad(dark) {
  const bg = dark ? CA.dbg : CA.lbg, btn = dark ? CA.dbtn : CA.lbtn, txt = dark ? CA.dtext : CA.ltext;
  const opc = dark ? CA.dlime : CA.lgreen, eqfill = dark ? CA.dlime : CA.lgreen;
  let s = rect(0, 0, W, H, 0, bg);
  s += statusBar(dark);
  // header
  s += text(28, 92, 'Calculator', { size: 19, fill: txt, weight: 700 });
  s += circle(W - 78, 86, 16, btn) + path(`M ${W - 84} 86 a 6 6 0 1 0 7 -5 a 7 7 0 0 1 -7 5 Z`, { fill: dark ? '#FFD66B' : '#E0930A' });
  s += circle(W - 40, 86, 16, btn) + path(`M ${W - 46} 80 v 8 l 5 3`, { stroke: txt, w: 2 }) + circle(W - 41, 84, 7, 'none', `stroke="${txt}" stroke-width="1.6"`);
  // display
  s += text(W - 32, 230, '1,240 × 8', { size: 22, fill: CA.mut, anchor: 'end' });
  s += text(W - 32, 300, '9,920', { size: 56, fill: txt, weight: 700, anchor: 'end' });
  s += line(28, 344, W - 28, 344, dark ? '#1A1A1A' : '#ECECEC', 1.4);
  // keypad
  const keys = [['C', 'op'], ['( )', 'op'], ['%', 'op'], ['÷', 'op'], ['7', 'n'], ['8', 'n'], ['9', 'n'], ['×', 'op'], ['4', 'n'], ['5', 'n'], ['6', 'n'], ['−', 'op'], ['1', 'n'], ['2', 'n'], ['3', 'n'], ['+', 'op'], ['0', 'n'], ['.', 'n'], ['⌫', 'op'], ['=', 'eq']];
  const cols = 4, gx = 18, top = 386, gap = 14;
  const bw = (W - 28 * 2 - gx * 3) / cols, bh = (H - top - 40 - gap * 4) / 5;
  keys.forEach((k, i) => {
    const r = Math.floor(i / 4), c = i % 4, x = 28 + c * (bw + gx), y = top + r * (bh + gap);
    const isEq = k[1] === 'eq', isOp = k[1] === 'op';
    const fill = isEq ? eqfill : btn;
    s += rect(x, y, bw, bh, bh / 2.4, fill);
    const tc = isEq ? (dark ? '#0A1F00' : '#fff') : isOp ? opc : txt;
    s += text(x + bw / 2, y + bh / 2 + 9, k[0], { size: 26, fill: tc, weight: isOp || isEq ? 700 : 500, anchor: 'middle' });
  });
  return wrap('', s);
}

function calcHistory() {
  const txt = CA.ltext;
  let s = rect(0, 0, W, H, 0, CA.lbg);
  s += rect(0, 0, W, 120, 0, '#fff', `stroke="#EFEFEF" stroke-width="1"`);
  s += statusBar(false);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: txt, w: 2.4 });
  s += text(72, 86, 'History', { size: 20, fill: txt, weight: 700 });
  s += text(W - 28, 86, 'Clear all', { size: 13.5, fill: CA.coral, weight: 600, anchor: 'end' });
  const hist = [['1,240 × 8', '9,920', '2m ago'], ['(45 + 55) × 3', '300', '14m ago'], ['2500 ÷ 4', '625', '1h ago'], ['18% of 2,400', '432', '3h ago'], ['99 × 99', '9,801', 'Yesterday'], ['7^4', '2,401', 'Yesterday']];
  let y = 150;
  hist.forEach(([ex, res, t]) => {
    s += rect(24, y, W - 48, 96, 16, '#fff', `stroke="#EFEFEF" stroke-width="1"`);
    s += text(40, y + 34, ex, { size: 14, fill: CA.mut });
    s += text(40, y + 70, '= ' + res, { size: 24, fill: txt, weight: 700 });
    s += text(W - 40, y + 34, t, { size: 12, fill: CA.mut, anchor: 'end' });
    s += circle(W - 52, y + 64, 14, '#F4F4F4') + path(`M ${W - 58} ${y + 58} l 4 4 m 0 -4 l -4 4`, { stroke: CA.mut, w: 1.8 });
    y += 108;
  });
  // ad slot (remotely managed via Firebase)
  s += rect(24, H - 116, W - 48, 80, 14, '#fff', `stroke="#EFEFEF" stroke-width="1"`);
  s += rect(40, H - 100, 40, 16, 4, '#EFEFEF') + text(60, H - 88, 'Ad', { size: 10.5, fill: CA.mut, weight: 700, anchor: 'middle' });
  s += rect(40, H - 78, 48, 34, 8, '#30D328', `opacity="0.18"`) + circle(64, H - 61, 11, '#30D328', `opacity="0.5"`);
  s += text(100, H - 66, 'Sponsored', { size: 13, fill: txt, weight: 600 }) + text(100, H - 48, 'AdMob · remotely configured', { size: 11.5, fill: CA.mut });
  return wrap('', s);
}

function calcAdmin() {
  const g = '#2E9E2A', red = '#E0463C', ink = '#1E2420', mut = '#83918A', bg = '#F2F5F2', line = '#E5EBE6';
  let s = `<defs><linearGradient id="cag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g}"/><stop offset="1" stop-color="#5CC04E"/></linearGradient></defs>`;
  s += rect(0, 0, W, H, 0, bg);
  s += rect(0, 0, W, 224, 0, 'url(#cag)');
  s += statusBar(true);
  s += text(28, 84, 'Admin Panel', { size: 21, fill: '#fff', weight: 800 });
  s += text(28, 107, 'Calculator · payouts', { size: 12.5, fill: '#D6F2D2' });
  const kpis = [['Users', '8,120'], ['Pending', '23'], ['Paid out', '$2.1k']];
  kpis.forEach(([k, v], i) => {
    const cw = (W - 48 - 2 * 12) / 3, x = 24 + i * (cw + 12);
    s += rect(x, 150, cw, 90, 16, '#fff', `filter="drop-shadow(0 10px 20px rgba(46,158,42,.16))"`);
    s += text(x + 14, 182, k, { size: 12, fill: mut });
    s += text(x + 14, 216, v, { size: 21, fill: g, weight: 800 });
  });
  let y = 278;
  s += text(28, y, 'Withdrawal requests', { size: 17, fill: ink, weight: 700 });
  y += 18;
  const reqs = [['Imran A.', 'imran@mail.com', '$15.00'], ['Noor F.', 'noor@mail.com', '$22.50'], ['Zaid H.', 'zaid@mail.com', '$9.00']];
  reqs.forEach(([nm, em, amt]) => {
    s += rect(24, y, W - 48, 120, 16, '#fff', `stroke="${line}" stroke-width="1"`);
    s += circle(56, y + 38, 20, '#E7F6E5') + text(56, y + 44, nm[0], { size: 17, fill: g, weight: 700, anchor: 'middle' });
    s += text(90, y + 34, nm, { size: 15.5, fill: ink, weight: 700 });
    s += text(90, y + 56, em, { size: 12, fill: mut });
    s += text(W - 40, y + 42, amt, { size: 19, fill: ink, weight: 800, anchor: 'end' });
    s += rect(40, y + 76, (W - 48 - 16) / 2 - 8, 32, 16, '#FDECEA') + text(40 + ((W - 64) / 2 - 8) / 2, y + 97, 'Reject', { size: 13, fill: red, weight: 700, anchor: 'middle' });
    const ax = 40 + (W - 64) / 2;
    s += rect(ax, y + 76, (W - 48 - 16) / 2 - 8, 32, 16, g) + text(ax + ((W - 64) / 2 - 8) / 2, y + 97, 'Approve & pay', { size: 12.5, fill: '#fff', weight: 700, anchor: 'middle' });
    y += 132;
  });
  s += bottomNav([{ g: 'chart', l: 'Home' }, { g: 'user', l: 'Users' }, { g: 'wallet', l: 'Payouts' }, { g: 'settings', l: 'Settings' }], 2, { card: '#fff', on: g, off: mut });
  return wrap('', s);
}

// =================================================================== MEESHO ===
const MS = { p: '#580A46', mag: '#9F2089', or: '#FF9C00', bg: '#F6F1F5', card: '#FFFFFF', ink: '#2A0E24', mut: '#9A8595', line: '#EEE3EC', green: '#1B9E55' };
const msDefs = `<defs><linearGradient id="msg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${MS.p}"/><stop offset="1" stop-color="${MS.mag}"/></linearGradient>
  <linearGradient id="msor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${MS.or}"/><stop offset="1" stop-color="#FFB73D"/></linearGradient></defs>`;
const msNav = (a) => bottomNav([{ g: 'home', l: 'Home' }, { g: 'grid', l: 'Categories' }, { g: 'box', l: 'Orders' }, { g: 'user', l: 'Account' }, { g: 'help', l: 'Help' }], a, { card: MS.card, on: MS.mag, off: MS.mut });

function msHome() {
  let s = msDefs;
  s += rect(0, 0, W, H, 0, MS.bg);
  s += rect(0, 0, W, 168, 0, 'url(#msg)');
  s += statusBar(true);
  s += text(28, 78, 'Meesho', { size: 24, fill: '#fff', weight: 800 });
  s += circle(W - 84, 70, 16, 'rgba(255,255,255,.16)') + path(`M ${W - 90} 66 a 7 7 0 1 0 8 8`, { stroke: '#fff', w: 2, fill: 'none' }) + circle(W - 84, 70, 4, 'none', `stroke="#fff" stroke-width="2"`);
  s += circle(W - 42, 70, 16, 'rgba(255,255,255,.16)') + path(`M ${W - 50} 66 l 4 12 h 8 l 4 -12 Z M ${W - 47} 78 a 1.5 1.5 0 1 0 0.1 0 M ${W - 39} 78 a 1.5 1.5 0 1 0 0.1 0`, { stroke: '#fff', w: 1.8 });
  // search
  s += rect(24, 100, W - 48, 46, 23, '#fff');
  s += circle(50, 123, 8, 'none', `stroke="${MS.mut}" stroke-width="2"`) + line(56, 129, 62, 135, MS.mut, 2);
  s += text(76, 128, 'Search for sarees, kurtis, shoes…', { size: 13.5, fill: MS.mut });
  // promo banner
  s += rect(24, 162, W - 48, 86, 16, 'url(#msor)');
  s += text(44, 200, 'MEGA SALE', { size: 22, fill: '#fff', weight: 800 });
  s += text(44, 226, 'Up to 80% off · Free delivery', { size: 13, fill: '#FFF0D6' });
  s += rect(W - 132, 184, 100, 40, 20, '#fff') + text(W - 82, 209, 'Shop now', { size: 13.5, fill: MS.or, weight: 800, anchor: 'middle' });
  // category circles
  let y = 286;
  const cats = [['Women', '#F7E3F2'], ['Men', '#E3ECF7'], ['Kids', '#FBEEDD'], ['Home', '#E6F7EC'], ['Beauty', '#F7E3E8']];
  cats.forEach(([l, c], i) => {
    const x = 24 + i * ((W - 48) / 5) + ((W - 48) / 5 - 56) / 2;
    s += circle(x + 28, y, 28, c) + circle(x + 28, y, 14, MS.mag, `opacity="0.5"`);
    s += text(x + 28, y + 50, l, { size: 12, fill: MS.ink, weight: 600, anchor: 'middle' });
  });
  // deals
  y += 92;
  s += text(28, y, 'Deals of the day', { size: 17, fill: MS.ink, weight: 700 });
  s += text(W - 28, y, 'View all', { size: 13, fill: MS.mag, weight: 600, anchor: 'end' });
  y += 18;
  const prods = [['Floral Kurti', '₹349', '₹1,299', 4.3], ['Running Shoes', '₹599', '₹1,999', 4.5], ['Cotton Saree', '₹499', '₹1,499', 4.2], ['Wall Clock', '₹279', '₹899', 4.6]];
  const cw = (W - 48 - 16) / 2;
  prods.forEach(([nm, pr, mrp, rt], i) => {
    const x = 24 + (i % 2) * (cw + 16), py = y + Math.floor(i / 2) * 234;
    s += rect(x, py, cw, 220, 16, MS.card, `stroke="${MS.line}" stroke-width="1"`);
    s += rect(x + 10, py + 10, cw - 20, 120, 12, '#F4ECF2') + circle(x + cw / 2, py + 70, 30, '#E7D3E3');
    s += rect(x + 10, py + 102, 70, 24, 0, 'none');
    s += rect(x + 10, py + 104, 58, 22, 6, MS.green) + text(x + 39, py + 120, 'Free Del', { size: 10.5, fill: '#fff', weight: 700, anchor: 'middle' });
    s += text(x + 14, py + 154, nm, { size: 14.5, fill: MS.ink, weight: 600 });
    s += text(x + 14, py + 182, pr, { size: 17, fill: MS.ink, weight: 800 });
    s += text(x + 70, py + 182, mrp, { size: 12.5, fill: MS.mut }) + line(x + 66, py + 178, x + 108, py + 178, MS.mut, 1.2);
    s += rect(x + 14, py + 194, 60, 22, 11, '#EAF7EF') + star(x + 26, py + 205, 6, '#1B9E55') + text(x + 38, py + 210, String(rt), { size: 11.5, fill: MS.green, weight: 700 });
  });
  s += msNav(0);
  return wrap('', s);
}

function msProduct() {
  let s = msDefs;
  s += rect(0, 0, W, H, 0, MS.bg);
  s += rect(0, 0, W, 470, 0, '#F4ECF2');
  s += statusBar(false);
  s += circle(40, 78, 19, '#fff', `filter="drop-shadow(0 3px 8px rgba(0,0,0,.12))"`) + path('M 46 70 L 38 78 L 46 86', { stroke: MS.ink, w: 2.4 });
  s += circle(W - 40, 78, 19, '#fff') + path(`M ${W - 48} 82 a 5 5 0 0 1 9 -3 a 5 5 0 0 1 7 3 c 0 5 -8 9 -8 9 s -8 -4 -8 -9 Z`, { fill: 'none', stroke: MS.mag, w: 2 });
  // hero
  s += circle(W / 2, 250, 96, '#E7D3E3');
  s += rect(W / 2 - 60, 196, 120, 130, 18, MS.mag, `opacity="0.85"`);
  [0, 1, 2, 3].forEach((i) => s += rect(40 + i * 54, 396, 44, 44, 10, i === 0 ? '#fff' : '#F4ECF2', `stroke="${i === 0 ? MS.mag : MS.line}" stroke-width="${i === 0 ? 2 : 1}"`));
  // sheet
  s += rect(0, 470, W, H - 470, 26, MS.card);
  s += text(28, 520, 'Floral Print Anarkali Kurti', { size: 21, fill: MS.ink, weight: 800 });
  s += rect(28, 538, 92, 26, 13, '#EAF7EF') + star(46, 551, 8, MS.green) + text(60, 556, '4.3 · 2.1k', { size: 12, fill: MS.green, weight: 700 });
  // price
  s += text(28, 606, '₹349', { size: 30, fill: MS.ink, weight: 800 });
  s += text(112, 606, '₹1,299', { size: 16, fill: MS.mut }) + line(108, 600, 168, 600, MS.mut, 1.4);
  s += text(180, 606, '73% off', { size: 16, fill: MS.or, weight: 800 });
  s += rect(W - 132, 582, 108, 30, 15, '#FFF1DA') + text(W - 78, 602, 'First-order ₹50', { size: 11.5, fill: '#B86A00', weight: 700, anchor: 'middle' });
  // seller
  s += rect(28, 628, W - 56, 58, 14, '#F7F0F5');
  s += circle(58, 657, 18, MS.p) + text(58, 663, 'S', { size: 16, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(86, 651, 'Sold by StyleHub', { size: 14.5, fill: MS.ink, weight: 700 });
  s += star(90, 672, 6, '#FFB400') + text(102, 677, '4.4 · 12k followers', { size: 12, fill: MS.mut });
  // size
  s += text(28, 724, 'Select size', { size: 15, fill: MS.ink, weight: 700 });
  ['S', 'M', 'L', 'XL', 'XXL'].forEach((sz, i) => {
    const on = i === 1, x = 28 + i * 64;
    s += circle(x + 22, 760, 22, on ? MS.mag : '#fff', `stroke="${on ? MS.mag : MS.line}" stroke-width="${on ? 2 : 1}"`);
    s += text(x + 22, 766, sz, { size: 14, fill: on ? '#fff' : MS.ink, weight: 700, anchor: 'middle' });
  });
  // delivery
  s += rect(28, 800, W - 56, 50, 12, '#EAF7EF');
  s += path('M 50 825 l 4 4 l 8 -9', { stroke: MS.green, w: 2.4 }) + text(76, 830, 'Free delivery by Tue, 4 Jun', { size: 13.5, fill: '#1B7A45', weight: 600 });
  // action bar
  s += rect(0, H - 100, W, 100, 0, MS.card, `stroke="${MS.line}" stroke-width="1"`);
  s += rect(24, H - 78, 158, 56, 28, '#fff', `stroke="${MS.mag}" stroke-width="1.6"`) + text(103, H - 44, 'Add to Cart', { size: 15, fill: MS.mag, weight: 700, anchor: 'middle' });
  s += rect(198, H - 78, W - 222, 56, 28, 'url(#msg)') + text(198 + (W - 222) / 2, H - 44, 'Buy Now', { size: 16, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

function msAdmin() {
  let s = msDefs;
  s += rect(0, 0, W, H, 0, MS.bg);
  s += rect(0, 0, W, 224, 0, 'url(#msg)');
  s += statusBar(true);
  s += text(28, 84, 'Meesho Admin', { size: 21, fill: '#fff', weight: 800 });
  s += text(28, 107, 'Store operations', { size: 12.5, fill: '#E9CFE3' });
  // KPI 2x2-ish (4 across)
  const kpis = [['Orders', '184'], ['Revenue', '₹2.4L'], ['Products', '1,210'], ['Stores', '46']];
  kpis.forEach(([k, v], i) => {
    const cw = (W - 48 - 3 * 10) / 4, x = 24 + i * (cw + 10);
    s += rect(x, 150, cw, 88, 14, '#fff', `filter="drop-shadow(0 10px 20px rgba(88,10,70,.16))"`);
    s += text(x + 12, 180, k, { size: 11, fill: MS.mut });
    s += text(x + 12, 212, v, { size: 18, fill: MS.p, weight: 800 });
  });
  // quick actions
  let y = 274;
  s += text(28, y, 'Manage', { size: 16, fill: MS.ink, weight: 700 });
  y += 16;
  const qa = [['Products', '#F7E3F2'], ['Categories', '#E3ECF7'], ['Banners', '#FBEEDD'], ['Reviews', '#E6F7EC']];
  qa.forEach(([l, c], i) => {
    const cw = (W - 48 - 3 * 12) / 4, x = 24 + i * (cw + 12);
    s += rect(x, y, cw, 76, 14, '#fff', `stroke="${MS.line}" stroke-width="1"`);
    s += rect(x + (cw - 36) / 2, y + 12, 36, 36, 10, c);
    s += text(x + cw / 2, y + 66, l, { size: 11, fill: MS.ink, weight: 600, anchor: 'middle' });
  });
  // recent orders
  y += 104;
  s += text(28, y, 'Recent orders', { size: 16, fill: MS.ink, weight: 700 });
  s += text(W - 28, y, 'View all', { size: 12.5, fill: MS.mag, weight: 600, anchor: 'end' });
  y += 16;
  const orders = [['#MSH-7841', 'Priya · Floral Kurti', '₹349', 'New', '#FFF1DA', '#B86A00'], ['#MSH-7840', 'Rohit · Running Shoes', '₹599', 'Packed', '#E9F0FF', '#2E5BD6'], ['#MSH-7839', 'Anjali · Cotton Saree ×2', '₹998', 'Shipped', '#E6F7EE', '#1B7A45'], ['#MSH-7838', 'Karan · Wall Clock', '₹279', 'Delivered', '#F0F0F0', '#666']];
  orders.forEach(([id, cust, amt, st, sb, sc]) => {
    s += rect(24, y, W - 48, 78, 14, '#fff', `stroke="${MS.line}" stroke-width="1"`);
    s += rect(40, y + 16, 46, 46, 10, '#F4ECF2') + circle(63, y + 39, 13, '#E7D3E3');
    s += text(102, y + 34, cust, { size: 14, fill: MS.ink, weight: 700 });
    s += text(102, y + 56, id, { size: 12, fill: MS.mut });
    s += text(W - 40, y + 34, amt, { size: 15, fill: MS.ink, weight: 800, anchor: 'end' });
    s += rect(W - 132, y + 46, 92, 24, 12, sb) + text(W - 86, y + 62, st, { size: 11.5, fill: sc, weight: 700, anchor: 'middle' });
    y += 90;
  });
  s += bottomNav([{ g: 'chart', l: 'Dashboard' }, { g: 'pkg', l: 'Products' }, { g: 'box', l: 'Orders' }, { g: 'grid', l: 'Stores' }], 0, { card: MS.card, on: MS.mag, off: MS.mut });
  return wrap('', s);
}

// ---- run --------------------------------------------------------------------
await render('profithub_home', phHome());
await render('profithub_packages', phPackages());
await render('profithub_admin', phAdmin());
await render('calc_keypad', calcKeypad(true));
await render('calc_history', calcHistory());
await render('calc_admin', calcAdmin());
await render('meesho_home', msHome());
await render('meesho_product', msProduct());
await render('meesho_admin', msAdmin());
console.log('done — batch 4 mockups');
