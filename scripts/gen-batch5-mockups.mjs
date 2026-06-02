// scripts/gen-batch5-mockups.mjs
// Re-mock for the corrected "Egg Network" entry (was wrongly "3 Lucky Spin").
// Faithful to the real app: android:label "Egg Network", pkg com.luckyminer.eggnetwork.
// Primary mechanic = passive NETWORK MINING (hourly sessions); secondary = Spin / Scratch /
// Visit & Earn; withdraw via JazzCash/Easypaisa/UPI/GooglePay/BinancePay/Paytm. No Watch&Earn.
// Brand: primary #5e35b1 (deep purple), secondary #3f51b5 (indigo). Coins shown with ₱.
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

const EG = { p: '#5E35B1', pd: '#4527A0', ind: '#3F51B5', gold: '#FFC107', bg: '#F3F1FA', card: '#FFFFFF', ink: '#1E153A', mut: '#8A82A6', line: '#E8E4F3', green: '#1B9E55' };
const egDefs = `<defs><linearGradient id="egg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${EG.p}"/><stop offset="1" stop-color="${EG.ind}"/></linearGradient>
  <linearGradient id="egbal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${EG.pd}"/><stop offset="1" stop-color="#5E35B1"/></linearGradient>
  <radialGradient id="egglow" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#7E57C2"/><stop offset="1" stop-color="#3F2880"/></radialGradient></defs>`;

const egNav = (a) => {
  const items = [{ g: 'home', l: 'Home' }, { g: 'mine', l: 'Mining' }, { g: 'wallet', l: 'Wallet' }, { g: 'user', l: 'Profile' }];
  const pad = 54, dx = (W - pad * 2) / 3, h = 88;
  let s = rect(0, H - h, W, h, 0, EG.card, `stroke="${EG.line}" stroke-width="1"`);
  items.forEach((it, i) => {
    const x = pad + i * dx, c = i === a ? EG.p : EG.mut, fill = i === a ? EG.p : 'none', yy = H - h + 26;
    let ic = '';
    if (it.g === 'home') ic = path(`M ${x - 11} ${yy + 4} L ${x} ${yy - 7} L ${x + 11} ${yy + 4} L ${x + 11} ${yy + 16} L ${x - 11} ${yy + 16} Z`, { stroke: c, w: 2.2, fill });
    if (it.g === 'mine') ic = path(`M ${x} ${yy - 8} c 9 0 12 8 12 14 c 0 7 -5 11 -12 11 c -7 0 -12 -4 -12 -11 c 0 -6 3 -14 12 -14 Z`, { stroke: c, w: 2.2, fill });
    if (it.g === 'wallet') ic = rect(x - 12, yy - 5, 24, 17, 4, fill, `stroke="${c}" stroke-width="2"`) + circle(x + 6, yy + 4, 2.6, i === a ? '#fff' : c);
    if (it.g === 'user') ic = circle(x, yy, 6, fill, `stroke="${c}" stroke-width="2.2"`) + path(`M ${x - 10} ${yy + 17} a 10 9 0 0 1 20 0`, { stroke: c, w: 2.2, fill });
    s += ic + text(x, H - 22, it.l, { size: 12, fill: c, weight: i === a ? 700 : 500, anchor: 'middle' });
  });
  return s;
};

// egg glyph (the mining token)
const egg = (cx, cy, r, fill, extra = '') => path(`M ${cx} ${cy - r * 1.25} c ${r * 0.95} 0 ${r * 1.05} ${r * 0.9} ${r * 1.05} ${r * 1.45} c 0 ${r * 0.78} -${r * 0.62} ${r * 1.3} -${r * 1.05} ${r * 1.3} c -${r * 0.43} 0 -${r * 1.05} -${r * 0.52} -${r * 1.05} -${r * 1.3} c 0 -${r * 0.55} ${r * 0.1} -${r * 1.45} ${r * 1.05} -${r * 1.45} Z`, { fill, ...(extra ? { stroke: extra, w: 2 } : {}) });

function egHome() {
  let s = egDefs;
  s += rect(0, 0, W, H, 0, EG.bg);
  s += rect(0, 0, W, 252, 0, 'url(#egg)');
  s += statusBar(true);
  s += egg(40, 86, 13, '#fff');
  s += text(64, 80, 'Egg Network', { size: 21, fill: '#fff', weight: 800 });
  s += text(64, 102, 'Mine coins every hour', { size: 12.5, fill: '#D6CCF2' });
  s += circle(W - 42, 84, 18, 'rgba(255,255,255,.16)') + path(`M ${W - 50} 80 a 8 8 0 0 1 16 0 v 4 l 3 5 h -22 l 3 -5 Z`, { stroke: '#fff', w: 2 }) + circle(W - 42, 94, 3, EG.gold);
  // balance card
  s += rect(24, 146, W - 48, 130, 22, 'url(#egbal)', `filter="drop-shadow(0 14px 30px rgba(69,39,160,.32))"`);
  s += text(44, 182, 'Coin balance', { size: 13, fill: '#C9BCEC' });
  s += circle(54, 214, 13, EG.gold) + text(54, 219, '₱', { size: 14, fill: '#5E35B1', weight: 800, anchor: 'middle' });
  s += text(74, 224, '12,480', { size: 36, fill: '#fff', weight: 800 });
  s += rect(W - 168, 196, 144, 40, 20, EG.gold) + path(`M ${W - 150} 216 c 5 0 7 4 7 7 c 0 4 -3 6 -7 6 c -4 0 -7 -2 -7 -6 c 0 -3 2 -7 7 -7 Z`, { fill: '#5E35B1' }) + text(W - 86, 221, 'Mining…', { size: 13.5, fill: '#3F2880', weight: 800, anchor: 'middle' });
  // mining status strip
  let y = 300;
  s += rect(24, y, W - 48, 92, 18, EG.card, `stroke="${EG.line}" stroke-width="1"`);
  s += circle(66, y + 46, 26, '#F0EBFB') + egg(66, y + 46, 14, EG.p);
  s += text(108, y + 38, 'Network Mining active', { size: 15.5, fill: EG.ink, weight: 700 });
  s += text(108, y + 60, '+5 coins · 4h 12m left this session', { size: 12.5, fill: EG.mut });
  s += rect(108, y + 70, W - 168, 8, 4, '#EEEAF8') + rect(108, y + 70, (W - 168) * 0.3, 8, 4, EG.gold);
  s += text(W - 44, y + 44, '→', { size: 22, fill: EG.p, anchor: 'end', weight: 700 });
  // earn grid
  y += 116;
  s += text(28, y, 'More ways to earn', { size: 17, fill: EG.ink, weight: 700 });
  y += 18;
  const tiles = [['mine', 'Network Mining', '#EFEAFB', EG.p], ['spin', 'Spin & Win', '#FFF3D6', '#E0930A'], ['scratch', 'Scratch & Win', '#E7F0FF', EG.ind], ['visit', 'Visit & Earn', '#E6F7EC', EG.green]];
  const tw = (W - 48 - 14) / 2;
  tiles.forEach(([g, l, bg, c], i) => {
    const x = 24 + (i % 2) * (tw + 14), py = y + Math.floor(i / 2) * 116;
    s += rect(x, py, tw, 100, 18, EG.card, `stroke="${EG.line}" stroke-width="1"`);
    s += rect(x + 18, py + 18, 52, 52, 14, bg);
    const cx = x + 44, cy = py + 44;
    if (g === 'mine') s += egg(cx, cy, 14, c);
    if (g === 'spin') s += circle(cx, cy, 14, 'none', `stroke="${c}" stroke-width="2.4"`) + line(cx, cy, cx, cy - 14, c, 2.4) + line(cx, cy, cx + 12, cy + 7, c, 2.4) + circle(cx, cy, 3, c);
    if (g === 'scratch') s += rect(cx - 13, cy - 10, 26, 20, 4, 'none', `stroke="${c}" stroke-width="2.2"`) + path(`M ${cx - 8} ${cy + 2} l 5 -5 l 5 5`, { stroke: c, w: 2 });
    if (g === 'visit') s += circle(cx, cy, 13, 'none', `stroke="${c}" stroke-width="2.2"`) + path(`M ${cx - 13} ${cy} h 26 M ${cx} ${cy - 13} a 18 18 0 0 1 0 26 a 18 18 0 0 1 0 -26`, { stroke: c, w: 1.6 });
    s += text(x + 84, py + 44, l, { size: 14.5, fill: EG.ink, weight: 700 });
    s += text(x + 84, py + 66, 'Tap to open', { size: 11.5, fill: EG.mut });
  });
  s += egNav(0);
  return wrap('', s);
}

function egMining() {
  let s = egDefs;
  s += rect(0, 0, W, H, 0, '#1C1140');
  s += rect(0, 0, W, H, 0, 'url(#egglow)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Network Mining', { size: 19, fill: '#fff', weight: 700, anchor: 'middle' });
  // central mining egg with glow rings
  const cx = W / 2, cy = 380;
  [150, 120, 92].forEach((r, i) => s += circle(cx, cy, r, 'none', `stroke="rgba(255,255,255,${0.06 + i * 0.04})" stroke-width="1.5"`));
  s += egg(cx, cy, 70, '#fff', '');
  s += egg(cx, cy, 70, 'url(#egbal)');
  // crack lines on egg
  s += path(`M ${cx - 18} ${cy - 20} l 10 8 l -8 8 l 12 8`, { stroke: 'rgba(255,255,255,.5)', w: 2 });
  s += circle(cx, cy - 6, 22, 'rgba(255,255,255,.16)') + text(cx, cy + 2, '₱', { size: 30, fill: '#FFC107', weight: 800, anchor: 'middle' });
  // rate
  s += text(cx, cy + 130, 'Mining rate', { size: 13, fill: '#C9BCEC', anchor: 'middle' });
  s += text(cx, cy + 168, '+5.00 / session', { size: 26, fill: '#fff', weight: 800, anchor: 'middle' });
  // session timer + progress
  let y = cy + 210;
  s += rect(40, y, W - 80, 70, 18, 'rgba(255,255,255,.08)');
  s += text(64, y + 30, 'Session ends in', { size: 13, fill: '#C9BCEC' });
  s += text(W - 64, y + 30, '04 : 12 : 38', { size: 16, fill: '#fff', weight: 700, anchor: 'end' });
  s += rect(64, y + 46, W - 128, 8, 4, 'rgba(255,255,255,.14)') + rect(64, y + 46, (W - 128) * 0.3, 8, 4, EG.gold);
  // history rows
  y += 96;
  s += text(40, y, 'Mining history', { size: 15, fill: '#fff', weight: 700 });
  [['Today, 09:00', '+5.00'], ['Yesterday, 21:00', '+5.00'], ['Yesterday, 12:00', '+5.00']].forEach(([t, a], i) => {
    const ry = y + 18 + i * 50;
    s += rect(40, ry, W - 80, 42, 12, 'rgba(255,255,255,.06)');
    s += egg(64, ry + 21, 9, EG.gold);
    s += text(86, ry + 26, t, { size: 12.5, fill: '#D6CCF2' });
    s += text(W - 64, ry + 26, a + ' ₱', { size: 13.5, fill: '#7CFFB0', weight: 700, anchor: 'end' });
  });
  // claim button
  s += rect(40, H - 96, W - 80, 60, 30, EG.gold);
  s += text(W / 2, H - 58, 'Boost mining (watch ad)', { size: 15.5, fill: '#3F2880', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

function egSpin() {
  let s = egDefs;
  s += rect(0, 0, W, H, 0, EG.bg);
  s += rect(0, 0, W, 120, 0, 'url(#egg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Spin & Win', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // spins left
  s += rect(24, 150, W - 48, 56, 16, EG.card, `stroke="${EG.line}" stroke-width="1"`);
  s += circle(54, 178, 14, '#F0EBFB') + path('M 54 168 v 10 l 7 4', { stroke: EG.p, w: 2 }) + circle(54, 178, 9, 'none', `stroke="${EG.p}" stroke-width="1.6"`);
  s += text(80, 184, 'Free spins left today', { size: 14, fill: EG.ink, weight: 600 });
  s += text(W - 44, 184, '3 / 5', { size: 16, fill: EG.p, weight: 800, anchor: 'end' });
  // wheel
  const cx = W / 2, cy = 470, r = 168;
  const segs = ['50', '10', '200', '5', '100', '20', '500', '15'];
  const cols = ['#5E35B1', '#7E57C2', '#3F51B5', '#5C6BC0', '#673AB7', '#7E57C2', '#3949AB', '#5E35B1'];
  segs.forEach((v, i) => {
    const a0 = (i / segs.length) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / segs.length) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += path(`M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`, { fill: cols[i] });
    const am = (a0 + a1) / 2, tx = cx + r * 0.66 * Math.cos(am), ty = cy + r * 0.66 * Math.sin(am);
    s += `<g transform="rotate(${(am * 180 / Math.PI + 90).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})">${text(tx, ty + 5, v, { size: 18, fill: '#fff', weight: 800, anchor: 'middle' })}</g>`;
  });
  s += circle(cx, cy, r, 'none', `stroke="#fff" stroke-width="6"`);
  s += circle(cx, cy, 30, '#fff') + circle(cx, cy, 22, EG.gold) + text(cx, cy + 6, '₱', { size: 20, fill: '#5E35B1', weight: 800, anchor: 'middle' });
  // pointer
  s += path(`M ${cx} ${cy - r - 16} l -12 -18 l 24 0 Z`, { fill: EG.gold });
  // spin button
  s += rect(70, H - 112, W - 140, 62, 31, 'url(#egg)');
  s += text(W / 2, H - 73, 'SPIN NOW', { size: 18, fill: '#fff', weight: 800, anchor: 'middle', spacing: 1 });
  return wrap('', s);
}

function egScratch() {
  let s = egDefs;
  s += rect(0, 0, W, H, 0, EG.bg);
  s += rect(0, 0, W, 120, 0, 'url(#egg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Scratch & Win', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(W / 2, 180, 'Scratch the card to reveal your prize', { size: 14, fill: EG.mut, anchor: 'middle' });
  // big scratch card
  const cx = W / 2;
  s += rect(48, 220, W - 96, 300, 24, 'url(#egbal)', `filter="drop-shadow(0 18px 40px rgba(69,39,160,.3))"`);
  // partially scratched foil (silver patches)
  s += `<defs><linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9C9D6"/><stop offset="1" stop-color="#9A9AAE"/></linearGradient></defs>`;
  s += path(`M 80 250 q 60 -20 120 10 q 80 30 200 -6 l 0 240 q -160 30 -240 0 q -70 -26 -80 -120 Z`, { fill: 'url(#foil)' });
  s += text(cx, 360, 'YOU WON', { size: 16, fill: '#fff', weight: 700, anchor: 'middle', spacing: 2 });
  s += circle(cx, 415, 30, EG.gold) + text(cx, 423, '₱', { size: 26, fill: '#5E35B1', weight: 800, anchor: 'middle' });
  s += text(cx, 480, '120 coins', { size: 30, fill: '#fff', weight: 800, anchor: 'middle' });
  // scratch hint
  s += circle(180, 320, 16, 'rgba(255,255,255,.5)') + path('M 174 314 l 12 12 m 0 -12 l -12 12', { stroke: '#6A5AA8', w: 2 });
  // cards left
  s += rect(24, 552, W - 48, 56, 16, EG.card, `stroke="${EG.line}" stroke-width="1"`);
  s += text(44, 586, 'Scratch cards left today', { size: 14, fill: EG.ink, weight: 600 });
  s += text(W - 44, 586, '2 / 3', { size: 16, fill: EG.ind, weight: 800, anchor: 'end' });
  // reveal more
  s += rect(48, 650, W - 96, 58, 29, 'url(#egg)') + text(W / 2, 687, 'Get another card', { size: 16, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

function egVisit() {
  let s = egDefs;
  s += rect(0, 0, W, H, 0, EG.bg);
  s += rect(0, 0, W, 120, 0, 'url(#egg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Visit & Earn', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  s += rect(24, 144, W - 48, 56, 16, '#EFEAFB');
  s += text(44, 170, 'Visit a site for 30s to earn coins', { size: 13.5, fill: EG.p, weight: 600 });
  s += text(44, 190, 'Stay on the page until the timer completes', { size: 11.5, fill: '#8A7EBE' });
  const tasks = [['Daily News Digest', '+15 ₱', '30s', true], ['Crypto Market Today', '+20 ₱', '45s', true], ['Mobile Games Hub', '+10 ₱', '30s', false], ['Tech Deals Blog', '+12 ₱', '30s', false], ['Recipe of the Day', '+10 ₱', '30s', false]];
  let y = 220;
  tasks.forEach(([nm, rw, dur, done]) => {
    s += rect(24, y, W - 48, 86, 16, EG.card, `stroke="${EG.line}" stroke-width="1"`);
    s += rect(40, y + 18, 50, 50, 13, '#EFEAFB') + circle(65, y + 43, 12, 'none', `stroke="${EG.p}" stroke-width="2"`) + path(`M 54 ${y + 43} h 22 M 65 ${y + 32} a 16 16 0 0 1 0 22`, { stroke: EG.p, w: 1.4 });
    s += text(106, y + 38, nm, { size: 15, fill: EG.ink, weight: 700 });
    s += text(106, y + 60, dur + ' visit · ' + rw, { size: 12.5, fill: EG.mut });
    if (done) { s += rect(W - 120, y + 28, 96, 32, 16, '#E6F7EC') + path(`M ${W - 104} ${y + 44} l 5 5 l 10 -11`, { stroke: EG.green, w: 2.4 }) + text(W - 60, y + 49, 'Done', { size: 12.5, fill: EG.green, weight: 700, anchor: 'middle' }); }
    else { s += rect(W - 116, y + 28, 92, 32, 16, EG.p) + text(W - 70, y + 49, 'Visit →', { size: 12.5, fill: '#fff', weight: 700, anchor: 'middle' }); }
    y += 98;
  });
  s += egNav(0);
  return wrap('', s);
}

function egWithdraw() {
  let s = egDefs;
  s += rect(0, 0, W, H, 0, EG.bg);
  s += rect(0, 0, W, 120, 0, 'url(#egg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Withdraw', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // balance
  s += rect(24, 146, W - 48, 96, 20, 'url(#egbal)');
  s += text(44, 182, 'Available to withdraw', { size: 12.5, fill: '#C9BCEC' });
  s += circle(52, 214, 12, EG.gold) + text(52, 219, '₱', { size: 13, fill: '#5E35B1', weight: 800, anchor: 'middle' });
  s += text(72, 222, '12,480', { size: 32, fill: '#fff', weight: 800 });
  s += text(W - 44, 200, '≈ $11.20', { size: 14, fill: '#C9BCEC', anchor: 'end' });
  // amount field
  s += text(28, 280, 'Amount', { size: 13, fill: EG.mut, weight: 700 });
  s += rect(24, 292, W - 48, 56, 14, EG.card, `stroke="${EG.line}" stroke-width="1"`);
  s += text(44, 327, '5,000', { size: 18, fill: EG.ink, weight: 700 });
  s += text(W - 44, 327, 'MAX', { size: 13, fill: EG.p, weight: 800, anchor: 'end' });
  // method picker
  s += text(28, 384, 'Payout method', { size: 13, fill: EG.mut, weight: 700 });
  const methods = [['JazzCash', '#E2136E'], ['Easypaisa', '#00A651'], ['UPI', '#3F51B5'], ['Google Pay', '#4285F4'], ['Binance Pay', '#F0B90B'], ['Paytm', '#00BAF2']];
  let y = 398;
  const mw = (W - 48 - 14) / 2;
  methods.forEach(([nm, c], i) => {
    const x = 24 + (i % 2) * (mw + 14), py = y + Math.floor(i / 2) * 64, on = i === 1;
    s += rect(x, py, mw, 52, 14, on ? '#EFEAFB' : EG.card, `stroke="${on ? EG.p : EG.line}" stroke-width="${on ? 2 : 1}"`);
    s += circle(x + 26, py + 26, 13, c) + text(x + 26, py + 31, nm[0], { size: 13, fill: '#fff', weight: 800, anchor: 'middle' });
    s += text(x + 48, py + 31, nm, { size: 13.5, fill: EG.ink, weight: 600 });
    if (on) s += path(`M ${x + mw - 26} ${py + 26} l 4 4 l 8 -9`, { stroke: EG.p, w: 2.4 });
  });
  y += 3 * 64 + 14;
  // account field
  s += rect(24, y, W - 48, 56, 14, EG.card, `stroke="${EG.line}" stroke-width="1"`);
  s += text(44, y - 6, 'Easypaisa number', { size: 12, fill: EG.mut, weight: 600 });
  s += text(44, y + 34, '03•• ••• ••••', { size: 15, fill: '#B4ACC9' });
  // withdraw button
  s += rect(24, H - 96, W - 48, 60, 30, EG.gold);
  s += text(W / 2, H - 58, 'Request withdrawal', { size: 16.5, fill: '#3F2880', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// ---- run --------------------------------------------------------------------
await render('eggnetwork_home', egHome());
await render('eggnetwork_mining', egMining());
await render('eggnetwork_spin', egSpin());
await render('eggnetwork_scratch', egScratch());
await render('eggnetwork_visit', egVisit());
await render('eggnetwork_withdraw', egWithdraw());
console.log('done — batch 5 (Egg Network) mockups');
