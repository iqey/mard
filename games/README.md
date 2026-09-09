# Self-hosted games go here

One folder per game, each with its own index.html:

    games/
      hextris/
        index.html
        LICENSE      <- keep this
      2048/
        index.html
        LICENSE

Then in assets/games.js:

    embed: "games/hextris/index.html"

Folder names are case-sensitive once the site is on GitHub Pages, even though
Windows doesn't care locally. Lowercase everything and you'll never hit it.
