import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

// Card previews are generated before development/build; gallery originals stay intact.
let originalBytes = 0;
let previewBytes = 0;
for (const [directory, scene] of [['public/screens', false], ['public/covers/scenes', true]]) {
  const output = join(directory, 'previews');
  await mkdir(output, { recursive: true });
  for (const filename of await readdir(directory)) {
    if (!/\.(avif|webp)$/i.test(filename)) continue;
    const input = join(directory, filename);
    const source = await stat(input);
    const metadata = await sharp(input).metadata();
    const widths = scene ? [480, 960, 1440] : metadata.width > metadata.height ? [240, 480, 960] : [240, 480];
    for (const width of widths) {
      const target = join(output, `${filename}-${width}.webp`);
      const existing = await stat(target).catch(() => null);
      if (!existing || existing.mtimeMs < source.mtimeMs) {
        await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: scene ? 72 : 82, effort: 4 }).toFile(target);
      }
    }
    originalBytes += source.size;
    previewBytes += (await stat(join(output, `${filename}-${widths[0]}.webp`))).size;
  }
}
console.log(`Small card previews: ${Math.round(previewBytes / 1024)} KB (originals: ${Math.round(originalBytes / 1024)} KB).`);
