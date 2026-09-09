/* ============================================================
   MARD — site settings
   Edit this file once when you set the site up.
   ============================================================ */

const CONFIG = {

  siteName: "MARD",
  tagline: "Built by Mard. Play something.",

  /* --- Where suggestions and bug reports go ------------------
     "github"    Opens a pre-filled GitHub issue. Free, no server,
                 no spam risk. Friends need a GitHub account.
     "webhook"   Posts straight to a Discord webhook or Formspree
                 endpoint. No account needed, but the URL sits in
                 your public JavaScript where anyone can read it
                 and spam that channel. Use a throwaway channel.
     "copy"      No sending. Formats the report and copies it to
                 the clipboard so they can paste it to you.
     ---------------------------------------------------------- */
  formMode: "github",

  // Needed for formMode "github". Your repo must be public with Issues on.
  githubUser: "iqey",
  githubRepo: "mard",

  // Needed for formMode "webhook".
  webhookUrl: "",

  /* Order the category rail appears in. Anything in games.js with a
     category not listed here gets appended at the end automatically. */
  categoryOrder: [
    "Arcade",
    "Platformer",
    "Puzzle",
    "Shooter",
    "Sports",
    "Racing",
    "Idle",
    "Rhythm",
    "Retro",
    "Sandbox"
  ]
};
