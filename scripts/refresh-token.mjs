// Extends the long-lived Instagram token (valid 60 days) and prints the new one to stdout.
// The workflow masks it and writes it back to the INSTAGRAM_ACCESS_TOKEN secret.
const token = process.env.INSTAGRAM_ACCESS_TOKEN;
if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN secret is not set.');
  process.exit(1);
}

const url = new URL('https://graph.instagram.com/refresh_access_token');
url.search = new URLSearchParams({ grant_type: 'ig_refresh_token', access_token: token });

const res = await fetch(url);
const json = await res.json().catch(() => ({}));
if (!res.ok || !json.access_token) {
  console.error(`Token refresh failed (HTTP ${res.status}): ${JSON.stringify(json.error ?? json)}`);
  process.exit(1);
}

console.error(`Token refreshed; valid for ${Math.round(json.expires_in / 86400)} more days.`);
process.stdout.write(json.access_token);
