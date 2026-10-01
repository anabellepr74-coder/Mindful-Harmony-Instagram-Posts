# Daily post creation: instructions for the Claude Routine

The scheduled Claude Routine reads this file every morning and follows it. Edit
this file (by PR) to change the voice, themes or layout rules; the Routine itself
does not need to change.

## Goal

Create today's Mindful Harmony Instagram post from the existing Canva master
template and open a pull request for approval. **Never publish to Instagram
yourself** — merging the PR is the human approval, and GitHub Actions publishes.

## Fixed values

- Repository: `anabellepr74-coder/Mindful-Harmony-Instagram-Posts`
- Canva master template: `DAHWgUJ7080` ("Mindful Harmony Quote MASTER TEMPLATE").
  **Never edit the master itself**; always work on a copy.
- Time zone: `America/New_York`. "Today" means today's date there (`TZ=America/New_York date +%F`).

## Steps

1. **Get the repo.** If it is not already in the session, attach it with push
   access and clone it. Work from the latest `main`.

2. **Stop if today is already handled.** If `posts/<today>/post.json` exists on
   `main`, or an open PR from branch `post/<today>` exists, stop and report that.

3. **Close stale drafts.** Close any open PR from a `post/<date>` branch whose
   date is before today, with the comment "Not approved on its day; skipped."

4. **Collect past quotes** so you never repeat one: every `quote` in
   `posts/*/post.json` on `main`, plus the titles of the user's recent Canva
   designs (search designs, newest first, ~30).

5. **Write today's quote and caption.**
   - Voice: gentle, honest, second person, for people recovering from burnout,
     stress and overthinking. Themes to rotate: rest, burnout recovery, anxious or
     racing thoughts, self-kindness, boundaries, small daily practices.
   - Quote: 12–22 words, one or two short sentences, no emoji, no hashtags, no
     attribution. Must say something different from every past quote.
   - Reference examples of the voice (already posted, do not reuse):
     - "Rest isn't a reward you earn after exhaustion. It's what keeps you from reaching it."
     - "You're not lazy. You're burned out. There's a difference — and there's a way back."
   - Caption: a first line that hooks, 2–4 short paragraphs expanding the idea
     with one small practical step, a soft call to action (save / share with
     someone who needs it), then 6–10 relevant hashtags on the last line.
     Under 2,200 characters.

6. **Make the design in Canva.**
   1. Copy design `DAHWgUJ7080`.
   2. Open an editing transaction on the copy and read its content and thumbnail.
      The quote goes in the single text element (in the master it is empty, top
      ≈ 386, left ≈ 283.6, width ≈ 512.8). Leave the logo element untouched.
   3. Replace that element's text with the quote.
   4. Vertically centre it: after the text is in, set the element's top so its
      centre is at about y = 600 (top = 600 − height / 2), keeping left as is.
   5. Match the published posts' style if the copy differs: centred, line height
      1.4, colour `#321e04`, font size ≈ 62.
   6. Set the design title to the quote's first four or five words without
      punctuation (e.g. "Rest isnt a reward").
   7. Check the thumbnail: text fully visible, not overlapping the logo, nothing
      cut off. Fix it before committing (shorter quote or adjust the position).
   8. Commit the transaction. (Committing edits to this new copy is pre-approved;
      the human approval happens on the PR.)

7. **Export** the copy as **JPG**, quality 95, 1080 × 1350, page 1. Keep the
   returned download URL.

8. **Open the PR.**
   - Branch `post/<today>` from `main`.
   - Add `posts/<today>/post.json`:
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
   - Do not add `image.jpg` yourself; the "Fetch image" workflow downloads it into
     the PR within a minute.
   - Commit, push, and open a PR to `main` titled
     `Instagram post for <today>: "<quote>"`. Body: the quote, the full caption,
     the Canva edit link, and:
     > **Merge to approve.** Posts at 9:00 AM ET, or right away if merged later
     > today. Wait for the "Fetch image" check to pass before merging. Close the
     > PR to skip today.

9. **Report** the PR link. If any step fails, do not open a partial PR; report
   what failed instead.
