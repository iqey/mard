/* ============================================================
   MARD — colour engine
   Reads and writes the CSS variables in mard.css. Loaded on
   every page so a saved theme applies everywhere.
   ============================================================ */

/* Safe storage: falls back to memory if the browser blocks
   localStorage (private mode, embedded previews, some school
   network filters). The site keeps working, it just forgets. */
const Store = (() => {
  let ok = true;
  try {
    localStorage.setItem("__mard", "1");
    localStorage.removeItem("__mard");
  } catch (e) { ok = false; }
  const mem = {};
  return {
    persistent: ok,
    get(k) { try { return ok ? localStorage.getItem(k) : (mem[k] ?? null); } catch (e) { return mem[k] ?? null; } },
    set(k, v) { try { ok ? localStorage.setItem(k, v) : (mem[k] = v); } catch (e) { mem[k] = v; } },
    del(k) { try { ok ? localStorage.removeItem(k) : delete mem[k]; } catch (e) { delete mem[k]; } }
  };
})();

const THEME_KEYS = [
  { v: "--bg",       name: "Background",     what: "The page behind everything" },
  { v: "--panel",    name: "Panels",         what: "Game cards and the sidebar" },
  { v: "--panel-2",  name: "Panel hover",    what: "Hover and selected states" },
  { v: "--edge",     name: "Borders",        what: "Card outlines and dividers" },
  { v: "--ink",      name: "Text",           what: "Main readable text" },
  { v: "--dim",      name: "Muted text",     what: "Labels, counts, descriptions" },
  { v: "--accent",   name: "Accent",         what: "Buttons and the selected category" },
  { v: "--accent-2", name: "Second accent",  what: "Links and confirmations" },
  { v: "--accent-3", name: "Highlight",      what: "Badges and favourites" },
  { v: "--screen",   name: "Input fields",   what: "Text boxes and empty image areas" }
];

const PRESETS = {
  "Slate": {
    "--bg": "#16181C", "--panel": "#1E2126", "--panel-2": "#262A30", "--edge": "#343941",
    "--ink": "#E6E8EB", "--dim": "#939AA4", "--accent": "#5B8DEF", "--accent-2": "#4BAE8C",
    "--accent-3": "#D9A34E", "--screen": "#101216"
  },
  "Charcoal": {
    "--bg": "#121212", "--panel": "#1B1B1B", "--panel-2": "#242424", "--edge": "#333333",
    "--ink": "#E8E8E8", "--dim": "#909090", "--accent": "#9A9A9A", "--accent-2": "#BFBFBF",
    "--accent-3": "#D0D0D0", "--screen": "#0C0C0C"
  },
  "Midnight": {
    "--bg": "#0E1420", "--panel": "#151E2E", "--panel-2": "#1D283C", "--edge": "#2A3852",
    "--ink": "#DFE7F2", "--dim": "#8394AC", "--accent": "#4C8DF6", "--accent-2": "#48B4C4",
    "--accent-3": "#C79A4B", "--screen": "#090E17"
  },
  "Forest": {
    "--bg": "#12191A", "--panel": "#192223", "--panel-2": "#212C2D", "--edge": "#2E3C3D",
    "--ink": "#E2E9E7", "--dim": "#8B9C99", "--accent": "#5EA97F", "--accent-2": "#79BFA0",
    "--accent-3": "#C9A863", "--screen": "#0C1213"
  },
  "Light": {
    "--bg": "#F4F5F7", "--panel": "#FFFFFF", "--panel-2": "#EDEFF2", "--edge": "#D6DAE0",
    "--ink": "#1C1F24", "--dim": "#6B727C", "--accent": "#2F6FE0", "--accent-2": "#1E8A66",
    "--accent-3": "#B07D18", "--screen": "#F0F1F4"
  }
};

const Theme = {
  current() {
    const saved = Store.get("mard.theme");
    if (saved) { try { return JSON.parse(saved); } catch (e) { /* fall through */ } }
    return { ...PRESETS["Marquee"] };
  },
  apply(map) {
    const root = document.documentElement;
    Object.entries(map).forEach(([k, v]) => root.style.setProperty(k, v));
  },
  save(map) {
    Store.set("mard.theme", JSON.stringify(map));
    Theme.apply(map);
  },
  reset() {
    Store.del("mard.theme");
    const root = document.documentElement;
    THEME_KEYS.forEach(k => root.style.removeProperty(k.v));
  },
  /* Read what's actually computed, so the pickers show real values
     even before anything has been customised. */
  read() {
    const cs = getComputedStyle(document.documentElement);
    const out = {};
    THEME_KEYS.forEach(k => out[k.v] = (cs.getPropertyValue(k.v) || "").trim() || "#000000");
    return out;
  }
};

// Apply saved theme immediately, before first paint where possible.
Theme.apply(Theme.current());
