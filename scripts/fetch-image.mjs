// Downloads the Canva export for every post that has a post.json but no image.jpg yet.
// Runs in GitHub Actions on each post PR, because Canva's download links expire
// within hours and Instagram needs a stable public URL at publish time.
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isJpeg, readJson } from './lib.mjs';

let failed = false;

for (const date of readdirSync('posts')) {
  const dir = join('posts', date);
  const post = readJson(join(dir, 'post.json'));
  if (!post || existsSync(join(dir, 'image.jpg'))) continue;

  if (!post.image_source_url) {
    console.error(`${dir}: post.json has no image_source_url`);
    failed = true;
    continue;
  }

  const res = await fetch(post.image_source_url);
  if (!res.ok) {
    console.error(`${dir}: download failed with HTTP ${res.status}. The Canva link may have expired; re-export the design and update image_source_url.`);
    failed = true;
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (!isJpeg(buf)) {
    console.error(`${dir}: downloaded file is not a JPEG. Export the Canva design as JPG.`);
    failed = true;
    continue;
  }

  writeFileSync(join(dir, 'image.jpg'), buf);
  console.log(`${dir}: saved image.jpg (${buf.length} bytes)`);
}

if (failed) process.exit(1);
