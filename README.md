# Mindful Harmony Instagram Posts

Daily Instagram quote posts for Mindful Harmony, made from the existing Canva
master template, approved by you, published automatically.

## How it works

| Time (America/New_York) | What happens | Runs on |
|---|---|---|
| 7:22 AM | A Claude Routine writes a new quote and caption, copies the Canva master template, fills in the quote, exports a JPG, and opens a PR with `posts/<date>/post.json`. Instructions: [`ROUTINE_PROMPT.md`](./ROUTINE_PROMPT.md). | Your Claude plan |
| ~1 min later | **Fetch image** workflow downloads the Canva export into the PR as `image.jpg` (Canva links expire within hours). | GitHub Actions (free) |
| Whenever you like | **You review the PR and merge it to approve**, or close it to skip the day. Works from the GitHub mobile app. | You |
| 9:00 AM (or at merge, if later) | **Publish to Instagram** workflow posts the image and caption, then commits `posts/<date>/published.json` with the permalink. | GitHub Actions (free) |
| Mondays | **Refresh Instagram token** workflow extends the 60-day access token. | GitHub Actions (free) |

Posting uses Meta's *Instagram API with Instagram Login*, which does **not**
need a Facebook Page — only an Instagram Business or Creator account.

Nothing is posted unless its PR was merged. Each day posts at most once.

## Setup (one time)

### 1. Instagram access token

1. Go to <https://developers.facebook.com/apps> → **Create app**. Pick the use
   case for managing messaging and content on **Instagram**, app type
   **Business**.
2. In the app, open **Instagram → API setup with Instagram login**.
3. Under **Generate access tokens**, click **Add account** and log in to the
   Mindful Harmony Instagram account. Grant the content publishing permission.
4. Click **Generate token** next to the account and copy it.

The app can stay in development mode: it only posts to your own account, which
is added to the app in step 3, so no App Review is needed. (Meta renames these
screens from time to time; the names above may differ slightly.)

### 2. Repository secrets

**Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | The token from step 1 |
| `SECRETS_PAT` | A [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) with access to **only this repository** and **Secrets: Read and write**. Lets the weekly job save the refreshed Instagram token. |

Also check **Settings → Actions → General → Workflow permissions** is set to
**Read and write permissions** (the workflows commit images and publish records).

### 3. Test without posting

**Actions → Publish to Instagram → Run workflow** with *dry run* ticked. It
checks the token and today's post but does not publish. (Before 9:00 AM ET, or
with no merged post for today, it exits early and says so.)

## Changing things

- Voice, themes, caption style, layout rules: edit `ROUTINE_PROMPT.md`.
- Posting time: change the cron lines in `.github/workflows/publish.yml` and
  `POST_HOUR` (env, default `9`). GitHub's scheduled runs can start up to
  ~15–30 minutes late at busy times.
- Skip a day: close that day's PR.
