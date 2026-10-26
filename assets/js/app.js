(() => {
  "use strict";
  const cfg = window.SHOP_CONFIG || {};
  const navData = window.SHOP_NAVIGATION || [];
  const pages = window.SHOP_PAGES || {};
  const app = document.getElementById("app");
  const topNav = document.getElementById("top-nav");
  const search = document.getElementById("site-search");
  const results = document.getElementById("search-results");
  const menuButton = document.getElementById("menu-button");
  const expanded = new Set();

  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  const href = path => "#" + (path || "/");
  const pathNow = () => {
    const raw = location.hash.slice(1);
    return !raw || raw === "/" ? "/" : (raw.startsWith("/") ? raw.replace(/\/$/, "") : "/" + raw);
  };
  const activePath = (current, target) => current === target || (target !== "/" && current.startsWith(target + "/"));
  const flatten = (items, trail) => items.flatMap(item => {
    const entry = Object.assign({}, item, { trail: trail.concat(item.label) });
    return [entry].concat(flatten(item.children || [], entry.trail));
  });
  const allLinks = flatten(navData, []);
  const findItem = (path, items) => {
    for (const item of (items || navData)) {
      if (item.path === path) return item;
      const nested = findItem(path, item.children || []);
      if (nested) return nested;
    }
    return null;
  };

  function renderTop(path) {
    topNav.innerHTML = navData.filter(item => item.path === "/" || !item.path.startsWith("/schematics/") && !item.path.startsWith("/resources/")).map(item =>
      '<a href="' + href(item.path) + '"' + (activePath(path, item.path) ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>'
    ).join("");
  }

  function renderTree(items, path) {
    return items.map(item => {
      const children = item.children || [];
      const hasChildren = children.length > 0;
      const opened = hasChildren && (expanded.has(item.path) || activePath(path, item.path));
      const childMarkup = hasChildren ? '<ul data-children="' + esc(item.path) + '"' + (opened ? "" : " hidden") + '>' + renderTree(children, path) + "</ul>" : "";
      return '<li data-nav-item="' + esc(item.path) + '"><div class="tree-row"><a class="tree-link" href="' + href(item.path) + '"' + (path === item.path ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>' +
        (hasChildren ? '<button class="tree-toggle" type="button" data-branch="' + esc(item.path) + '" aria-expanded="' + opened + '" aria-label="Toggle ' + esc(item.label) + '">' + (opened ? "⌄" : "›") + '</button>' : "") +
        '</div>' + childMarkup + '</li>';
    }).join("");
  }

  function sidebar(path) {
    return '<aside class="sidebar" aria-label="Section navigation"><div class="side-label">Browse library / index 01</div>' +
      '<input class="side-filter" id="side-filter" type="search" placeholder="Filter sections…" aria-label="Filter sections">' +
      '<nav aria-label="Library pages"><ul class="tree">' + renderTree(navData, path) + '</ul></nav>' +
      '<div class="sidebar-note"><strong>Keep building</strong>Add sections by updating the navigation and page data files.</div></aside>';
  }

  function breadcrumbs(path) {
    const item = findItem(path, navData);
    if (!item) return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="slash">/</span><span>Page</span></nav>';
    let built = "";
    const parts = item.trail.map((label, index) => {
      const match = allLinks.find(entry => entry.trail.join("|") === item.trail.slice(0, index + 1).join("|"));
      built = match ? match.path : built;
      return (index ? '<span class="slash">/</span>' : "") + (index === item.trail.length - 1 ? '<span aria-current="page">' + esc(label) + '</span>' : '<a href="' + href(built) + '">' + esc(label) + '</a>');
    });
    return '<nav class="crumbs" aria-label="Breadcrumb">' + parts.join("") + '</nav>';
  }

  const imageFor = path => path.includes("project") ? "assets/images/project.svg" : path.includes("resource") || path.includes("safety") || path.includes("tools") ? "assets/images/resources.svg" : "assets/images/schematic.svg";

  function sectionMarkup(sections) {
    return (sections || []).map(section =>
      '<section class="page-section"><h2>' + esc(section.heading) + '</h2>' +
      (section.text ? '<p>' + esc(section.text) + '</p>' : "") +
      (section.bullets && section.bullets.length ? '<ul>' + section.bullets.map(text => '<li>' + esc(text) + '</li>').join("") + '</ul>' : "") +
      (section.image ? '<img src="' + esc(section.image) + '" alt="' + esc(section.imageAlt || section.heading) + '" loading="lazy">' : "") +
      '</section>'
    ).join("");
  }

  function cardMarkup(cards, customClass) {
    if (!cards || !cards.length) return "";
    const three = cards.length >= 3 ? " three" : "";
    return '<section class="page-section"><div class="page-grid' + three + '">' + cards.map(card => {
      const image = card.image || "assets/images/schematic.svg";
      const inner = '<img src="' + esc(image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy"><div class="content-card-body"><span class="tag">' + esc(card.tag || "REFERENCE") + '</span><h3>' + esc(card.title || "Untitled card") + '</h3><p>' + esc(card.description || "") + '</p></div>';
      return card.path ? '<a class="content-card" href="' + href(card.path) + '">' + inner + '<div class="content-card-foot"><span>' + esc(card.linkLabel || "Open section") + '</span><span>↗</span></div></a>' : '<article class="content-card">' + inner + '</article>';
    }).join("") + '</div></section>';
  }

  function childCards(item) {
    if (!item || !item.children || !item.children.length) return "";
    const cards = item.children.map(child => {
      const page = pages[child.path] || {};
      return { title: page.cardTitle || child.label, description: page.description || "Open this section to browse its reference material.", image: child.image || imageFor(child.path), imageAlt: "", path: child.path, tag: child.children ? "SECTION" : "LIBRARY PAGE", linkLabel: "Open section" };
    });
    return cardMarkup(cards);
  }

  function callout(data) {
    return data ? '<aside class="callout"><h3>' + esc(data.title || "Note") + '</h3><p>' + esc(data.text || "") + '</p></aside>' : "";
  }

  function renderHome() {
    const cards = (cfg.homeCards || []).map(card =>
      '<a class="home-card" href="' + href(card.path) + '"><div class="card-image"><img src="' + esc(card.image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy"></div>' +
      '<div class="card-body"><span class="card-kicker">' + esc(card.eyebrow || "EXPLORE") + '</span><h3>' + esc(card.title) + '</h3><p>' + esc(card.description) + '</p><span class="text-link">' + esc(card.linkLabel || "Explore") + ' ↗</span></div></a>'
    ).join("");
    const f = cfg.feature || {};
    return '<div class="hero-area wrap"><section class="hero"><div class="hero-copy"><p class="eyebrow">' + esc(cfg.tagline || "YOUR SHOP CLASS, ORGANIZED") + '</p>' +
      '<h1>' + esc(cfg.heroTitleTop || "Build skills.") + '<br><span>' + esc(cfg.heroTitleAccent || "Make things.") + '</span></h1>' +
      '<p>' + esc(cfg.intro || "Your central shop class reference library.") + '</p><div class="actions">' +
      '<a class="button primary" href="#/schematics">Explore schematics ↗</a><a class="button secondary" href="#/projects">Browse projects →</a></div></div>' +
      '<div class="hero-visual"><img src="' + esc(cfg.heroImage || "assets/images/workshop-banner.svg") + '" alt="' + esc(cfg.heroImageAlt || "Workshop") + '"><div class="stamp">✳ &nbsp; PLAN / BUILD / REPEAT</div></div></section>' +
      '<div class="hero-meta"><span>Reference library · Project ideas · Shop resources</span><span>Built to grow</span></div></div>' +
      '<section class="section wrap"><div class="section-top"><div><p class="eyebrow">THE FIELD GUIDE</p><h2>Everything has a place.</h2></div><p>Less searching. More making. Jump straight into the part of the shop you need.</p></div><div class="home-grid">' + cards + '</div></section>' +
      '<section class="feature wrap"><div class="feature-art"><img src="' + esc(f.image || "assets/images/project.svg") + '" alt="' + esc(f.imageAlt || "Project illustration") + '" loading="lazy"></div>' +
      '<div class="feature-copy"><p class="eyebrow">' + esc(f.eyebrow || "A LIBRARY THAT GROWS") + '</p><h2>' + esc(f.title || "From first sketch to finished build.") + '</h2><p>' + esc(f.description || "") + '</p><a class="text-link" href="' + href(f.path || "/projects") + '">' + esc(f.linkLabel || "Explore projects") + ' ↗</a></div></section>';
  }

  function renderPage(path) {
    const page = pages[path];
    if (!page) return '<div class="page-layout">' + sidebar(path) + '<article><h1>Page not found</h1><p>This path needs an entry in data/pages.js.</p><a href="#/">Return home</a></article></div>';
    const item = findItem(path, navData);
    const content = sectionMarkup(page.sections) + childCards(item) + cardMarkup(page.cards) + callout(page.callout);
    const empty = content ? "" : '<div class="empty-state"><strong>Ready for your material</strong>Update this page in data/pages.js. Add text, images, downloads, or links as the content is ready.</div>';
    return '<div class="page-layout">' + sidebar(path) + '<article class="page-main">' + breadcrumbs(path) +
      '<header class="page-head"><p class="eyebrow">' + esc(page.eyebrow || "SHOP CLASS LIBRARY") + '</p><h1>' + esc(page.title || item.label) + '</h1><p>' + esc(page.description || "") + '</p></header>' + content + empty + '</article></div>';
  }

  function render() {
    const path = pathNow();
    renderTop(path);
    app.innerHTML = path === "/" ? renderHome() : renderPage(path);
    document.title = ((pages[path] || {}).title || (path === "/" ? "Home" : "Shop Class")) + " — " + (cfg.brand || "Workshop");
    topNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    bindTree();
    bindFilter();
  }

  function bindTree() {
    app.querySelectorAll("[data-branch]").forEach(button => button.addEventListener("click", () => {
      const path = button.dataset.branch;
      const list = app.querySelector('[data-children="' + CSS.escape(path) + '"]');
      const next = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(next));
      button.textContent = next ? "⌄" : "›";
      if (list) list.hidden = !next;
      if (next) expanded.add(path); else expanded.delete(path);
    }));
  }

  function bindFilter() {
    const filter = document.getElementById("side-filter");
    if (!filter) return;
    filter.addEventListener("input", () => {
      const query = filter.value.toLowerCase().trim();
      app.querySelectorAll(".tree li[data-nav-item]").forEach(row => {
        const label = row.querySelector(":scope > .tree-row .tree-link");
        const matchingChild = Array.from(row.querySelectorAll("ul .tree-link")).some(link => link.textContent.toLowerCase().includes(query));
        const match = !query || (label && label.textContent.toLowerCase().includes(query)) || matchingChild;
        row.classList.toggle("filtered-out", !match);
        if (query && match) {
          const list = row.querySelector(":scope > ul");
          const button = row.querySelector(":scope > .tree-row [data-branch]");
          if (list) list.hidden = false;
          if (button) { button.textContent = "⌄"; button.setAttribute("aria-expanded", "true"); }
        }
      });
    });
  }

  function searchPages(query) {
    const q = query.toLowerCase().trim();
    if (!q) { results.hidden = true; results.innerHTML = ""; return; }
    const matches = allLinks.filter(item => {
      const page = pages[item.path] || {};
      const body = (page.sections || []).map(section => (section.heading || "") + " " + (section.text || "")).join(" ");
      return (item.trail.join(" ") + " " + (page.title || "") + " " + (page.description || "") + " " + body).toLowerCase().includes(q);
    }).filter((item, index, arr) => arr.findIndex(match => match.path === item.path) === index).slice(0, 6);
    results.innerHTML = '<div class="side-label">Search results</div>' + (matches.length ? matches.map(item => {
      const page = pages[item.path] || {};
      return '<a href="' + href(item.path) + '"><strong>' + esc(page.title || item.label) + '</strong><small>' + esc(page.description || item.trail.join(" / ")) + '</small></a>';
    }).join("") : '<div style="padding:12px;font-size:12px;color:var(--muted)">No matches. Try “schematics”, “projects”, or “safety”.</div>');
    results.hidden = false;
  }

  document.getElementById("brand-name").textContent = cfg.brand || "WORKSHOP";
  document.getElementById("brand-tagline").textContent = cfg.tagline || "SHOP CLASS HUB";
  document.getElementById("footer-brand").innerHTML = esc(cfg.brand || "WORKSHOP") + '<span> / SHOP CLASS</span>';
  document.getElementById("footer-year").textContent = "© " + new Date().getFullYear() + " · SHOP CLASS HUB";
  menuButton.addEventListener("click", () => {
    const open = topNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  topNav.addEventListener("click", event => {
    if (event.target.closest("a")) { topNav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); }
  });
  search.addEventListener("input", () => searchPages(search.value));
  search.addEventListener("focus", () => { if (search.value.trim()) searchPages(search.value); });
  search.addEventListener("keydown", event => {
    if (event.key === "Escape") { search.value = ""; results.hidden = true; search.blur(); }
    if (event.key === "Enter" && results.querySelector("a")) location.hash = results.querySelector("a").getAttribute("href").slice(1);
  });
  document.addEventListener("click", event => { if (!event.target.closest(".search") && !event.target.closest(".search-results")) results.hidden = true; });
  document.addEventListener("keydown", event => {
    if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
  });
  window.addEventListener("hashchange", render);
  render();
})();
