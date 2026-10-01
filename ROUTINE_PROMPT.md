# Daily post creation: instructions for the Claude Routine

The scheduled Claude Routine reads this file every morning and follows it. Edit
this file to change the voice, themes or layout rules; the Routine itself does
not need to change.

## Goal

Create today's Mindful Harmony Instagram post from the existing Canva master
template, save it in this repo, and email it to the owner, who posts it to
Instagram by hand (semi-automatic mode). **Never post to Instagram yourself.**

## Fixed values

- Repository: `anabellepr74-coder/Mindful-Harmony-Instagram-Posts`, branch `main`
- Canva master template: `DAHWgUJ7080` ("Mindful Harmony Quote MASTER TEMPLATE").
  **Never edit the master itself**; always work on a copy.
- Email to: `anabellepr74@gmail.com`
- Time zone: `America/New_York`. "Today" means today's date there (`TZ=America/New_York date +%F`).

## Steps

1. **Get the repo.** If it is not already in the session, attach it with push
   access and clone it. Work on the latest `main`.

2. **Stop if today is already handled.** If `posts/<today>/post.json` exists on
   `main`, stop and report "already handled". Do not send another email.

3. **Collect past quotes** so you never repeat one: every `quote` in
   `posts/*/post.json`, plus the titles of the owner's recent Canva designs
   (search designs, newest first, ~30).

4. **Write today's quote and caption.**
   - Voice: gentle, honest, second person, for people recovering from burnout,
     stress and overthinking. Themes to rotate: rest, burnout recovery, anxious or
     racing thoughts, self-kindness, boundaries, small daily practices.
   - Quote: 12–22 words, one or two short sentences, no emoji, no hashtags, no
     attribution. Must say something different from every past quote.
   - Reference examples of the voice (already posted, do not reuse):
     - "Rest isn't a reward you earn after exhaustion. It's what keeps you from reaching it."
     - "You're not lazy. You're burned out. There's a difference — and there's a way back."
     - "Boundaries aren't walls. They're the quiet way you tell yourself your energy matters too."
   - Caption: a first line that hooks, 2–4 short paragraphs expanding the idea
     with one small practical step, a soft call to action (save / share with
     someone who needs it), then 6–10 relevant hashtags on the last line.
     Under 2,200 characters.

5. **Make the design in Canva.**
   1. Copy design `DAHWgUJ7080`.
   2. Open an editing transaction on the copy and read its content. The quote
      goes in the single text element (in the master it is empty, top ≈ 386,
      left ≈ 283.6, width ≈ 512.8). Leave the logo element untouched.
   3. Replace that element's text with the quote, and format it: centred, line
      height 1.4, colour `#321e04` (font size stays ≈ 61.6).
   4. Vertically centre it: set the element's top so its centre is at y = 600
      (top = 600 − height / 2), keeping left as is.
   5. Set the design title to the quote's first four or five words without
      punctuation (e.g. "Rest isnt a reward").
   6. Check the thumbnail: text fully visible, not overlapping the logo, nothing
      cut off. Fix it before committing (shorter quote or adjust the position).
   7. Commit the transaction. (Saving this new copy is pre-approved.)

6. **Export** the copy as **JPG**, quality 95, 1080 × 1350, page 1. Keep the
   returned download URL.

7. **Save to the repo.** Add `posts/<today>/post.json` and commit it directly to
   `main` with message `Instagram post for <today>`, then push:
   ```json
   {
     "date": "<today>",
     "quote": "...",
     "caption": "...",
     "canva_design_id": "...",
     "canva_edit_url": "...",
     "image_source_url": "<export download URL>",
     "created_at": "<ISO timestamp>"
   }
   ```
   Do not add `image.jpg` yourself (Canva's download host is blocked from this
   environment); the "Fetch image" workflow saves it within about a minute.

8. **Wait for the image.** Poll `git fetch origin main` every ~15 seconds for up
   to 5 minutes until `posts/<today>/image.jpg` exists on `origin/main`. If it
   never appears, still send the email but say the image link may not work yet
   and include the Canva edit link as a backup.

9. **Email the owner** (Gmail, to `anabellepr74@gmail.com`):
   - Subject: `Today's Instagram post: "<quote>"`
   - `htmlBody`:
     - the image, shown inline:
       `<img src="https://raw.githubusercontent.com/anabellepr74-coder/Mindful-Harmony-Instagram-Posts/main/posts/<today>/image.jpg" width="360">`
     - a short "How to post" line: on your phone, press and hold the picture
       above and choose "Save image" (or "Save to Photos"), then in Instagram
       tap + → Post, pick it, and paste the caption below.
     - a smaller link "Open full-size image (for desktop)" to
       `https://github.com/anabellepr74-coder/Mindful-Harmony-Instagram-Posts/raw/main/posts/<today>/image.jpg`
     - the caption, exactly as in post.json, in its own block (line breaks as
       `<br>`) so it is easy to copy
     - the Canva edit link, in case they want to tweak the design first
   - `body`: the same content as plain text.

10. **Report** in one line: the email subject and commit, or what failed. If a
    step before 7 fails, commit nothing and report what failed.
