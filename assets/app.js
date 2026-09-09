/* ============================================================
   MARD — front page logic
   ============================================================ */

const $ = sel => document.querySelector(sel);
const el = (tag, props = {}, kids = []) => {
  const n = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k === "text") n.textContent = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined && v !== false) n.setAttribute(k, v);
  });
  (Array.isArray(kids) ? kids : [kids]).forEach(c => c && n.appendChild(c));
  return n;
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- favourites ---------- */

const Favs = {
  all() { try { return JSON.parse(Store.get("mard.favs") || "[]"); } catch (e) { return []; } },
  has(id) { return Favs.all().includes(id); },
  toggle(id) {
    const list = Favs.all();
    const i = list.indexOf(id);
    i === -1 ? list.push(id) : list.splice(i, 1);
    Store.set("mard.favs", JSON.stringify(list));
    return i === -1;
  }
};

/* ---------- state ---------- */

const State = { view: "cat", category: "All", sub: null, query: "" };

function categories() {
  const found = [...new Set(GAMES.map(g => g.category).filter(Boolean))];
  const ordered = CONFIG.categoryOrder.filter(c => found.includes(c));
  return ordered.concat(found.filter(c => !ordered.includes(c)).sort());
}

function matching() {
  const q = State.query.trim().toLowerCase();
  return GAMES.filter(g => {
    if (State.view === "favs" && !Favs.has(g.id)) return false;
    if (State.view === "cat" && State.category !== "All" && g.category !== State.category) return false;
    if (State.sub && g.sub !== State.sub) return false;
    if (!q) return true;
    const hay = [g.title, g.category, g.sub, g.desc, ...(g.tags || [])].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

/* ---------- rail ---------- */

function renderRail() {
  const rail = $("#rail");
  rail.replaceChildren();

  const item = (label, active, onClick, count) =>
    el("button", { "aria-current": active ? "true" : "false", onClick }, [
      el("span", { text: label }),
      count !== undefined ? el("span", { class: "count", text: String(count) }) : null
    ]);

  rail.appendChild(el("div", { class: "rail-heading", text: "Games" }));
  rail.appendChild(item("All games", State.view === "cat" && State.category === "All",
    () => go({ view: "cat", category: "All", sub: null }), GAMES.length));
  rail.appendChild(item("Favourites", State.view === "favs",
    () => go({ view: "favs", sub: null }), Favs.all().length));

  categories().forEach(c => {
    const n = GAMES.filter(g => g.category === c).length;
    rail.appendChild(item(c, State.view === "cat" && State.category === c,
      () => go({ view: "cat", category: c, sub: null }), n));
  });

  rail.appendChild(el("hr"));
  rail.appendChild(el("div", { class: "rail-heading", text: "Say something" }));
  rail.appendChild(item("Suggest a game", State.view === "suggest", () => go({ view: "suggest" })));
  rail.appendChild(item("Report a problem", State.view === "report", () => go({ view: "report" })));
  rail.appendChild(el("hr"));
  rail.appendChild(item("Colours", State.view === "colours", () => go({ view: "colours" })));
  rail.appendChild(item("How this works", State.view === "help", () => go({ view: "help" })));
}

/* ---------- cabinets ---------- */

function cabinet(g) {
  const art = g.thumb
    ? el("img", { src: g.thumb, alt: "", loading: "lazy",
        onError: e => { e.target.replaceWith(el("span", { class: "cab-noart", text: g.title.slice(0, 14) })); } })
    : el("span", { class: "cab-noart", text: g.title.slice(0, 14) });

  const badge = g.broken
    ? el("span", { class: "badge broken", text: "DOWN" })
    : g.featured ? el("span", { class: "badge", text: "NEW" })
    : g.link ? el("span", { class: "badge offsite", text: "OFFSITE" })
    : null;

  const fav = el("button", {
    class: "cab-fav",
    "aria-pressed": Favs.has(g.id) ? "true" : "false",
    "aria-label": "Favourite " + g.title,
    title: "Favourite",
    text: "★",
    onClick: e => {
      e.stopPropagation();
      const on = Favs.toggle(g.id);
      e.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
      renderRail();
      if (State.view === "favs") render();
    }
  });

  const link = el("a", {
    class: "cab-link",
    href: g.link ? g.link : "play.html?g=" + encodeURIComponent(g.id),
    target: g.link ? "_blank" : false,
    rel: g.link ? "noopener" : false
  }, [
    el("div", { class: "cab-screen" }, art),
    el("div", { class: "cab-plate" }, [
      el("span", { class: "cab-title", text: g.title }),
      el("span", { class: "cab-meta", text: [g.category, g.sub].filter(Boolean).join(" / ") })
    ])
  ]);

  return el("div", { class: "cab" }, [badge, fav, link]);
}

function renderFloor() {
  const floor = $("#floor");
  floor.replaceChildren();

  const title = State.view === "favs" ? "Favourites"
    : State.category === "All" ? "All games" : State.category;

  const list = matching();

  floor.appendChild(el("div", { class: "floor-head" }, [
    el("h1", { text: title }),
    el("span", { class: "sub", text: list.length + (list.length === 1 ? " game" : " games") })
  ]));

  // subcategory chips for whatever's in scope
  const pool = GAMES.filter(g =>
    State.view === "favs" ? Favs.has(g.id)
      : State.category === "All" || g.category === State.category);
  const subs = [...new Set(pool.map(g => g.sub).filter(Boolean))].sort();

  if (subs.length > 1) {
    const chips = el("div", { class: "subs" });
    subs.forEach(s => chips.appendChild(el("button", {
      "aria-pressed": State.sub === s ? "true" : "false",
      text: s,
      onClick: () => go({ sub: State.sub === s ? null : s })
    })));
    floor.appendChild(chips);
  }

  if (!list.length) {
    floor.appendChild(el("div", { class: "empty" }, [
      el("strong", { text: State.query ? "Nothing matched that" : "Nothing here yet" }),
      el("span", { text: State.query
        ? "Try a shorter word, or check the suggestions tab and ask for it."
        : "Add entries to assets/games.js and they show up here." })
    ]));
    return;
  }

  const grid = el("div", { class: "cabinets" });
  list.forEach(g => grid.appendChild(cabinet(g)));
  floor.appendChild(grid);
}

/* ---------- forms ---------- */

function sendReport(kind, fields) {
  const title = kind === "suggest"
    ? "Game suggestion: " + fields.game
    : "Problem: " + (fields.game || "site");

  const body = Object.entries(fields)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => "**" + k + "**\n" + v)
    .join("\n\n");

  if (CONFIG.formMode === "github") {
    const url = "https://github.com/" + CONFIG.githubUser + "/" + CONFIG.githubRepo
      + "/issues/new?labels=" + encodeURIComponent(kind)
      + "&title=" + encodeURIComponent(title)
      + "&body=" + encodeURIComponent(body);
    window.open(url, "_blank", "noopener");
    return Promise.resolve("GitHub opened in a new tab. Press the green button there to actually send it.");
  }

  if (CONFIG.formMode === "webhook" && CONFIG.webhookUrl) {
    return fetch(CONFIG.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "**" + title + "**\n" + body })
    }).then(r => {
      if (!r.ok) throw new Error("status " + r.status);
      return "Sent. Mard will see it.";
    });
  }

  const text = title + "\n\n" + body;
  return (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
    .then(() => "Copied to your clipboard. Paste it to Mard.")
    .catch(() => { throw new Error("Couldn't copy. Select the text above and copy it yourself."); });
}

function formPanel(kind) {
  const floor = $("#floor");
  floor.replaceChildren();

  const suggest = kind === "suggest";
  const panel = el("div", { class: "panel" });

  panel.appendChild(el("h1", { text: suggest ? "Suggest a game" : "Report a problem" }));
  panel.appendChild(el("p", {
    class: "lede",
    text: suggest
      ? "Tell Mard what to add. A link to where you played it helps a lot."
      : "Game won't load, controls broken, site looks wrong — say what happened."
  }));

  const f = {};
  const field = (key, label, type, placeholder, opts) => {
    const wrap = el("div", { class: "field" });
    wrap.appendChild(el("label", { for: "f_" + key, text: label }));
    let input;
    if (type === "textarea") input = el("textarea", { id: "f_" + key, placeholder });
    else if (type === "select") {
      input = el("select", { id: "f_" + key });
      opts.forEach(o => input.appendChild(el("option", { value: o, text: o })));
    } else input = el("input", { id: "f_" + key, type: "text", placeholder });
    wrap.appendChild(input);
    panel.appendChild(wrap);
    f[key] = input;
  };

  if (suggest) {
    field("game", "Game name", "text", "Getaway Shootout");
    field("where", "Where you played it", "text", "https://...");
    field("why", "Why it should be on here", "textarea", "It's good for two players and nobody has it.");
    field("who", "Your name (optional)", "text", "so Mard knows who to blame");
  } else {
    field("game", "Which game", "text", "Leave blank if it's the whole site");
    field("what", "What's wrong", "select", null,
      ["Game won't load", "Game loads but is broken", "Controls don't work", "Site looks wrong", "Something else"]);
    field("detail", "What happened", "textarea", "I clicked it and got a black screen. Chrome on Windows.");
    field("who", "Your name (optional)", "text", "");
  }

  const status = el("div", { style: "margin-top:14px" });
  const submit = el("button", {
    class: "btn",
    text: suggest ? "Send suggestion" : "Send report",
    onClick: () => {
      const vals = {};
      Object.entries(f).forEach(([k, input]) => vals[k] = input.value);
      const required = suggest ? "game" : "detail";
      if (!vals[required].trim()) {
        status.replaceChildren(el("div", { class: "notice",
          text: suggest ? "Put a game name in first." : "Describe what happened first." }));
        return;
      }
      submit.disabled = true;
      status.replaceChildren(el("div", { class: "notice", text: "Sending..." }));
      Promise.resolve(sendReport(kind, vals))
        .then(msg => {
          status.replaceChildren(el("div", { class: "notice good", text: msg }));
          Object.values(f).forEach(i => { if (i.tagName !== "SELECT") i.value = ""; });
        })
        .catch(err => {
          status.replaceChildren(el("div", { class: "notice",
            text: "Didn't send: " + err.message + " Tell Mard directly instead." }));
        })
        .finally(() => { submit.disabled = false; });
    }
  });

  panel.appendChild(el("div", { class: "btn-row" }, submit));
  panel.appendChild(status);

  if (CONFIG.formMode === "github" && CONFIG.githubUser === "YOUR-GITHUB-USERNAME") {
    panel.appendChild(el("div", { class: "notice",
      text: "Setup note for Mard: put your GitHub username in assets/config.js or this button goes nowhere." }));
  }

  floor.appendChild(panel);
}

/* ---------- colour panel ---------- */

function coloursPanel() {
  const floor = $("#floor");
  floor.replaceChildren();

  const panel = el("div", { class: "panel" });
  panel.appendChild(el("h1", { text: "Colours" }));
  panel.appendChild(el("p", { class: "lede",
    text: "Change any colour on the site. It updates as you drag and saves to this browser only — everyone picks their own." }));

  const presetRow = el("div", { class: "presets" });
  Object.entries(PRESETS).forEach(([name, map]) => {
    const dots = el("div", { class: "dots" });
    ["--accent", "--accent-2", "--accent-3", "--bg"].forEach(k =>
      dots.appendChild(el("i", { style: "background:" + map[k] })));
    presetRow.appendChild(el("button", {
      class: "preset",
      onClick: () => { Theme.save({ ...map }); coloursPanel(); }
    }, [dots, el("span", { text: name })]));
  });
  panel.appendChild(presetRow);

  const live = Theme.read();
  const swatches = el("div", { class: "swatches" });

  THEME_KEYS.forEach(k => {
    const hex = toHex(live[k.v]);
    const picker = el("input", { type: "color", value: hex, "aria-label": k.name });
    const text = el("input", { type: "text", value: hex, spellcheck: "false", "aria-label": k.name + " hex code" });

    const push = v => {
      const map = { ...Theme.read(), [k.v]: v };
      Theme.save(map);
    };
    picker.addEventListener("input", e => { text.value = e.target.value; push(e.target.value); });
    text.addEventListener("change", e => {
      const v = e.target.value.trim();
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) { picker.value = v; push(v); }
      else e.target.value = picker.value;
    });

    swatches.appendChild(el("div", { class: "swatch" }, [
      picker,
      el("div", {}, [el("div", { class: "name", text: k.name }), el("div", { class: "what", text: k.what })]),
      text
    ]));
  });
  panel.appendChild(swatches);

  const out = el("pre", { class: "export" });
  const showExport = () => {
    const map = Theme.read();
    out.textContent = ":root {\n" +
      THEME_KEYS.map(k => "  " + k.v + ": " + toHex(map[k.v]) + ";").join("\n") + "\n}";
  };

  panel.appendChild(el("div", { class: "btn-row", style: "margin:22px 0 12px" }, [
    el("button", { class: "btn ghost", text: "Reset to default", onClick: () => { Theme.reset(); coloursPanel(); } }),
    el("button", { class: "btn ghost", text: "Show CSS to make this the default", onClick: showExport })
  ]));
  panel.appendChild(out);
  panel.appendChild(el("p", { class: "lede", style: "margin-top:10px",
    text: "That block replaces the :root section at the top of assets/mard.css if you want it to be everyone's default." }));

  if (!Store.persistent) {
    panel.appendChild(el("div", { class: "notice",
      text: "This browser is blocking saved settings, so colours and favourites reset when you reload." }));
  }

  floor.appendChild(panel);
}

function toHex(v) {
  v = (v || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + v.slice(1).split("").map(c => c + c).join("").toLowerCase();
  const m = v.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const [r, g, b] = m[1].split(",").map(n => Math.max(0, Math.min(255, parseInt(n, 10) || 0)));
    return "#" + [r, g, b].map(n => n.toString(16).padStart(2, "0")).join("");
  }
  return "#000000";
}

/* ---------- help ---------- */

function helpPanel() {
  const floor = $("#floor");
  floor.replaceChildren();
  const p = el("div", { class: "panel" });
  p.appendChild(el("h1", { text: "How this works" }));
  p.appendChild(el("div", { html: `
    <p class="lede">MARD is a static site. There's no account system and no server — which is why it's
    free to run and impossible to break from the outside.</p>
    <p style="line-height:1.7"><strong>Adding games</strong> is Mard's job only. The game list lives in one file
    in the repository, and changing it means pushing a commit. Nobody else can touch it, and there's no
    login to leak.</p>
    <p style="line-height:1.7"><strong>Favourites and colours</strong> are stored in your own browser. Your
    theme is yours; it doesn't change what anyone else sees.</p>
    <p style="line-height:1.7"><strong>Games marked OFFSITE</strong> open on the original developer's site in a
    new tab. They run there, not here.</p>
    <p style="line-height:1.7">Want something added? Use the suggestions tab.</p>
  ` }));
  floor.appendChild(p);
}

/* ---------- routing ---------- */

function go(patch) {
  Object.assign(State, patch);
  const h = State.view === "cat"
    ? (State.category === "All" ? "#/all" : "#/cat/" + encodeURIComponent(State.category))
    : "#/" + State.view;
  if (location.hash !== h) history.replaceState(null, "", h);
  render();
}

function fromHash() {
  const h = decodeURIComponent(location.hash.replace(/^#\//, ""));
  if (h.startsWith("cat/")) { State.view = "cat"; State.category = h.slice(4); }
  else if (["favs", "suggest", "report", "colours", "help"].includes(h)) State.view = h;
  else { State.view = "cat"; State.category = "All"; }
}

function render() {
  renderRail();
  if (State.view === "suggest") return formPanel("suggest");
  if (State.view === "report") return formPanel("report");
  if (State.view === "colours") return coloursPanel();
  if (State.view === "help") return helpPanel();
  renderFloor();
}

/* ---------- boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  $("#site-name").textContent = CONFIG.siteName;
  $("#tagline").textContent = CONFIG.tagline;
  document.title = CONFIG.siteName + " — arcade";

  const search = $("#search");
  search.addEventListener("input", e => {
    State.query = e.target.value;
    if (["suggest", "report", "colours", "help"].includes(State.view)) {
      State.view = "cat"; State.category = "All";
    }
    render();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if (e.key === "Escape" && document.activeElement === search) { search.value = ""; State.query = ""; render(); }
  });

  window.addEventListener("hashchange", () => { fromHash(); render(); });

  fromHash();
  render();

});
