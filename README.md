# MARD

A static arcade. No server, no database, no build step — which is why it's free
to host and there's nothing to break in from outside.

---

## Get it online (Windows, about ten minutes)

**1. Install the tools**

- [GitHub Desktop](https://desktop.github.com/) — pushes your changes with a button
- [VS Code](https://code.visualstudio.com/) — for editing files

**2. Make the repository**

Go to github.com, click **New repository**, name it `mard`, set it to **Public**,
create it. Public matters: GitHub Pages is only free on public repos, and the
suggestion form needs public Issues.

**3. Put these files in it**

Open GitHub Desktop, clone the repo, then copy this whole folder into it.
Commit and push.

**4. Turn on Pages**

In the repo on github.com: **Settings → Pages**. Under Source pick
**Deploy from a branch**, branch `main`, folder `/ (root)`. Save.

A minute later your site is at:

```
https://YOUR-USERNAME.github.io/mard/
```

**5. Set your details**

Open `assets/config.js` and change `githubUser` to your GitHub username.
Without this the suggestion and report buttons go nowhere.

---

## Editing it later

Change a file in VS Code → save → GitHub Desktop shows the change →
type a short message → **Commit to main** → **Push origin**.
Live in about a minute.

To preview before pushing, install the **Live Server** extension in VS Code,
right-click `index.html`, choose **Open with Live Server**. Opening
`index.html` by double-clicking works too, but some games won't load that way
because browsers restrict local files.

---

## Adding a game

`assets/games.js` is the only file you touch. Copy an existing block, change
the fields, save, push. That file is the whole permission system — only people
who can push to the repo can add games, and there's no login for anyone to
guess or leak.

Every entry needs **either** `embed` **or** `link`:

| | What it does | When to use it |
|---|---|---|
| `embed: "games/slug/index.html"` | Runs inside MARD in a sandboxed frame | You've put the game's folder in `/games` |
| `link: "https://..."` | Opens the real site in a new tab | The game is free on its own official site |

**Prefer `link` when you can.** You host nothing, it can't break when the
developer updates it, saves persist, and nobody can send you a takedown for it.

### Self-hosting an open source game

1. Find its GitHub repo, click **Code → Download ZIP**
2. Unzip into `mard/games/` so you get `mard/games/hextris/index.html`
3. Keep the `LICENSE` file in that folder — most permissive licences require it
4. Point the `embed` path at the game's `index.html`
5. Push

The seeded games all have a `source` field pointing at their repo. Check each
project's LICENSE before you publish it. MIT, Apache-2.0, and similar are fine
to host as long as you keep the licence file. "No licence" means you don't have
permission, even if the code is public.

### A word on the big commercial games

Bloons TD, Cut the Rope, Fireboy & Watergirl, Friday Night Funkin', Retro Bowl,
Papa's, Mario, Pokémon, Sonic — those are copyrighted commercial products.
Unblocked sites host ripped copies, which is why they get DMCA'd and disappear.
GitHub honours takedown notices and will disable Pages on a complaint; repeat
complaints close accounts. Nintendo in particular pursues Mario and Pokémon
hosts specifically.

The `link` option exists for exactly this. Several of these games have official
free web versions or itch.io pages, and linking out carries no risk at all.

### Thumbnails

Drop images in `/thumbs`, name them to match, point `thumb` at them.
4:3 at roughly 400×300 looks right. Missing images fall back to a title card,
so a broken path won't leave a hole in the grid.

---

## Suggestions and bug reports

Set `formMode` in `assets/config.js`:

**`"github"` (default)** — opens a pre-filled GitHub issue. Free, no spam
risk, everything lands in one list you already get notified about. Friends
need a GitHub account, which is free but is a step.

**`"webhook"`** — posts straight to a Discord webhook. No account needed, and
reports land in your server instantly. The catch worth knowing: the webhook URL
sits in your public JavaScript where anyone who views source can read it, and
then spam that channel. Use a channel you don't mind nuking, and be ready to
regenerate the webhook if it gets found. Don't use a webhook for a server you
care about.

**`"copy"`** — no sending. Formats the report and copies it to the clipboard so
they can paste it to you.

To mark a game as down, add `broken: true` to its entry. It gets a red badge
and a message instead of a black screen.

---

## Colours

The **Colours** tab edits all ten colour variables individually, live, with
five presets. Changes save to that person's browser only — your friends can
each have their own theme without affecting yours.

To make a theme the site-wide default: set it up in the panel, press
**Show CSS to make this the default**, and paste the block over the `:root`
section at the top of `assets/mard.css`.

---

## Files

```
index.html          the arcade
play.html           the game player
assets/games.js     THE GAME LIST — this is the one you edit
assets/config.js    your username, form settings, category order
assets/mard.css     all styling, colour defaults at the top
assets/app.js       rail, search, favourites, forms, colour panel
assets/theme.js     colour engine and storage
assets/player.js    the player page
games/              self-hosted game folders go here
thumbs/             thumbnails
```

---

## Things that will confuse you later

**A game shows a black screen.** Its folder is missing or the `embed` path is
wrong. Check that `games/slug/index.html` actually exists, and that the case
matches — GitHub Pages is case-sensitive even though Windows isn't.

**A game works locally but not once pushed.** Almost always a capital letter
in a filename, or a file you forgot to commit.

**An offsite game won't embed.** Most big sites send a header that blocks being
framed. That's deliberate on their end and can't be worked around — use `link`.

**Nothing updates after pushing.** Pages caches hard. Ctrl+F5.

**Colours and favourites reset.** Some school networks block browser storage.
The site detects this and says so on the Colours tab.
