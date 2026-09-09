/* ============================================================
   MARD — game list
   THIS IS THE ONLY FILE YOU EDIT TO ADD GAMES.
   Add an entry, save, push. It's live in about a minute.

   Entry shape:
   {
     id:       "unique-slug",        required, no spaces
     title:    "Display Name",       required
     category: "Arcade",             required, shows in the left rail
     sub:      "Endless",            optional, becomes a filter chip
     desc:     "One line.",          optional, shows on the play page
     controls: "Arrow keys",         optional
     thumb:    "thumbs/slug.png",    optional, 4:3 looks best
     tags:     ["fast","2p"],        optional, searchable
     featured: true,                 optional, amber NEW badge
     broken:   true,                 optional, marks it as down

     ...then EXACTLY ONE of these two:
     embed: "games/slug/index.html"  loads inside MARD in an iframe
     link:  "https://example.com"    opens the real site in a new tab
   }

   Use `embed` for a game you've put in the /games folder.
   Use `link` for a game that's free on its own official site — it
   keeps working, you host nothing, and nobody can send you a
   takedown for it.
   ============================================================ */

const GAMES = [

  /* ---- Open source. Free to self-host. -------------------------
     Download each repo, drop the folder into /games/, and the
     embed path below will just work. Check each project's LICENSE
     file before you publish — most of these are MIT, which lets you
     host them as long as you keep the licence file in the folder. */

  {
    id: "hextris",
    title: "Hextris",
    category: "Puzzle",
    sub: "Fast",
    desc: "Tetris turned inside out. Blocks fall onto a spinning hexagon and you rotate it to match colours before it fills.",
    controls: "Left / right arrows to spin",
    thumb: "thumbs/hextris.png",
    tags: ["tetris", "highscore", "fast"],
    embed: "games/hextris/index.html",
    source: "https://github.com/Hextris/hextris",
    featured: true
  },
  {
    id: "2048",
    title: "2048",
    category: "Puzzle",
    sub: "Numbers",
    desc: "Slide tiles, merge matching numbers, try to reach 2048 before the board jams up.",
    controls: "Arrow keys or swipe",
    thumb: "thumbs/2048.png",
    tags: ["numbers", "chill"],
    embed: "games/2048/index.html",
    source: "https://github.com/gabrielecirulli/2048"
  },
  {
    id: "blockrain",
    title: "Blockrain",
    category: "Puzzle",
    sub: "Blocks",
    desc: "A clean browser Tetris. Has an autoplay mode if you just want to watch it cook.",
    controls: "Arrows to move, up to rotate, space to drop",
    thumb: "thumbs/blockrain.png",
    tags: ["tetris", "blocks"],
    embed: "games/blockrain/index.html",
    source: "https://github.com/Aerolab/blockrain.js"
  },
  {
    id: "clumsy-bird",
    title: "Clumsy Bird",
    category: "Arcade",
    sub: "Endless",
    desc: "Flappy Bird rebuilt in the open. One button, infinite rage.",
    controls: "Click or space to flap",
    thumb: "thumbs/clumsy-bird.png",
    tags: ["endless", "one-button", "hard"],
    embed: "games/clumsy-bird/index.html",
    source: "https://github.com/ellisonleao/clumsy-bird"
  },
  {
    id: "pacman-canvas",
    title: "Pac-Man Canvas",
    category: "Retro",
    sub: "Maze",
    desc: "An open source maze-chase built on HTML canvas. Ghosts still cheat.",
    controls: "Arrow keys",
    thumb: "thumbs/pacman-canvas.png",
    tags: ["maze", "classic"],
    embed: "games/pacman-canvas/index.html",
    source: "https://github.com/platzhersh/pacman-canvas"
  },
  {
    id: "hexgl",
    title: "HexGL",
    category: "Racing",
    sub: "Futuristic",
    desc: "A WebGL anti-gravity racer. Looks genuinely expensive for something that runs in a tab.",
    controls: "Arrow keys, shift to boost",
    thumb: "thumbs/hexgl.png",
    tags: ["3d", "fast", "racing"],
    embed: "games/hexgl/index.html",
    source: "https://github.com/BKcore/HexGL",
    featured: true
  },
  {
    id: "astray",
    title: "Astray",
    category: "Puzzle",
    sub: "Maze",
    desc: "A 3D marble maze. Tilt the floor, don't fall off, find the exit.",
    controls: "Arrow keys",
    thumb: "thumbs/astray.png",
    tags: ["3d", "maze"],
    embed: "games/astray/index.html",
    source: "https://github.com/wwwtyro/Astray"
  },
  {
    id: "space-huggers",
    title: "Space Huggers",
    category: "Shooter",
    sub: "Run and gun",
    desc: "A chaotic run-and-gun platformer with destructible levels and local co-op.",
    controls: "WASD, mouse to aim, or a gamepad",
    thumb: "thumbs/space-huggers.png",
    tags: ["co-op", "2p", "guns"],
    embed: "games/space-huggers/index.html",
    source: "https://github.com/KilledByAPixel/SpaceHuggers"
  },

  /* ---- Free on their own official site. Link out, host nothing. --- */

  {
    id: "minecraft-classic",
    title: "Minecraft Classic",
    category: "Sandbox",
    sub: "Building",
    desc: "The 2009 version, put online free by Mojang themselves. Runs on their servers, not ours.",
    controls: "WASD, mouse",
    thumb: "thumbs/minecraft-classic.png",
    tags: ["building", "sandbox", "multiplayer"],
    link: "https://classic.minecraft.net/"
  },
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    category: "Idle",
    sub: "Incremental",
    desc: "Orteil's original, on Orteil's site, so your save actually sticks.",
    controls: "Mouse",
    thumb: "thumbs/cookie-clicker.png",
    tags: ["idle", "chill", "numbers"],
    link: "https://orteil.dashnet.org/cookieclicker/"
  },
  {
    id: "a-dark-room",
    title: "A Dark Room",
    category: "Idle",
    sub: "Text",
    desc: "Starts as a single button in an empty room. Do not look anything up about it first.",
    controls: "Mouse",
    thumb: "thumbs/a-dark-room.png",
    tags: ["idle", "story", "slow burn"],
    link: "https://adarkroom.doublespeakgames.com/"
  }

  /* ---- Your turn. Copy a block above, change the fields. ----------

  ,{
    id: "my-game",
    title: "My Game",
    category: "Arcade",
    sub: "Endless",
    desc: "What it is, in one line.",
    controls: "Arrow keys",
    thumb: "thumbs/my-game.png",
    tags: ["fast"],
    embed: "games/my-game/index.html",
    featured: true
  }

  ------------------------------------------------------------------ */

];
