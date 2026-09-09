/* ============================================================
   MARD — player page
   ============================================================ */

(function () {
  const stage = document.getElementById("stage");
  const nameEl = document.getElementById("name");
  const whyEl = document.getElementById("why");
  const fullBtn = document.getElementById("full");

  const id = new URLSearchParams(location.search).get("g");
  const game = GAMES.find(g => g.id === id);

  const message = (heading, lines, actions) => {
    const wrap = document.createElement("div");
    wrap.className = "stage-msg";
    const h = document.createElement("h2");
    h.textContent = heading;
    wrap.appendChild(h);
    lines.forEach(t => {
      const p = document.createElement("p");
      p.style.margin = "0";
      p.style.maxWidth = "48ch";
      p.textContent = t;
      wrap.appendChild(p);
    });
    if (actions) {
      const row = document.createElement("div");
      row.className = "btn-row";
      row.style.justifyContent = "center";
      row.style.marginTop = "6px";
      actions.forEach(a => {
        const link = document.createElement("a");
        link.className = "btn" + (a.ghost ? " ghost" : "");
        link.href = a.href;
        link.textContent = a.label;
        if (a.blank) { link.target = "_blank"; link.rel = "noopener"; }
        link.style.textDecoration = "none";
        row.appendChild(link);
      });
      wrap.appendChild(row);
    }
    stage.replaceChildren(wrap);
  };

  if (!game) {
    document.title = "MARD";
    nameEl.textContent = "Game not found";
    fullBtn.style.display = "none";
    message("That game isn't on the list", [
      "The link might be old, or the entry was removed from games.js."
    ], [{ label: "Back to arcade", href: "index.html" }]);
    return;
  }

  document.title = game.title + " — " + CONFIG.siteName;
  nameEl.textContent = game.title;
  whyEl.textContent = game.controls ? game.controls : "";

  if (game.broken) {
    fullBtn.style.display = "none";
    message("This one's down", [
      game.title + " is marked as broken. Mard knows.",
      "If you have a working link for it, send it through the suggestions tab."
    ], [
      { label: "Back to arcade", href: "index.html", ghost: true },
      { label: "Suggest a fix", href: "index.html#/suggest" }
    ]);
    return;
  }

  if (game.link) {
    fullBtn.style.display = "none";
    message("This one runs on its own site", [
      game.title + " is free to play where the people who made it host it. Opening it there means it stays updated and your save sticks."
    ], [
      { label: "Open " + game.title, href: game.link, blank: true },
      { label: "Back to arcade", href: "index.html", ghost: true }
    ]);
    return;
  }

  const bezel = document.createElement("div");
  bezel.className = "bezel";

  const frame = document.createElement("iframe");
  frame.src = game.embed;
  frame.title = game.title;
  frame.allow = "fullscreen; gamepad; autoplay";
  frame.setAttribute("allowfullscreen", "");
  // Sandbox keeps a dodgy game file from redirecting the whole tab or
  // reading anything of yours. Loosen it only if a game genuinely needs more.
  frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-pointer-lock allow-popups");

  let loaded = false;
  frame.addEventListener("load", () => { loaded = true; });

  bezel.appendChild(frame);
  stage.replaceChildren(bezel);

  // If nothing has loaded after a few seconds, say so instead of a black void.
  setTimeout(() => {
    if (!loaded) {
      const hint = document.createElement("div");
      hint.className = "notice";
      hint.style.position = "absolute";
      hint.style.left = "16px";
      hint.style.right = "16px";
      hint.style.bottom = "16px";
      hint.style.background = "var(--panel)";
      hint.textContent = "Still loading. If it stays black, the game folder is probably missing from /games — report it and Mard will fix the path.";
      stage.style.position = "relative";
      stage.appendChild(hint);
    }
  }, 6000);

  fullBtn.addEventListener("click", () => {
    const target = bezel;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (target.requestFullscreen) target.requestFullscreen();
  });
})();
