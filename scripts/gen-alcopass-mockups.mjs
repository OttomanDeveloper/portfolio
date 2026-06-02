// scripts/gen-alcopass-mockups.mjs
// Hand-designed SVG mockups -> AVIF for AlcoPass (no real screenshots in repo).
// Faithful to the real app: a CONNECTED BLE BREATHALYZER station ("borne éthylotest").
//   android:label "BreatheTest", pkg com.borneethylotest.alcopass. Brand lime #8ABD24.
//   Flow: profile (age/weight/sex/licence/last-drink) -> BLE blow test -> BAC result
//   in g/L blood + mg/L air vs legal limit. 5 languages (FR/EN/DE/ES/IT), Quicksand font.
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
const pathEl = (d, { fill = 'none', stroke = 'none', w = 2 } = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const statusBar = (dark = false) => {
  const c = dark ? '#fff' : '#1A1C15';
  return `${text(28, 30, '9:41', { size: 19, fill: c, weight: 700 })}
    ${[0, 1, 2, 3].map((i) => rect(W - 116 + i * 7, 20 - i * 2, 4, 6 + i * 4, 1, c)).join('')}
    ${pathEl(`M ${W - 78} 18 a 9 9 0 0 1 13 0`, { stroke: c, w: 2 })}
    ${pathEl(`M ${W - 74} 22 a 4 4 0 0 1 5 0`, { stroke: c, w: 2 })}
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

const AC = { p: '#8ABD24', pd: '#6E991A', bg: '#F3F6EA', card: '#FFFFFF', ink: '#1A1C15', mut: '#8A9079', line: '#E6EBD6', red: '#E0453C', amber: '#E8920A', green: '#2E9E2A', blue: '#2B8FE0' };
const acDefs = `<defs>
  <linearGradient id="acg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${AC.p}"/><stop offset="1" stop-color="#A6D63E"/></linearGradient>
  <linearGradient id="acgd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${AC.pd}"/><stop offset="1" stop-color="${AC.p}"/></linearGradient></defs>`;

// breathalyzer device glyph (body + mouthpiece + screen)
function device(cx, cy, s, col = '#fff', screen = 'rgba(255,255,255,.35)') {
  let out = rect(cx - 16 * s, cy - 26 * s, 32 * s, 52 * s, 8 * s, col); // body
  out += rect(cx - 10 * s, cy - 20 * s, 20 * s, 14 * s, 3 * s, screen); // screen
  out += rect(cx - 6 * s, cy + 26 * s, 12 * s, 12 * s, 3 * s, col); // mouthpiece base
  out += rect(cx - 4 * s, cy + 36 * s, 8 * s, 8 * s, 2 * s, col); // tube
  return out;
}
// bluetooth glyph
const bt = (cx, cy, r, c) => pathEl(`M ${cx} ${cy - r} L ${cx + r * 0.7} ${cy - r * 0.4} L ${cx - r * 0.7} ${cy + r * 0.4} L ${cx} ${cy + r} L ${cx} ${cy - r} M ${cx} ${cy + r} L ${cx + r * 0.7} ${cy + r * 0.4} L ${cx - r * 0.7} ${cy - r * 0.4}`, { stroke: c, w: 2.4 });
// wind / breath lines
function breath(cx, cy, c) {
  return pathEl(`M ${cx - 26} ${cy - 10} q 22 -6 30 6 q -3 10 -14 6`, { stroke: c, w: 3 }) +
    pathEl(`M ${cx - 26} ${cy} q 30 -6 42 8 q -4 12 -18 6`, { stroke: c, w: 3 }) +
    pathEl(`M ${cx - 26} ${cy + 10} q 22 -4 28 6 q -3 9 -12 5`, { stroke: c, w: 3 });
}

// --- alcopass_home ---
function acHome() {
  let s = acDefs;
  s += rect(0, 0, W, H, 0, AC.bg);
  s += rect(0, 0, W, 360, 0, 'url(#acg)');
  s += statusBar(true);
  // language pill
  s += rect(W - 116, 60, 92, 34, 17, 'rgba(255,255,255,.2)');
  s += circle(W - 100, 77, 9, '#fff') + pathEl(`M ${W - 109} 77 h 18 M ${W - 100} 68 v 18`, { stroke: AC.p, w: 1.4 });
  s += text(W - 84, 82, 'FR', { size: 13.5, fill: '#fff', weight: 700 }) + pathEl(`M ${W - 44} 74 l 5 5 l 5 -5`, { stroke: '#fff', w: 2 });
  // logo mark
  s += rect(W / 2 - 52, 118, 104, 104, 28, 'rgba(255,255,255,.18)');
  s += rect(W / 2 - 40, 130, 80, 80, 22, '#fff');
  s += device(W / 2, 168, 0.62, AC.p, '#E9F4D2');
  s += breath(W / 2 - 30, 170, AC.pd);
  // title
  s += text(W / 2, 270, 'AlcoPass', { size: 34, fill: '#fff', weight: 800, anchor: 'middle' });
  s += text(W / 2, 302, 'Connected breathalyzer station', { size: 14, fill: '#EAF5D2', anchor: 'middle' });
  // main card
  s += rect(24, 400, W - 48, 232, 24, AC.card, `filter="drop-shadow(0 16px 36px rgba(110,153,26,.18))"`);
  s += text(W / 2, 452, 'Test your blood-alcohol level', { size: 20, fill: AC.ink, weight: 800, anchor: 'middle' });
  s += text(W / 2, 486, 'Blow into the device and get an instant', { size: 13.5, fill: AC.mut, anchor: 'middle' });
  s += text(W / 2, 506, 'reading in g/L blood and mg/L air.', { size: 13.5, fill: AC.mut, anchor: 'middle' });
  // mini readings
  [['g/L', 'blood'], ['mg/L', 'air'], ['0.5', 'limit']].forEach(([a, b], i) => {
    const x = 24 + 56 + i * ((W - 48) / 3);
    s += text(x, 552, a, { size: 18, fill: AC.p, weight: 800, anchor: 'middle' });
    s += text(x, 572, b, { size: 11.5, fill: AC.mut, anchor: 'middle' });
  });
  s += rect(48, 588, W - 96, 28, 0, 'none');
  // start button
  s += rect(48, 660, W - 96, 64, 32, 'url(#acgd)');
  s += breath(120, 692, '#fff');
  s += text(W / 2 + 14, 700, 'Start the test', { size: 18, fill: '#fff', weight: 800, anchor: 'middle' });
  // languages strip
  s += text(W / 2, 776, 'Available in 5 languages', { size: 13, fill: AC.mut, anchor: 'middle' });
  const flags = ['#2B5BE0', '#E0453C', '#1A1C15', '#E8920A', '#2E9E2A'];
  flags.forEach((c, i) => s += circle(W / 2 - 88 + i * 44, 800, 12, c, `stroke="#fff" stroke-width="2"`));
  // legal footer
  s += rect(24, 856, W - 48, 56, 14, '#EDF2DF');
  s += circle(52, 884, 9, AC.p) + text(52, 889, 'i', { size: 13, fill: '#fff', weight: 800, anchor: 'middle' });
  s += text(74, 880, 'Estimates only — never a substitute for', { size: 11.5, fill: '#5E6B45' });
  s += text(74, 898, 'official roadside testing.', { size: 11.5, fill: '#5E6B45' });
  return wrap('', s);
}

// --- alcopass_profile ---
function acProfile() {
  let s = acDefs;
  s += rect(0, 0, W, H, 0, AC.bg);
  s += rect(0, 0, W, 130, 0, 'url(#acg)');
  s += statusBar(true);
  s += pathEl('M 44 78 L 34 88 L 44 98', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 94, 'About you', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(28, 168, 'Refine your result', { size: 17, fill: AC.ink, weight: 800 });
  s += text(28, 190, 'Used to estimate your blood-alcohol curve', { size: 12.5, fill: AC.mut });
  // gender segmented
  let y = 212;
  s += text(28, y, 'SEX', { size: 11.5, fill: AC.mut, weight: 700, spacing: 1 });
  y += 12;
  s += rect(24, y, W - 48, 52, 14, AC.card, `stroke="${AC.line}" stroke-width="1"`);
  s += rect(28, y + 4, (W - 56) / 2, 44, 11, AC.p);
  s += text(28 + (W - 56) / 4, y + 32, 'Male', { size: 15, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(28 + (W - 56) * 0.75, y + 32, 'Female', { size: 15, fill: AC.mut, weight: 600, anchor: 'middle' });
  // age slider
  y += 76;
  s += text(28, y, 'AGE', { size: 11.5, fill: AC.mut, weight: 700, spacing: 1 });
  s += text(W - 28, y, '32 yrs', { size: 14, fill: AC.ink, weight: 700, anchor: 'end' });
  y += 14;
  s += rect(28, y + 6, W - 56, 6, 3, AC.line) + rect(28, y + 6, (W - 56) * 0.4, 6, 3, AC.p);
  s += circle(28 + (W - 56) * 0.4, y + 9, 12, '#fff', `stroke="${AC.p}" stroke-width="3"`);
  // weight + height fields
  y += 40;
  const fw = (W - 48 - 14) / 2;
  s += text(28, y, 'WEIGHT', { size: 11.5, fill: AC.mut, weight: 700, spacing: 1 });
  s += text(28 + fw + 14, y, 'HEIGHT', { size: 11.5, fill: AC.mut, weight: 700, spacing: 1 });
  y += 12;
  s += rect(24, y, fw, 56, 14, AC.card, `stroke="${AC.line}" stroke-width="1"`) + text(40, y + 36, '78', { size: 19, fill: AC.ink, weight: 700 }) + text(fw + 4, y + 36, 'kg', { size: 13, fill: AC.mut, anchor: 'end' });
  s += rect(24 + fw + 14, y, fw, 56, 14, AC.card, `stroke="${AC.line}" stroke-width="1"`) + text(40 + fw + 14, y + 36, '180', { size: 19, fill: AC.ink, weight: 700 }) + text(W - 36, y + 36, 'cm', { size: 13, fill: AC.mut, anchor: 'end' });
  // licence status
  y += 84;
  s += text(28, y, 'DRIVING LICENCE', { size: 11.5, fill: AC.mut, weight: 700, spacing: 1 });
  y += 14;
  const lic = [['New driver', '0.2 g/L', false], ['Experienced', '0.5 g/L', true], ['No licence', '—', false]];
  const lw = (W - 48 - 2 * 12) / 3;
  lic.forEach(([t, lim, on], i) => {
    const x = 24 + i * (lw + 12);
    s += rect(x, y, lw, 64, 14, on ? '#EFF7DD' : AC.card, `stroke="${on ? AC.p : AC.line}" stroke-width="${on ? 2 : 1}"`);
    s += text(x + lw / 2, y + 28, t, { size: 12.5, fill: AC.ink, weight: 700, anchor: 'middle' });
    s += text(x + lw / 2, y + 48, lim, { size: 11.5, fill: on ? AC.pd : AC.mut, weight: 600, anchor: 'middle' });
  });
  // last drink
  y += 90;
  s += text(28, y, 'LAST DRINK', { size: 11.5, fill: AC.mut, weight: 700, spacing: 1 });
  y += 14;
  s += rect(24, y, W - 48, 52, 14, AC.card, `stroke="${AC.line}" stroke-width="1"`);
  s += rect(28, y + 4, (W - 56) / 2, 44, 11, '#EFF7DD', `stroke="${AC.p}" stroke-width="0"`);
  s += text(28 + (W - 56) / 4, y + 31, 'Less than 1h', { size: 14, fill: AC.pd, weight: 700, anchor: 'middle' });
  s += text(28 + (W - 56) * 0.75, y + 31, 'More than 1h', { size: 14, fill: AC.mut, weight: 600, anchor: 'middle' });
  // continue
  s += rect(24, H - 96, W - 48, 60, 30, 'url(#acgd)') + text(W / 2, H - 58, 'Continue to test', { size: 16.5, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// --- alcopass_blow ---
function acBlow() {
  let s = acDefs;
  s += rect(0, 0, W, H, 0, '#10210A');
  s += `<defs><radialGradient id="acglow" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#2A4A12"/><stop offset="1" stop-color="#0C160A"/></radialGradient></defs>`;
  s += rect(0, 0, W, H, 0, 'url(#acglow)');
  s += statusBar(true);
  s += pathEl('M 44 78 L 34 88 L 44 98', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 94, 'Breath test', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // BLE connected chip
  s += rect(W / 2 - 110, 132, 220, 38, 19, 'rgba(138,189,36,.16)');
  s += bt(W / 2 - 88, 151, 8, AC.p) + circle(W / 2 - 88, 151, 13, 'none', `stroke="${AC.p}" stroke-width="1.5"`);
  s += text(W / 2 + 6, 156, 'AlcoPass device · connected', { size: 12.5, fill: '#C6E58A', weight: 600, anchor: 'middle' });
  // central ring
  const cx = W / 2, cy = 440, r = 150;
  s += circle(cx, cy, r, 'none', `stroke="rgba(255,255,255,.08)" stroke-width="16"`);
  const frac = 0.62, C = 2 * Math.PI * r;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${AC.p}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
  // device + breath in center
  s += device(cx, cy - 6, 1.0, '#fff', '#D9EFAF');
  s += breath(cx - 36, cy - 4, AC.p);
  s += text(cx, cy + 96, 'Blow now', { size: 22, fill: '#fff', weight: 800, anchor: 'middle' });
  s += text(cx, cy + 124, 'Blow steadily for 5 seconds', { size: 13, fill: '#9DB37E', anchor: 'middle' });
  // phase steps
  const steps = [['Warm-up', true], ['Ready', true], ['Blowing', 'active'], ['Result', false]];
  let x = 48;
  steps.forEach(([l, st], i) => {
    const sx = 60 + i * ((W - 120) / 3);
    if (i < 3) s += line(sx + 14, 700, sx + (W - 120) / 3 - 14, 700, st === true ? AC.p : 'rgba(255,255,255,.12)', 3);
    const done = st === true, active = st === 'active';
    s += circle(sx, 700, 11, done ? AC.p : active ? '#10210A' : 'rgba(255,255,255,.06)', `stroke="${done || active ? AC.p : 'rgba(255,255,255,.2)'}" stroke-width="2"`);
    if (done) s += pathEl(`M ${sx - 4} 700 l 3 3 l 5 -6`, { stroke: '#10210A', w: 2 });
    if (active) s += circle(sx, 700, 4, AC.p);
    s += text(sx, 732, l, { size: 11.5, fill: done || active ? '#fff' : '#6E7E58', weight: done || active ? 700 : 500, anchor: 'middle' });
  });
  // tip
  s += rect(24, H - 150, W - 48, 64, 16, 'rgba(255,255,255,.06)');
  s += circle(54, H - 118, 11, 'rgba(138,189,36,.25)') + text(54, H - 113, 'i', { size: 13, fill: AC.p, weight: 800, anchor: 'middle' });
  s += text(78, H - 124, 'Do not blow too hard — a steady breath', { size: 12, fill: '#B7C99B' });
  s += text(78, H - 106, 'gives the most accurate reading.', { size: 12, fill: '#B7C99B' });
  return wrap('', s);
}

// --- alcopass_result ---
function acResult() {
  let s = acDefs;
  s += rect(0, 0, W, H, 0, AC.bg);
  s += rect(0, 0, W, 130, 0, 'url(#acg)');
  s += statusBar(true);
  s += pathEl('M 44 78 L 34 88 L 44 98', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 94, 'Your result', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // gauge (semicircle) with zones
  const cx = W / 2, cy = 320, r = 150;
  const zones = [[180, 130, AC.green], [130, 96, AC.amber], [96, 0, AC.red]];
  zones.forEach(([a0, a1, col]) => {
    const ra0 = a0 * Math.PI / 180, ra1 = a1 * Math.PI / 180;
    const x0 = cx + r * Math.cos(ra0), y0 = cy - r * Math.sin(ra0);
    const x1 = cx + r * Math.cos(ra1), y1 = cy - r * Math.sin(ra1);
    s += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="26" stroke-linecap="butt"/>`;
  });
  // limit ticks
  s += text(cx - r + 4, cy + 34, '0', { size: 12, fill: AC.mut, anchor: 'middle' });
  s += text(cx, cy - r - 14, '0.5 g/L', { size: 12, fill: AC.mut, anchor: 'middle' });
  s += text(cx + r - 4, cy + 34, '1.0+', { size: 12, fill: AC.mut, anchor: 'middle' });
  // needle -> points into red (~0.68 g/L => angle ~ 65deg from left)
  const na = 62 * Math.PI / 180;
  s += line(cx, cy, cx + (r - 24) * Math.cos(na), cy - (r - 24) * Math.sin(na), AC.ink, 5);
  s += circle(cx, cy, 12, AC.ink);
  // reading
  s += text(cx, cy + 86, '0.68', { size: 52, fill: AC.red, weight: 800, anchor: 'middle' });
  s += text(cx + 70, cy + 86, 'g/L', { size: 18, fill: AC.mut, weight: 700 });
  s += text(cx, cy + 116, 'blood · 0.34 mg/L exhaled air', { size: 13.5, fill: AC.mut, anchor: 'middle' });
  // status banner
  let y = cy + 150;
  s += rect(24, y, W - 48, 84, 18, '#FCE9E7');
  s += circle(64, y + 42, 22, AC.red) + pathEl(`M 56 ${y + 34} l 16 16 m 0 -16 l -16 16`, { stroke: '#fff', w: 3 });
  s += text(100, y + 36, 'Above the 0.5 g/L limit', { size: 17, fill: '#B5221A', weight: 800 });
  s += text(100, y + 60, 'Do not drive — call a taxi or a friend.', { size: 13, fill: '#A24A44' });
  // sober estimate
  y += 104;
  s += rect(24, y, W - 48, 64, 16, AC.card, `stroke="${AC.line}" stroke-width="1"`);
  s += circle(56, y + 32, 18, '#EFF7DD') + pathEl(`M 56 ${y + 22} v 10 l 7 4`, { stroke: AC.pd, w: 2 }) + circle(56, y + 32, 12, 'none', `stroke="${AC.pd}" stroke-width="1.6"`);
  s += text(86, y + 28, 'Estimated sober', { size: 13, fill: AC.mut });
  s += text(86, y + 50, 'in about 3 h 10 m', { size: 16, fill: AC.ink, weight: 700 });
  s += text(W - 40, y + 40, '~04:50', { size: 14, fill: AC.pd, weight: 700, anchor: 'end' });
  // buttons
  s += rect(24, H - 96, (W - 48 - 14) / 2, 60, 30, AC.card, `stroke="${AC.p}" stroke-width="1.6"`);
  s += text(24 + (W - 62) / 4, H - 58, 'Legal info', { size: 15, fill: AC.pd, weight: 700, anchor: 'middle' });
  s += rect(24 + (W - 62) / 2 + 14, H - 96, (W - 48 - 14) / 2, 60, 30, 'url(#acgd)');
  s += text(24 + (W - 62) / 2 + 14 + (W - 62) / 4, H - 58, 'New test', { size: 15, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// ---- run --------------------------------------------------------------------
await render('alcopass_home', acHome());
await render('alcopass_profile', acProfile());
await render('alcopass_blow', acBlow());
await render('alcopass_result', acResult());
console.log('done — alcopass mockups');
