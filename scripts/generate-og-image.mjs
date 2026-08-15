/**
 * Generates the social preview image (`public/og.jpg`) from the hero photo.
 *
 * Usage:
 *   npm run generate:og
 *
 * Same deal as optimize-images.mjs: the output is committed, so the GitHub Pages
 * workflow never has to run sharp. Re-run this if the hero photo changes.
 *
 * 1200x630 is the size WhatsApp, Facebook and LinkedIn crop previews to. The
 * source is a 4:3 phone shot, so `fit: 'cover'` trims the top and bottom rather
 * than letterboxing. Centre rather than sharp's attention strategy, because
 * attention chases local contrast and on a landscape that tends to lock onto a
 * bright patch of sky instead of the ridge line.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'pictures', 'Milseburg.jpg');
const OUT = path.join(ROOT, 'public', 'og.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 82;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

// `.rotate()` with no argument applies the EXIF orientation before resizing, and
// sharp drops the rest of the metadata — including the GPS coordinates the phone
// embedded — so the published preview carries no location data.
const result = await sharp(SRC)
  .rotate()
  .resize({ width: WIDTH, height: HEIGHT, fit: 'cover' })
  .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
  .toFile(OUT);

console.log(
  `${path.basename(SRC)} -> public/og.jpg  ${result.width}x${result.height}  ${kb(result.size)}`
);
