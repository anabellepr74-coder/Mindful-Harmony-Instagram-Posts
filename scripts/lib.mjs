// Shared helpers for the posting scripts. Node 20+, no dependencies.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const TIME_ZONE = process.env.POST_TIME_ZONE || 'America/New_York';
export const POST_HOUR = Number(process.env.POST_HOUR || 9);

/** Calendar date (YYYY-MM-DD) and hour in TIME_ZONE for the given instant. */
export function localNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

export function postDir(date) {
  return join('posts', date);
}

export function readJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

/** JPEG files start with FF D8 FF. Instagram only accepts JPEG for photo posts. */
export function isJpeg(buf) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}
