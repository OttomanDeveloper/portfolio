// scripts/convert-screens.mjs
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { extname, basename, join, resolve } from 'node:path';

const SRC = resolve('D:/MyProjects/github_profile/OttomanDeveloper/Assets');
const OUT = resolve('./public/screens');

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const targets = readdirSync(SRC)
  .filter((f) => f.toLowerCase().endsWith('.png'));

for (const file of targets) {
  const name = basename(file, extname(file));
  const out = join(OUT, `${name}.avif`);
  await sharp(join(SRC, file))
    .resize({ width: 540, withoutEnlargement: true })
    .avif({ quality: 60, effort: 6 })
    .toFile(out);
  console.log(`✓ ${name}.avif`);
}
console.log(`done — ${targets.length} files`);
