// Publishes today's approved (merged) post to Instagram via the Instagram API with
// Instagram Login, which needs no Facebook Page.
//
// Safe to run any number of times a day: it only posts when
//   - it is POST_HOUR or later in TIME_ZONE,
//   - posts/<today>/post.json and image.jpg exist on main (i.e. the PR was merged),
//   - posts/<today>/published.json does not exist yet.
//
// Env: INSTAGRAM_ACCESS_TOKEN (required), GITHUB_REPOSITORY (set by Actions),
//      IG_API_VERSION (default v23.0), DRY_RUN=1 to skip the actual publish.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { POST_HOUR, TIME_ZONE, isJpeg, localNow, postDir, readJson } from './lib.mjs';

const API = `https://graph.instagram.com/${process.env.IG_API_VERSION || 'v23.0'}`;
const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

const { date, hour } = localNow();
const dir = postDir(date);

if (hour < POST_HOUR) {
  console.log(`It is ${hour}:xx in ${TIME_ZONE}; posting starts at ${POST_HOUR}:00. Nothing to do.`);
  process.exit(0);
}
if (existsSync(join(dir, 'published.json'))) {
  console.log(`${dir} is already published. Nothing to do.`);
  process.exit(0);
}
const post = readJson(join(dir, 'post.json'));
if (!post) {
  console.log(`No approved post for ${date} (nothing merged into ${dir}). Nothing to do.`);
  process.exit(0);
}
if (!existsSync(join(dir, 'image.jpg')) || !isJpeg(readFileSync(join(dir, 'image.jpg')))) {
  console.error(`${dir}/image.jpg is missing or not a JPEG. The fetch-image check on the PR must pass before merging.`);
  process.exit(1);
}
if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN secret is not set. See README "Setup".');
  process.exit(1);
}

// jsDelivr pinned to the exact commit: public, immutable, served as image/jpeg.
const sha = execSync('git rev-parse HEAD').toString().trim();
const imageUrl = `https://cdn.jsdelivr.net/gh/${process.env.GITHUB_REPOSITORY}@${sha}/${dir}/image.jpg`;

async function ig(method, path, params = {}) {
  const body = new URLSearchParams({ ...params, access_token: token });
  const url = method === 'GET' ? `${API}/${path}?${body}` : `${API}/${path}`;
  const res = await fetch(url, method === 'GET' ? {} : { method, body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(`${method} ${path} failed (HTTP ${res.status}): ${JSON.stringify(json.error ?? json)}`);
  }
  return json;
}

const me = await ig('GET', 'me', { fields: 'user_id,username' });
console.log(`Authenticated as @${me.username}. Image: ${imageUrl}`);

if (dryRun) {
  console.log('DRY_RUN set: token and post look valid, not publishing.');
  process.exit(0);
}

const container = await ig('POST', `${me.user_id}/media`, { image_url: imageUrl, caption: post.caption });

// Instagram processes the image asynchronously; wait until the container is ready.
for (let attempt = 0; ; attempt++) {
  const { status_code } = await ig('GET', container.id, { fields: 'status_code' });
  if (status_code === 'FINISHED') break;
  if (status_code === 'ERROR' || status_code === 'EXPIRED' || attempt >= 30) {
    throw new Error(`Media container ${container.id} ended in status ${status_code}`);
  }
  await new Promise((r) => setTimeout(r, 5000));
}

const media = await ig('POST', `${me.user_id}/media_publish`, { creation_id: container.id });
const { permalink } = await ig('GET', media.id, { fields: 'permalink' });

writeFileSync(
  join(dir, 'published.json'),
  JSON.stringify({ media_id: media.id, permalink, published_at: new Date().toISOString() }, null, 2) + '\n',
);
console.log(`Published ${date}: ${permalink}`);
