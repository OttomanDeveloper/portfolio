// scripts/gen-batch2-mockups.mjs
// Hand-designed SVG screen mockups -> AVIF for projects with NO real screenshots.
// Faithful to each app's REAL brand colours/labels/features pulled from source.
//   YouShopper  (multi-vendor e-commerce suite): purple #7D04E7 + orange-red #E62E04, seller #2E294E
//   Nakoda      (India home services):           blue   #0E2C79 + orange    #FE9701
// Phone canvas 540x1200 (9:20), rasterized by sharp. Fonts: Segoe UI / Arial.
import sharp from 'sharp';
import { resolve, join } from 'node:path';

const OUT = resolve('./public/screens');
const W = 540, H = 1200;
const FONT = `'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

// ---- tiny SVG helpers -------------------------------------------------------
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

// status bar (dark text on light, or white on dark)
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

const star = (cx, cy, r, fill) => {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const ao = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const ai = ao + Math.PI / 5;
    d += `${i ? 'L' : 'M'} ${(cx + r * Math.cos(ao)).toFixed(1)} ${(cy + r * Math.sin(ao)).toFixed(1)} `;
    d += `L ${(cx + r * 0.45 * Math.cos(ai)).toFixed(1)} ${(cy + r * 0.45 * Math.sin(ai)).toFixed(1)} `;
  }
  return path(d + 'Z', { fill });
};

async function render(name, svg) {
  await sharp(Buffer.from(svg)).resize(W, H).avif({ quality: 70, effort: 6 }).toFile(join(OUT, `${name}.avif`));
  console.log(`✓ ${name}.avif`);
}

// ============================================================ YOUSHOPPER ======
const YS = { primary: '#7D04E7', accent: '#E62E04', dark: '#2E294E', bg: '#F5F2FB', card: '#FFFFFF', ink: '#1C1430', mut: '#8C86A3', line: '#ECE7F5' };

// bottom nav (customer)
const ysNav = (active) => {
  const items = ['Home', 'Categories', 'Cart', 'Wallet', 'Profile'];
  const x0 = 54, dx = (W - 108) / 4;
  return rect(0, H - 92, W, 92, 0, YS.card, `stroke="${YS.line}" stroke-width="1"`) +
    items.map((label, i) => {
      const x = x0 + i * dx, on = i === active, c = on ? YS.primary : YS.mut;
      let ic = '';
      if (i === 0) ic = path(`M ${x - 11} ${H - 56} L ${x} ${H - 67} L ${x + 11} ${H - 56} L ${x + 11} ${H - 44} L ${x - 11} ${H - 44} Z`, { stroke: c, w: 2.2, fill: on ? c : 'none' });
      if (i === 1) ic = [0, 1].flatMap((a) => [0, 1].map((b) => rect(x - 11 + a * 13, H - 67 + b * 13, 9, 9, 2, on ? c : 'none', `stroke="${c}" stroke-width="2"`))).join('');
      if (i === 2) ic = path(`M ${x - 12} ${H - 66} L ${x - 8} ${H - 66} L ${x - 4} ${H - 50} L ${x + 11} ${H - 50} L ${x + 13} ${H - 60} L ${x - 5} ${H - 60}`, { stroke: c, w: 2.2 }) + circle(x - 3, H - 45, 2.4, c) + circle(x + 9, H - 45, 2.4, c);
      if (i === 3) ic = rect(x - 12, H - 65, 24, 17, 4, on ? c : 'none', `stroke="${c}" stroke-width="2"`) + circle(x + 6, H - 56, 2.6, on ? '#fff' : c);
      if (i === 4) ic = circle(x, H - 62, 6, on ? c : 'none', `stroke="${c}" stroke-width="2"`) + path(`M ${x - 10} ${H - 45} a 10 9 0 0 1 20 0`, { stroke: c, w: 2.2, fill: on ? c : 'none' });
      return ic + text(x, H - 28, label, { size: 12.5, fill: c, weight: on ? 700 : 500, anchor: 'middle' });
    }).join('');
};

const ysDefs = `<defs>
  <linearGradient id="ysg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${YS.primary}"/><stop offset="1" stop-color="#A93BFF"/></linearGradient>
  <linearGradient id="ysflash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${YS.accent}"/><stop offset="1" stop-color="#FF6A3D"/></linearGradient>
</defs>`;

// --- youshopper_home ---
function ysHome() {
  const cats = [['Fashion', '#F3E9FF'], ['Mobiles', '#FFE9E2'], ['Grocery', '#E6F7EE'], ['Beauty', '#FFF1DA']];
  const prods = [['Wireless Buds', '$29.00', 4.6], ['Smart Watch', '$58.00', 4.8], ['Denim Jacket', '$42.00', 4.5], ['Sneakers', '$75.00', 4.7]];
  let s = ysDefs;
  // app bar gradient
  s += rect(0, 0, W, 188, 0, 'url(#ysg)');
  s += statusBar(true);
  s += text(28, 82, 'YouShopper', { size: 25, fill: '#fff', weight: 800 });
  s += text(28, 108, 'Deliver to  Bangkok 10110', { size: 13.5, fill: '#EBD9FF' });
  s += circle(W - 42, 78, 17, 'rgba(255,255,255,.18)') + path(`M ${W - 50} 74 a 8 8 0 0 1 16 0 v 4 l 3 5 h -22 l 3 -5 Z`, { stroke: '#fff', w: 2 }) + circle(W - 42, 88, 3, '#fff');
  // search
  s += rect(24, 150, W - 48, 50, 25, '#fff', `filter="drop-shadow(0 8px 18px rgba(60,0,110,.18))"`);
  s += circle(52, 175, 8, 'none', `stroke="${YS.mut}" stroke-width="2"`) + line(58, 181, 64, 187, YS.mut, 2);
  s += text(78, 181, 'Search products, brands & shops', { size: 14.5, fill: YS.mut });
  // category row
  let y = 238;
  s += text(24, y, 'Categories', { size: 17, fill: YS.ink, weight: 700 });
  s += text(W - 24, y, 'See all', { size: 13, fill: YS.primary, weight: 600, anchor: 'end' });
  y += 22;
  cats.forEach(([label, bg], i) => {
    const x = 24 + i * ((W - 48) / 4);
    s += rect(x, y, 108, 76, 18, bg);
    s += circle(x + 54, y + 30, 16, '#fff');
    s += rect(x + 46, y + 22, 16, 16, 4, YS.primary);
    s += text(x + 54, y + 64, label, { size: 12.5, fill: YS.ink, weight: 600, anchor: 'middle' });
  });
  // flash deal banner
  y += 100;
  s += rect(24, y, W - 48, 92, 18, 'url(#ysflash)');
  s += text(46, y + 38, 'Flash Deal', { size: 20, fill: '#fff', weight: 800 });
  s += text(46, y + 64, 'Up to 60% off · ends in 02:14:09', { size: 13, fill: '#FFE3D6' });
  s += rect(W - 150, y + 28, 110, 40, 20, 'rgba(255,255,255,.18)');
  s += text(W - 95, y + 53, 'Shop now', { size: 14, fill: '#fff', weight: 700, anchor: 'middle' });
  // product grid header
  y += 118;
  s += text(24, y, 'Trending now', { size: 17, fill: YS.ink, weight: 700 });
  y += 18;
  const cw = (W - 48 - 16) / 2;
  prods.forEach(([nm, price, rt], i) => {
    const x = 24 + (i % 2) * (cw + 16), py = y + Math.floor(i / 2) * 196;
    s += rect(x, py, cw, 182, 16, YS.card, `stroke="${YS.line}" stroke-width="1"`);
    s += rect(x + 10, py + 10, cw - 20, 96, 12, '#F1ECF8');
    s += circle(x + cw / 2, py + 58, 26, '#E3D6F5');
    s += circle(x + cw - 26, py + 26, 13, YS.accent) + path(`M ${x + cw - 31} ${py + 26} h 10 M ${x + cw - 26} ${py + 21} v 10`, { stroke: '#fff', w: 2 });
    s += text(x + 14, py + 128, nm, { size: 14.5, fill: YS.ink, weight: 600 });
    s += star(x + 18, py + 150, 7, '#FFB400') + text(x + 30, py + 155, String(rt), { size: 12.5, fill: YS.mut });
    s += text(x + cw - 14, py + 155, price, { size: 16, fill: YS.primary, weight: 800, anchor: 'end' });
  });
  s += ysNav(0);
  return wrap(rect(0, 0, W, H, 0, YS.bg), s);
}

// --- youshopper_product ---
function ysProduct() {
  let s = ysDefs;
  s += rect(0, 0, W, H, 0, YS.bg);
  s += rect(0, 0, W, 470, 0, '#F1ECF8');
  s += statusBar(false);
  // back / share
  s += circle(40, 78, 19, '#fff') + path('M 46 70 L 38 78 L 46 86', { stroke: YS.ink, w: 2.4 });
  s += circle(W - 40, 78, 19, '#fff') + path(`M ${W - 47} 82 l 8 -8 M ${W - 39} 74 v 6 h -6`, { stroke: YS.ink, w: 2 });
  // hero product
  s += circle(W / 2, 250, 92, '#E3D6F5');
  s += rect(W / 2 - 60, 200, 120, 120, 24, YS.primary);
  s += circle(W / 2, 250, 34, 'rgba(255,255,255,.3)');
  // thumbs
  [0, 1, 2].forEach((i) => s += rect(40 + i * 56, 392, 46, 46, 12, i === 0 ? YS.primary : '#fff', `stroke="${YS.line}" stroke-width="1.5"`));
  // sheet
  s += rect(0, 470, W, H - 470, 28, YS.card);
  s += text(28, 522, 'Aurora Smart Watch', { size: 24, fill: YS.ink, weight: 800 });
  s += rect(28, 540, 96, 26, 13, '#FFF1DA');
  s += star(46, 553, 8, '#FFB400') + text(60, 558, '4.8  (1.2k)', { size: 12.5, fill: '#8A6A12', weight: 600 });
  s += text(W - 28, 530, '$58.00', { size: 28, fill: YS.primary, weight: 800, anchor: 'end' });
  s += text(W - 28, 558, '$92.00', { size: 15, fill: YS.mut, anchor: 'end' });
  s += line(W - 90, 553, W - 28, 553, YS.mut, 1.4);
  // seller chip
  s += rect(28, 588, W - 56, 64, 16, '#F7F4FC');
  s += circle(62, 620, 20, YS.dark) + text(62, 626, 'TF', { size: 15, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(94, 614, 'TechForge Store', { size: 15, fill: YS.ink, weight: 700 });
  s += text(94, 636, 'Verified seller · 98% positive', { size: 12.5, fill: YS.mut });
  s += rect(W - 122, 600, 86, 38, 19, '#fff', `stroke="${YS.primary}" stroke-width="1.5"`);
  s += text(W - 79, 624, 'Visit', { size: 13.5, fill: YS.primary, weight: 700, anchor: 'middle' });
  // size / qty
  s += text(28, 700, 'Highlights', { size: 16, fill: YS.ink, weight: 700 });
  ['AMOLED display · 1.4"', 'BLE heart-rate + SpO₂ sync', '7-day battery · IP68'].forEach((t, i) => {
    const yy = 730 + i * 30;
    s += circle(36, yy - 5, 4, YS.accent) + text(52, yy, t, { size: 14, fill: '#5A5470' });
  });
  // club points
  s += rect(28, 830, W - 56, 50, 14, '#EEF8F1');
  s += text(48, 861, 'Earn 58 Club Points on this order', { size: 13.5, fill: '#1B7A45', weight: 600 });
  // bottom action bar
  s += rect(0, H - 100, W, 100, 0, YS.card, `stroke="${YS.line}" stroke-width="1"`);
  s += rect(24, H - 78, 150, 56, 28, '#fff', `stroke="${YS.primary}" stroke-width="1.6"`);
  s += text(99, H - 44, 'Add to Cart', { size: 15, fill: YS.primary, weight: 700, anchor: 'middle' });
  s += rect(190, H - 78, W - 214, 56, 28, YS.primary);
  s += text(190 + (W - 214) / 2, H - 44, 'Buy Now', { size: 16, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// --- youshopper_cart (checkout w/ payments) ---
function ysCart() {
  let s = ysDefs;
  s += rect(0, 0, W, H, 0, YS.bg);
  s += rect(0, 0, W, 120, 0, 'url(#ysg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Checkout', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  // items
  const items = [['Aurora Smart Watch', 'TechForge', '$58.00'], ['Wireless Buds Pro', 'SoundHub', '$29.00']];
  let y = 150;
  items.forEach(([nm, sl, pr]) => {
    s += rect(24, y, W - 48, 96, 16, YS.card, `stroke="${YS.line}" stroke-width="1"`);
    s += rect(40, y + 16, 64, 64, 12, '#F1ECF8') + circle(72, y + 48, 18, '#E3D6F5');
    s += text(120, y + 40, nm, { size: 15.5, fill: YS.ink, weight: 700 });
    s += text(120, y + 62, 'Sold by ' + sl, { size: 12.5, fill: YS.mut });
    s += text(W - 40, y + 40, pr, { size: 16, fill: YS.primary, weight: 800, anchor: 'end' });
    s += rect(W - 116, y + 54, 76, 28, 14, '#F7F4FC');
    s += text(W - 96, y + 73, '–', { size: 18, fill: YS.ink, anchor: 'middle' });
    s += text(W - 78, y + 73, '1', { size: 14, fill: YS.ink, weight: 700, anchor: 'middle' });
    s += text(W - 58, y + 73, '+', { size: 16, fill: YS.primary, anchor: 'middle' });
    y += 112;
  });
  // address
  s += rect(24, y, W - 48, 78, 16, YS.card, `stroke="${YS.line}" stroke-width="1"`);
  s += circle(54, y + 39, 12, 'none', `stroke="${YS.primary}" stroke-width="2"`) + circle(54, y + 39, 4, YS.primary);
  s += text(80, y + 32, 'Deliver to — Home', { size: 14.5, fill: YS.ink, weight: 700 });
  s += text(80, y + 54, '88/12 Sukhumvit Rd, Bangkok 10110', { size: 12.5, fill: YS.mut });
  s += text(W - 40, y + 44, 'Change', { size: 13, fill: YS.primary, weight: 600, anchor: 'end' });
  y += 98;
  // payment methods
  s += text(28, y, 'Payment method', { size: 16, fill: YS.ink, weight: 700 });
  y += 16;
  const pays = [['Stripe card', true], ['PayPal', false], ['Razorpay', false], ['Cash on delivery', false]];
  pays.forEach(([nm, on], i) => {
    const x = 24 + (i % 2) * ((W - 48) / 2 + 0), pw = (W - 48 - 14) / 2;
    const px = 24 + (i % 2) * (pw + 14), py = y + Math.floor(i / 2) * 64;
    s += rect(px, py, pw, 52, 14, on ? '#F3E9FF' : YS.card, `stroke="${on ? YS.primary : YS.line}" stroke-width="${on ? 2 : 1}"`);
    s += rect(px + 14, py + 16, 28, 20, 5, on ? YS.primary : '#D9D2E8');
    s += text(px + 52, py + 32, nm, { size: 13, fill: YS.ink, weight: 600 });
  });
  y += 150;
  // summary
  s += line(24, y, W - 24, y, YS.line, 1.4);
  y += 30;
  [['Subtotal', '$87.00'], ['Delivery', '$3.50'], ['Club Points', '– $5.00']].forEach(([k, v], i) => {
    s += text(28, y + i * 28, k, { size: 14, fill: YS.mut });
    s += text(W - 28, y + i * 28, v, { size: 14, fill: i === 2 ? '#1B7A45' : YS.ink, weight: 600, anchor: 'end' });
  });
  y += 96;
  s += text(28, y, 'Total', { size: 18, fill: YS.ink, weight: 800 });
  s += text(W - 28, y, '$85.50', { size: 22, fill: YS.primary, weight: 800, anchor: 'end' });
  // place order
  s += rect(24, H - 96, W - 48, 60, 30, YS.accent);
  s += text(W / 2, H - 58, 'Place Order', { size: 17, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// --- youshopper_seller (dashboard, dark plum) ---
function ysSeller() {
  let s = `<defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${YS.dark}"/><stop offset="1" stop-color="#46406E"/></linearGradient></defs>`;
  s += rect(0, 0, W, H, 0, '#F4F3F8');
  s += rect(0, 0, W, 280, 0, 'url(#sg)');
  s += statusBar(true);
  s += text(28, 84, 'Seller Dashboard', { size: 22, fill: '#fff', weight: 800 });
  s += text(28, 108, 'TechForge Store · YouShopper', { size: 13, fill: '#C8C3DE' });
  s += circle(W - 42, 88, 20, 'rgba(255,255,255,.14)') + text(W - 42, 94, 'TF', { size: 15, fill: '#fff', weight: 700, anchor: 'middle' });
  // KPI cards
  const kpis = [["Today's sales", '$1,284', YS.primary], ['Orders', '37', YS.accent]];
  kpis.forEach(([k, v, c], i) => {
    const x = 24 + i * ((W - 48) / 2 + 0), cw = (W - 48 - 14) / 2;
    const cx = 24 + i * (cw + 14);
    s += rect(cx, 150, cw, 96, 18, '#fff', `filter="drop-shadow(0 10px 22px rgba(46,41,78,.18))"`);
    s += text(cx + 18, 186, k, { size: 13, fill: YS.mut });
    s += text(cx + 18, 220, v, { size: 26, fill: c, weight: 800 });
  });
  // sales chart card
  s += rect(24, 268, W - 48, 220, 18, '#fff', `stroke="${YS.line}" stroke-width="1"`);
  s += text(44, 304, 'Revenue · this week', { size: 15, fill: YS.ink, weight: 700 });
  s += text(W - 44, 304, '+18%', { size: 14, fill: '#1B7A45', weight: 700, anchor: 'end' });
  const bars = [60, 90, 50, 120, 80, 140, 110], bx = 48, bw = 40, base = 456;
  bars.forEach((b, i) => {
    const x = bx + i * ((W - 96) / 7);
    s += rect(x, base - b, 26, b, 7, i === 5 ? YS.primary : '#E2DCF0');
    s += text(x + 13, base + 22, ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], { size: 12, fill: YS.mut, anchor: 'middle' });
  });
  // recent orders
  s += text(28, 532, 'Recent orders', { size: 16, fill: YS.ink, weight: 700 });
  s += text(W - 28, 532, 'View all', { size: 13, fill: YS.primary, weight: 600, anchor: 'end' });
  const orders = [['#YS-3471', 'Aurora Watch', '$58.00', 'Packed', '#FFF1DA', '#8A6A12'], ['#YS-3470', 'Buds Pro ×2', '$58.00', 'Shipped', '#E9F0FF', '#2E5BD6'], ['#YS-3469', 'Denim Jacket', '$42.00', 'Delivered', '#E6F7EE', '#1B7A45']];
  let y = 552;
  orders.forEach(([id, nm, pr, st, sb, sc]) => {
    s += rect(24, y, W - 48, 78, 16, '#fff', `stroke="${YS.line}" stroke-width="1"`);
    s += rect(40, y + 16, 46, 46, 12, '#F1ECF8') + circle(63, y + 39, 13, '#E3D6F5');
    s += text(102, y + 34, nm, { size: 14.5, fill: YS.ink, weight: 700 });
    s += text(102, y + 56, id, { size: 12.5, fill: YS.mut });
    s += text(W - 40, y + 34, pr, { size: 15, fill: YS.ink, weight: 800, anchor: 'end' });
    s += rect(W - 134, y + 46, 94, 24, 12, sb);
    s += text(W - 87, y + 62, st, { size: 12, fill: sc, weight: 700, anchor: 'middle' });
    y += 90;
  });
  // bottom nav (seller)
  const nav = ['Home', 'Products', 'Orders', 'Wallet', 'More'];
  s += rect(0, H - 88, W, 88, 0, '#fff', `stroke="${YS.line}" stroke-width="1"`);
  nav.forEach((l, i) => {
    const x = 54 + i * ((W - 108) / 4), on = i === 0, c = on ? YS.primary : YS.mut;
    s += circle(x, H - 56, 5, c) + text(x, H - 26, l, { size: 12, fill: c, weight: on ? 700 : 500, anchor: 'middle' });
  });
  return wrap('', s);
}

// --- youshopper_delivery (pickup app, live tracking) ---
function ysDelivery() {
  let s = ysDefs;
  s += rect(0, 0, W, H, 0, '#E9EEF2');
  // map
  s += rect(0, 0, W, 720, 0, '#DCE5EA');
  for (let i = 1; i < 7; i++) s += line(0, i * 110, W, i * 110 - 30, '#CBD6DD', 2);
  for (let i = 1; i < 5; i++) s += line(i * 120, 0, i * 120 - 30, 720, '#CBD6DD', 2);
  s += path('M 60 640 Q 200 520 250 420 T 430 180', { stroke: YS.primary, w: 6 });
  s += statusBar(false);
  s += circle(40, 78, 19, '#fff', `filter="drop-shadow(0 4px 10px rgba(0,0,0,.15))"`) + path('M 46 70 L 38 78 L 46 86', { stroke: YS.ink, w: 2.4 });
  // pins
  s += path('M 60 640 a 14 14 0 1 1 0.1 0 Z', { fill: '#1B7A45' }) + path('M 46 632 L 74 632 L 60 658 Z', { fill: '#1B7A45' }) + circle(60, 632, 6, '#fff');
  s += path('M 430 180 a 16 16 0 1 1 0.1 0 Z', { fill: YS.accent }) + path('M 414 172 L 446 172 L 430 200 Z', { fill: YS.accent }) + circle(430, 172, 7, '#fff');
  // courier marker
  s += circle(250, 420, 22, '#fff', `filter="drop-shadow(0 4px 10px rgba(0,0,0,.2))"`) + circle(250, 420, 15, YS.primary) + rect(243, 414, 14, 12, 2, '#fff');
  // bottom sheet
  s += rect(0, 660, W, H - 660, 28, '#fff', `filter="drop-shadow(0 -8px 24px rgba(0,0,0,.1))"`);
  s += rect(W / 2 - 24, 678, 48, 5, 3, '#D9D2E8');
  s += rect(24, 706, W - 48, 30, 8, '#EEF8F1');
  s += text(W / 2, 727, 'On the way · arriving in 12 min', { size: 14, fill: '#1B7A45', weight: 700, anchor: 'middle' });
  s += text(28, 778, 'Order #YS-3471', { size: 14, fill: YS.mut });
  s += text(28, 808, 'Drop at Sukhumvit Rd, Bangkok', { size: 18, fill: YS.ink, weight: 800 });
  // courier row
  s += rect(24, 832, W - 48, 86, 18, '#F7F4FC');
  s += circle(64, 875, 24, YS.primary) + text(64, 882, 'A', { size: 20, fill: '#fff', weight: 700, anchor: 'middle' });
  s += text(102, 866, 'Arman R.', { size: 16, fill: YS.ink, weight: 700 });
  s += star(106, 890, 7, '#FFB400') + text(118, 895, '4.9 · Pickup partner', { size: 12.5, fill: YS.mut });
  s += circle(W - 96, 875, 22, '#fff', `stroke="${YS.line}" stroke-width="1.5"`) + path(`M ${W - 104} 870 a 8 8 0 0 1 16 0 v 6 l 2 4 h -20 l 2 -4 Z`, { stroke: YS.primary, w: 2 });
  s += circle(W - 48, 875, 22, YS.primary) + path(`M ${W - 57} 872 a 8 8 0 0 1 17 3 a 8 8 0 0 1 -8 7 l -3 4 v -4 a 8 8 0 0 1 -6 -10 Z`, { fill: '#fff' });
  // status steps
  const steps = [['Picked up', true], ['In transit', true], ['Arriving', false], ['Delivered', false]];
  let x = 48;
  steps.forEach(([l, on], i) => {
    const sx = 48 + i * ((W - 96) / 3);
    if (i < 3) s += line(sx + 12, 970, sx + (W - 96) / 3 - 12, 970, on && steps[i + 1][1] ? YS.primary : '#E2DCF0', 3);
    s += circle(sx, 970, 9, on ? YS.primary : '#fff', `stroke="${on ? YS.primary : '#D9D2E8'}" stroke-width="2"`);
    if (on) s += path(`M ${sx - 4} 970 l 3 3 l 5 -6`, { stroke: '#fff', w: 2 });
    s += text(sx, 1002, l, { size: 11.5, fill: on ? YS.ink : YS.mut, weight: on ? 700 : 500, anchor: 'middle' });
  });
  s += rect(24, H - 96, W - 48, 58, 29, YS.primary);
  s += text(W / 2, H - 59, 'Mark as Delivered', { size: 16, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// ================================================================= NAKODA =====
const NK = { primary: '#0E2C79', accent: '#FE9701', bg: '#F1F4FB', card: '#FFFFFF', ink: '#16213D', mut: '#7E89A6', line: '#E6EBF5' };

const nkDefs = `<defs>
  <linearGradient id="nkg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NK.primary}"/><stop offset="1" stop-color="#1B45B0"/></linearGradient>
</defs>`;

const nkNav = (active) => {
  const items = ['Home', 'Services', 'Bookings', 'Account'];
  return rect(0, H - 88, W, 88, 0, NK.card, `stroke="${NK.line}" stroke-width="1"`) +
    items.map((l, i) => {
      const x = 67 + i * ((W - 134) / 3), on = i === active, c = on ? NK.primary : NK.mut;
      let ic = '';
      if (i === 0) ic = path(`M ${x - 11} ${H - 52} L ${x} ${H - 63} L ${x + 11} ${H - 52} L ${x + 11} ${H - 40} L ${x - 11} ${H - 40} Z`, { stroke: c, w: 2.2, fill: on ? c : 'none' });
      if (i === 1) ic = [0, 1].flatMap((a) => [0, 1].map((b) => rect(x - 11 + a * 13, H - 63 + b * 13, 9, 9, 2, on ? c : 'none', `stroke="${c}" stroke-width="2"`))).join('');
      if (i === 2) ic = rect(x - 10, H - 63, 20, 24, 3, on ? c : 'none', `stroke="${c}" stroke-width="2"`) + line(x - 5, H - 56, x + 5, H - 56, on ? '#fff' : c, 2) + line(x - 5, H - 50, x + 3, H - 50, on ? '#fff' : c, 2);
      if (i === 3) ic = circle(x, H - 58, 6, on ? c : 'none', `stroke="${c}" stroke-width="2"`) + path(`M ${x - 10} ${H - 41} a 10 9 0 0 1 20 0`, { stroke: c, w: 2.2, fill: on ? c : 'none' });
      return ic + text(x, H - 24, l, { size: 12.5, fill: c, weight: on ? 700 : 500, anchor: 'middle' });
    }).join('');
};

// service icon glyphs
const nkGlyph = (kind, cx, cy, c) => {
  if (kind === 'clean') return path(`M ${cx - 2} ${cy - 16} l 6 0 l 2 14 l -10 0 Z M ${cx - 8} ${cy - 2} l 14 0 l 2 18 l -18 0 Z`, { stroke: c, w: 2.2, fill: 'none' });
  if (kind === 'ac') return rect(cx - 16, cy - 12, 32, 18, 4, 'none', `stroke="${c}" stroke-width="2.2"`) + line(cx - 10, cy + 12, cx - 10, cy + 16, c, 2.2) + line(cx, cy + 12, cx, cy + 18, c, 2.2) + line(cx + 10, cy + 12, cx + 10, cy + 16, c, 2.2) + line(cx - 9, cy - 3, cx + 9, cy - 3, c, 2);
  if (kind === 'pest') return path(`M ${cx} ${cy - 14} a 9 12 0 0 1 0 24 a 9 12 0 0 1 0 -24 Z`, { stroke: c, w: 2.2, fill: 'none' }) + line(cx - 9, cy - 4, cx - 18, cy - 8, c, 2) + line(cx + 9, cy - 4, cx + 18, cy - 8, c, 2) + line(cx - 9, cy + 4, cx - 18, cy + 8, c, 2) + line(cx + 9, cy + 4, cx + 18, cy + 8, c, 2);
  return '';
};

// --- nakoda_home ---
function nkHome() {
  let s = nkDefs;
  s += rect(0, 0, W, H, 0, NK.bg);
  s += rect(0, 0, W, 250, 0, 'url(#nkg)');
  s += statusBar(true);
  // drawer + logo + bell
  s += line(28, 72, 50, 72, '#fff', 2.4) + line(28, 80, 46, 80, '#fff', 2.4) + line(28, 88, 50, 88, '#fff', 2.4);
  s += text(W / 2, 86, 'Nakoda', { size: 21, fill: '#fff', weight: 800, anchor: 'middle' });
  s += text(W / 2, 106, 'Urban Services', { size: 11.5, fill: NK.accent, weight: 700, anchor: 'middle', spacing: 2 });
  s += circle(W - 40, 80, 17, 'rgba(255,255,255,.16)') + path(`M ${W - 48} 76 a 8 8 0 0 1 16 0 v 4 l 3 5 h -22 l 3 -5 Z`, { stroke: '#fff', w: 2 }) + circle(W - 40, 90, 3, NK.accent);
  // hero text + search
  s += text(28, 152, 'Trusted home services', { size: 19, fill: '#fff', weight: 700 });
  s += text(28, 176, 'at your doorstep in India', { size: 19, fill: '#fff', weight: 700 });
  s += rect(24, 206, W - 48, 52, 26, '#fff', `filter="drop-shadow(0 10px 22px rgba(14,44,121,.25))"`);
  s += circle(52, 232, 8, 'none', `stroke="${NK.mut}" stroke-width="2"`) + line(58, 238, 64, 244, NK.mut, 2);
  s += text(78, 238, 'Search for a service', { size: 14.5, fill: NK.mut });
  // promo banner
  s += rect(24, 286, W - 48, 96, 18, '#fff', `stroke="${NK.line}" stroke-width="1"`);
  s += rect(24, 286, 7, 96, 4, NK.accent);
  s += text(48, 326, 'First booking?', { size: 18, fill: NK.ink, weight: 800 });
  s += text(48, 352, 'Flat ₹150 off with code NAKODA150', { size: 13, fill: NK.mut });
  s += rect(W - 132, 312, 96, 44, 14, '#FFF3E0') + text(W - 84, 339, '20% OFF', { size: 14, fill: '#B86A00', weight: 800, anchor: 'middle' });
  // service categories
  let y = 418;
  s += text(24, y, 'Our services', { size: 17, fill: NK.ink, weight: 800 });
  y += 22;
  const svc = [['clean', 'Cleaning', 'From ₹399'], ['ac', 'AC Service', 'From ₹499'], ['pest', 'Pest Control', 'From ₹699']];
  svc.forEach(([k, nm, pr], i) => {
    const yy = y + i * 110;
    s += rect(24, yy, W - 48, 96, 18, NK.card, `stroke="${NK.line}" stroke-width="1"`);
    s += rect(40, yy + 16, 64, 64, 16, '#EAF0FF');
    s += nkGlyph(k, 72, yy + 48, NK.primary);
    s += text(124, yy + 42, nm + ' Services', { size: 16.5, fill: NK.ink, weight: 700 });
    s += text(124, yy + 66, pr + ' · book in 60 sec', { size: 13, fill: NK.mut });
    s += circle(W - 44, yy + 48, 16, NK.primary) + path(`M ${W - 49} ${yy + 42} l 6 6 l -6 6`, { stroke: '#fff', w: 2.4 });
  });
  // trust strip
  y += 340;
  s += rect(24, y, W - 48, 60, 16, '#EAF0FF');
  [['4.7★', 'rating'], ['50k+', 'bookings'], ['Verified', 'pros']].forEach(([a, b], i) => {
    const x = 24 + 40 + i * ((W - 48) / 3);
    s += text(x, y + 30, a, { size: 16, fill: NK.primary, weight: 800, anchor: 'middle' });
    s += text(x, y + 48, b, { size: 12, fill: NK.mut, anchor: 'middle' });
  });
  s += nkNav(0);
  return wrap('', s);
}

// --- nakoda_service (category detail / sub-services) ---
function nkService() {
  let s = nkDefs;
  s += rect(0, 0, W, H, 0, NK.bg);
  s += rect(0, 0, W, 200, 0, 'url(#nkg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Cleaning Services', { size: 19, fill: '#fff', weight: 700, anchor: 'middle' });
  s += rect(40, 122, 60, 60, 16, 'rgba(255,255,255,.14)') + nkGlyph('clean', 70, 154, '#fff');
  s += text(116, 146, 'Home & kitchen deep clean', { size: 15, fill: '#fff', weight: 700 });
  s += star(120, 168, 7, NK.accent) + text(132, 173, '4.8 · 12k bookings', { size: 12.5, fill: '#C8D4F2' });
  // sub-service cards
  const subs = [['Full Home Deep Clean', '4–5 hrs · 2 cleaners', '₹2,499', '₹3,200'], ['Bathroom Cleaning', '45 min · per bathroom', '₹399', '₹499'], ['Kitchen Deep Clean', '2–3 hrs', '₹1,299', '₹1,600'], ['Sofa & Carpet Shampoo', 'per seat', '₹299', '']];
  let y = 224;
  subs.forEach(([nm, meta, pr, mrp]) => {
    s += rect(24, y, W - 48, 110, 18, NK.card, `stroke="${NK.line}" stroke-width="1"`);
    s += rect(40, y + 18, 74, 74, 14, '#EAF0FF') + nkGlyph('clean', 77, y + 55, NK.primary);
    s += text(130, y + 42, nm, { size: 15.5, fill: NK.ink, weight: 700 });
    s += text(130, y + 64, meta, { size: 12.5, fill: NK.mut });
    s += text(130, y + 90, pr, { size: 17, fill: NK.primary, weight: 800 });
    if (mrp) { s += text(130 + 70, y + 90, mrp, { size: 13, fill: NK.mut }); s += line(130 + 66, y + 86, 130 + 66 + 40, y + 86, NK.mut, 1.3); }
    s += rect(W - 116, y + 64, 76, 34, 17, '#fff', `stroke="${NK.primary}" stroke-width="1.6"`);
    s += text(W - 78, y + 86, 'Add +', { size: 13.5, fill: NK.primary, weight: 700, anchor: 'middle' });
    y += 122;
  });
  // sticky cart bar
  s += rect(24, H - 178, W - 48, 56, 16, '#EAF0FF');
  s += circle(54, H - 150, 14, NK.accent) + text(54, H - 145, '2', { size: 14, fill: '#fff', weight: 800, anchor: 'middle' });
  s += text(80, H - 145, '2 services · ₹2,898', { size: 14.5, fill: NK.ink, weight: 700 });
  s += text(W - 44, H - 145, 'View cart →', { size: 13.5, fill: NK.primary, weight: 700, anchor: 'end' });
  s += nkNav(1);
  return wrap('', s);
}

// --- nakoda_booking (schedule + confirm) ---
function nkBooking() {
  let s = nkDefs;
  s += rect(0, 0, W, H, 0, NK.bg);
  s += rect(0, 0, W, 120, 0, 'url(#nkg)');
  s += statusBar(true);
  s += path('M 44 70 L 34 80 L 44 90', { stroke: '#fff', w: 2.4 });
  s += text(W / 2, 86, 'Confirm Booking', { size: 19, fill: '#fff', weight: 700, anchor: 'middle' });
  // address
  let y = 150;
  s += rect(24, y, W - 48, 84, 16, NK.card, `stroke="${NK.line}" stroke-width="1"`);
  s += circle(54, y + 42, 13, 'none', `stroke="${NK.primary}" stroke-width="2"`) + circle(54, y + 42, 4, NK.primary);
  s += text(82, y + 36, 'Service address', { size: 14.5, fill: NK.ink, weight: 700 });
  s += text(82, y + 60, 'A-204 Galaxy Heights, Mumbai 400072', { size: 12.5, fill: NK.mut });
  s += text(W - 40, y + 48, 'Edit', { size: 13, fill: NK.primary, weight: 600, anchor: 'end' });
  // date / slot
  y += 104;
  s += text(28, y, 'Pick a date', { size: 15, fill: NK.ink, weight: 700 });
  y += 16;
  const days = [['Tue', '12'], ['Wed', '13'], ['Thu', '14'], ['Fri', '15'], ['Sat', '16']];
  days.forEach(([d, n], i) => {
    const x = 24 + i * ((W - 48) / 5), on = i === 1, w = (W - 48) / 5 - 10;
    s += rect(x, y, w, 76, 14, on ? NK.primary : NK.card, `stroke="${on ? NK.primary : NK.line}" stroke-width="1"`);
    s += text(x + w / 2, y + 30, d, { size: 12.5, fill: on ? '#C8D4F2' : NK.mut, anchor: 'middle' });
    s += text(x + w / 2, y + 56, n, { size: 19, fill: on ? '#fff' : NK.ink, weight: 800, anchor: 'middle' });
  });
  y += 102;
  s += text(28, y, 'Time slot', { size: 15, fill: NK.ink, weight: 700 });
  y += 16;
  const slots = [['8–10 AM', false], ['10–12 PM', true], ['1–3 PM', false], ['3–5 PM', false], ['5–7 PM', false], ['7–9 PM', false]];
  slots.forEach(([t, on], i) => {
    const w = (W - 48 - 24) / 3, x = 24 + (i % 3) * (w + 12), py = y + Math.floor(i / 3) * 56;
    s += rect(x, py, w, 44, 12, on ? '#EAF0FF' : NK.card, `stroke="${on ? NK.primary : NK.line}" stroke-width="${on ? 2 : 1}"`);
    s += text(x + w / 2, py + 28, t, { size: 13.5, fill: on ? NK.primary : NK.ink, weight: on ? 700 : 500, anchor: 'middle' });
  });
  y += 134;
  // bill
  s += rect(24, y, W - 48, 168, 18, NK.card, `stroke="${NK.line}" stroke-width="1"`);
  s += text(44, y + 34, 'Bill summary', { size: 15, fill: NK.ink, weight: 800 });
  [['Full Home Deep Clean', '₹2,499'], ['Bathroom Cleaning', '₹399'], ['Coupon NAKODA150', '– ₹150']].forEach(([k, v], i) => {
    s += text(44, y + 66 + i * 28, k, { size: 13.5, fill: NK.mut });
    s += text(W - 44, y + 66 + i * 28, v, { size: 13.5, fill: i === 2 ? '#1B7A45' : NK.ink, weight: 600, anchor: 'end' });
  });
  s += line(44, y + 128, W - 44, y + 128, NK.line, 1.3);
  s += text(44, y + 156, 'Total payable', { size: 15, fill: NK.ink, weight: 800 });
  s += text(W - 44, y + 156, '₹2,748', { size: 18, fill: NK.primary, weight: 800, anchor: 'end' });
  // confirm
  s += rect(24, H - 92, W - 48, 58, 29, NK.accent);
  s += text(W / 2, H - 55, 'Confirm & Pay', { size: 16.5, fill: '#fff', weight: 800, anchor: 'middle' });
  return wrap('', s);
}

// ---- run --------------------------------------------------------------------
await render('youshopper_home', ysHome());
await render('youshopper_product', ysProduct());
await render('youshopper_cart', ysCart());
await render('youshopper_seller', ysSeller());
await render('youshopper_delivery', ysDelivery());
await render('nakoda_home', nkHome());
await render('nakoda_service', nkService());
await render('nakoda_booking', nkBooking());
console.log('done — batch 2 mockups');
