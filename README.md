# Mindful Harmony Instagram Posts

Daily Instagram quote posts for Mindful Harmony, made from the existing Canva
master template and emailed to you ready to post.

## How it works (semi-automatic mode)

| Time (America/New_York) | What happens | Runs on |
|---|---|---|
| 7:22 AM | A Claude Routine writes a new quote and caption, copies the Canva master template, fills in the quote, exports a JPG, and commits `posts/<date>/post.json`. Instructions: [`ROUTINE_PROMPT.md`](./ROUTINE_PROMPT.md). | Your Claude plan |
| ~1 min later | **Fetch image** workflow saves the Canva export as `posts/<date>/image.jpg` (Canva links expire within hours). | GitHub Actions (free) |
| ~7:30 AM | The Routine emails you the image, a download link, and the caption. | Your Claude plan |
| When you like | You save the image and post it on Instagram with the caption. | You |

The Routine needs the **Canva** and **Gmail** connectors attached to it.

Every post ever made stays in `posts/`, which is also how the agent avoids
repeating a quote.

## Changing things

- Voice, themes, caption style, layout rules, email format: edit `ROUTINE_PROMPT.md`.
- Skip a day: just don't post it.

## Fully automatic posting (optional, later)

The repo already contains the code to publish without you, via Meta's
*Instagram API with Instagram Login* (no Facebook Page needed). It is switched
off because it needs a Meta developer app, and Meta's developer sign-up asks
for identity verification (phone or card). To switch it on:

1. Create the app at <https://developers.facebook.com/apps> with the use case
   for managing content on **Instagram** → **API setup with Instagram login** →
   **Add account** (your Instagram) → **Generate token**.
2. Add repository secrets (**Settings → Secrets and variables → Actions**):
   `INSTAGRAM_ACCESS_TOKEN` (the token) and `SECRETS_PAT` (a
   [fine-grained token](https://github.com/settings/personal-access-tokens/new)
   for only this repo with **Secrets: Read and write**, used to renew the token).
3. Set **Settings → Actions → General → Workflow permissions** to **Read and write**.
4. Restore the triggers described at the top of
   `.github/workflows/publish.yml` and `refresh-token.yml`, and switch
   `ROUTINE_PROMPT.md` back to opening a PR for approval instead of emailing.
5. Test with **Actions → Publish to Instagram → Run workflow** (dry run).
