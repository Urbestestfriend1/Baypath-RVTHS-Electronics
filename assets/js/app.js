(() => {
  "use strict";

  const cfg = window.SHOP_CONFIG || {};
  const navData = window.SHOP_NAVIGATION || [];
  const pages = window.SHOP_PAGES || {};
  const projects = window.SHOP_PROJECTS || [];
  const app = document.getElementById("app");
  const topNav = document.getElementById("top-nav");
  const search = document.getElementById("site-search");
  const results = document.getElementById("search-results");
  const menuButton = document.getElementById("menu-button");
  const expanded = new Set();

  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
  const href = path => "#" + (path || "/");
  const pathNow = () => {
    const raw = location.hash.slice(1);
    if (!raw || raw === "/") return "/";
    return raw.startsWith("/") ? raw.replace(/\/+$/, "") : "/" + raw.replace(/\/+$/, "");
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
  const getProjectPath = project => "/projects/" + project.slug;
  const getProjectFromPath = path => {
    const match = path.match(/^\/projects\/([^/]+)$/);
    if (!match) return null;
    let slug = match[1];
    try { slug = decodeURIComponent(slug); } catch (_) {}
    return projects.find(project => project.slug === slug) || null;
  };
  const imageFor = path => path.includes("project") ? "assets/images/project.svg" :
    path.includes("resource") || path.includes("safety") || path.includes("tools") ? "assets/images/resources.svg" : "assets/images/schematic.svg";

  // All site links use hash routes. Intercept them and render immediately rather than
  // waiting for a full-page navigation or a browser refresh. pushState keeps Back/Forward working.
  function navigate(path, replace) {
    const nextUrl = href(path || "/");
    if (location.hash === nextUrl) {
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (replace) history.replaceState({ shopRoute: path }, "", nextUrl);
    else history.pushState({ shopRoute: path }, "", nextUrl);
    render();
    window.scrollTo(0, 0);
  }

  function renderTop(path) {
    topNav.innerHTML = navData
      .filter(item => item.path === "/" || (!item.path.startsWith("/schematics/") && !item.path.startsWith("/resources/")))
      .map(item => '<a href="' + href(item.path) + '"' +
        (activePath(path, item.path) ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>')
      .join("");
  }

  function renderTree(items, path) {
    return items.map(item => {
      const children = item.children || [];
      const hasChildren = children.length > 0;
      const opened = hasChildren && (expanded.has(item.path) || activePath(path, item.path));
      const childMarkup = hasChildren
        ? '<ul data-children="' + esc(item.path) + '"' + (opened ? "" : " hidden") + '>' + renderTree(children, path) + "</ul>"
        : "";
      const selected = path === item.path || (path.startsWith("/projects/") && item.path === "/projects");
      return '<li data-nav-item="' + esc(item.path) + '"><div class="tree-row">' +
        '<a class="tree-link" href="' + href(item.path) + '"' + (selected ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>' +
        (hasChildren
          ? '<button class="tree-toggle" type="button" data-branch="' + esc(item.path) + '" aria-expanded="' + opened + '" aria-label="Toggle ' + esc(item.label) + '">' + (opened ? "−" : "+") + '</button>'
          : "") +
        '</div>' + childMarkup + '</li>';
    }).join("");
  }

  function sidebar(path) {
    return '<aside class="sidebar" aria-label="Section navigation">' +
      '<div class="side-heading"><span>Site index</span><small>Browse sections</small></div>' +
      '<input class="side-filter" id="side-filter" type="search" placeholder="Filter sections…" aria-label="Filter sections">' +
      '<nav aria-label="Library pages"><ul class="tree">' + renderTree(navData, path) + '</ul></nav>' +
      '<div class="sidebar-note"><strong>Maintaining this site</strong>Content and navigation are configured in separate files in the repository.</div></aside>';
  }

  function breadcrumbs(path, project) {
    if (project) {
      return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/projects">Projects</a><span>/</span><span aria-current="page">' + esc(project.title) + '</span></nav>';
    }
    const item = findItem(path, navData);
    if (!item) return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><span>Page</span></nav>';
    const parts = item.trail.map((label, index) => {
      const entry = allLinks.find(candidate => candidate.trail.join("|") === item.trail.slice(0, index + 1).join("|"));
      const route = entry ? entry.path : "/";
      return (index ? '<span>/</span>' : "") +
        (index === item.trail.length - 1
          ? '<span aria-current="page">' + esc(label) + '</span>'
          : '<a href="' + href(route) + '">' + esc(label) + '</a>');
    });
    return '<nav class="crumbs" aria-label="Breadcrumb">' + parts.join("") + '</nav>';
  }

  function sectionMarkup(sections) {
    return (sections || []).map(section =>
      '<section class="page-section"><h2>' + esc(section.heading) + '</h2>' +
      (section.text ? '<p>' + esc(section.text) + '</p>' : "") +
      (section.bullets && section.bullets.length
        ? '<ul class="plain-list">' + section.bullets.map(text => '<li>' + esc(text) + '</li>').join("") + '</ul>' : "") +
      (section.image ? '<img src="' + esc(section.image) + '" alt="' + esc(section.imageAlt || section.heading) + '" loading="lazy">' : "") +
      '</section>'
    ).join("");
  }

  function cardMarkup(cards) {
    if (!cards || !cards.length) return "";
    return '<section class="page-section"><div class="page-grid">' + cards.map(card => {
      const image = card.image || "assets/images/schematic.svg";
      const inner = '<img src="' + esc(image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy">' +
        '<div class="content-card-body"><span class="tag">' + esc(card.tag || "REFERENCE") + '</span>' +
        '<h3>' + esc(card.title || "Untitled card") + '</h3><p>' + esc(card.description || "") + '</p></div>';
      return card.path
        ? '<a class="content-card" href="' + href(card.path) + '">' + inner +
          '<div class="content-card-foot"><span>' + esc(card.linkLabel || "Open section") + '</span><span>→</span></div></a>'
        : '<article class="content-card">' + inner + '</article>';
    }).join("") + '</div></section>';
  }

  function childCards(item) {
    if (!item || !item.children || !item.children.length) return "";
    const cards = item.children.map(child => {
      const page = pages[child.path] || {};
      return {
        title: page.cardTitle || child.label,
        description: page.description || "Open this section to browse reference material.",
        image: child.image || imageFor(child.path),
        imageAlt: "",
        path: child.path,
        tag: child.children ? "SECTION" : "LIBRARY",
        linkLabel: "Open section"
      };
    });
    return cardMarkup(cards);
  }

  function callout(data, className) {
    return data ? '<aside class="callout ' + (className || "") + '"><h3>' + esc(data.title || "Note") +
      '</h3><p>' + esc(data.text || "") + '</p></aside>' : "";
  }

  function projectCard(project) {
    const route = getProjectPath(project);
    return '<a class="project-card" href="' + href(route) + '">' +
      '<div class="project-card-image"><img src="' + esc(project.featuredImage || "assets/images/project.svg") +
      '" alt="' + esc(project.featuredImageAlt || "") + '" loading="lazy">' +
      (project.template ? '<span class="image-label">EDITABLE TEMPLATE</span>' : "") + '</div>' +
      '<div class="project-card-content"><div class="project-tags"><span>' + esc(project.grade || "Project") +
      '</span><span>' + esc(project.category || "Build") + '</span></div><h3>' + esc(project.title) +
      '</h3><p>' + esc(project.summary || project.description || "") + '</p><span class="project-card-link">View project <b>→</b></span></div></a>';
  }

  function projectGallery(path) {
    const page = pages["/projects"] || { title: "Projects", description: "" };
    const content = projects.length
      ? '<div class="project-grid">' + projects.map(projectCard).join("") + '</div>'
      : '<div class="empty-state"><strong>No projects have been added yet.</strong>Copy the example entry in data/projects.js, change the title and slug, then add its photos and schematic.</div>';
    return '<div class="page-layout">' + sidebar(path) + '<article class="page-main">' + breadcrumbs(path) +
      '<header class="page-head"><p class="eyebrow">' + esc(page.eyebrow || "PROJECT LIBRARY") + '</p><h1>' +
      esc(page.title || "Projects") + '</h1><p>' + esc(page.description || "") + '</p></header>' +
      '<div class="gallery-toolbar"><span>' + projects.length + (projects.length === 1 ? " entry" : " entries") + '</span><span>All project details use the same template</span></div>' +
      content + callout({ title: "Adding a project", text: "Open data/projects.js, copy the example project object, give it a unique slug, and replace its text and image paths. Each entry gets a page automatically." }) +
      '</article></div>';
  }

  function bulletList(items, emptyText) {
    if (!items || !items.length) return '<p class="muted-note">' + esc(emptyText || "Not added yet.") + '</p>';
    return '<ul class="detail-list">' + items.map(item => {
      if (typeof item === "string") return '<li>' + esc(item) + '</li>';
      return '<li><strong>' + esc(item.name || item.title || item.label || "") + '</strong>' +
        (item.quantity ? '<span class="detail-quantity">' + esc(item.quantity) + '</span>' : "") +
        (item.notes ? '<small>' + esc(item.notes) + '</small>' : "") +
        (item.description ? '<small>' + esc(item.description) + '</small>' : "") + '</li>';
    }).join("") + '</ul>';
  }

  function projectSteps(steps) {
    if (!steps || !steps.length) return '<p class="muted-note">Build steps have not been added yet.</p>';
    return '<ol class="steps-list">' + steps.map((step, index) =>
      '<li><span class="step-number">' + String(index + 1).padStart(2, "0") + '</span><div class="step-body">' +
      '<h3>' + esc(step.title || "Step " + (index + 1)) + '</h3><p>' + esc(step.description || "") + '</p>' +
      (step.image ? '<img src="' + esc(step.image) + '" alt="' + esc(step.imageAlt || step.title || "") + '" loading="lazy">' : "") +
      '</div></li>'
    ).join("") + '</ol>';
  }

  function projectGalleryImages(gallery) {
    if (!gallery || !gallery.length) return '<p class="muted-note">Add project photos to the gallery array in data/projects.js.</p>';
    return '<div class="photo-gallery">' + gallery.map(photo =>
      '<figure><a href="' + esc(photo.image) + '" target="_blank" rel="noopener"><img src="' + esc(photo.image) +
      '" alt="' + esc(photo.alt || "") + '" loading="lazy"></a>' +
      (photo.caption ? '<figcaption>' + esc(photo.caption) + '</figcaption>' : "") + '</figure>'
    ).join("") + '</div>';
  }

  function projectFiles(files) {
    if (!files || !files.length) return '<p class="muted-note">Add downloadable drawings or documents in data/projects.js.</p>';
    return '<div class="file-list">' + files.map(file =>
      '<a class="file-row" href="' + esc(file.href || "#") + '" target="_blank" rel="noopener">' +
      '<span class="file-icon">↧</span><span class="file-copy"><strong>' + esc(file.label || "Project file") +
      '</strong><small>' + esc(file.description || "") + '</small></span><span class="file-arrow">↗</span></a>'
    ).join("") + '</div>';
  }

  function renderProjectDetail(project, path) {
    const templateNotice = project.template
      ? callout({ title: "This is a sample template", text: "This entry demonstrates the project layout. Copy or edit it in data/projects.js, replace the placeholder text and images, and remove the template flag when you have a real project." }, "template-notice")
      : "";
    const image = project.featuredImage || "assets/images/project.svg";
    const schematic = project.schematicImage || "";
    return '<div class="page-layout">' + sidebar(path) + '<article class="page-main project-detail">' +
      breadcrumbs(path, project) + templateNotice +
      '<header class="project-title-block"><p class="eyebrow">' + esc(project.grade || "SHOP PROJECT") + ' / ' + esc(project.category || "BUILD") + '</p>' +
      '<h1>' + esc(project.title) + '</h1><p class="project-summary">' + esc(project.summary || "") + '</p>' +
      '<div class="project-tags project-tags-large"><span>' + esc(project.status || "Project") + '</span><span>' + esc(project.grade || "Grade not set") + '</span><span>' + esc(project.category || "Category not set") + '</span></div></header>' +
      '<figure class="project-hero-image"><img src="' + esc(image) + '" alt="' + esc(project.featuredImageAlt || project.title) + '"><figcaption>Project overview image — change it in data/projects.js</figcaption></figure>' +
      '<section class="detail-section"><h2>01 / Overview</h2><p>' + esc(project.description || "Add a project overview in data/projects.js.") + '</p>' +
      ((project.objectives && project.objectives.length) ? '<h3>Goals and learning objectives</h3>' + bulletList(project.objectives) : "") + '</section>' +
      '<section class="detail-section"><h2>02 / Schematic and files</h2><div class="schematic-layout">' +
      (schematic
        ? '<a class="schematic-preview" href="' + esc(schematic) + '" target="_blank" rel="noopener"><img src="' + esc(schematic) +
          '" alt="' + esc(project.schematicAlt || "Project schematic") + '" loading="lazy"><span>Open full-size schematic ↗</span></a>'
        : '<div class="schematic-placeholder">Add the schematicImage path in data/projects.js.</div>') +
      '<div class="file-panel"><h3>Downloads and references</h3>' + projectFiles(project.files) + '</div></div></section>' +
      '<section class="detail-section"><h2>03 / Materials and tools</h2><div class="requirements-grid">' +
      '<div class="detail-panel"><h3>Materials / parts</h3>' + bulletList(project.materials, "Add required material, part number, quantity, and notes in data/projects.js.") + '</div>' +
      '<div class="detail-panel"><h3>Tools / equipment</h3>' + bulletList(project.tools, "Add tools and equipment needed for the build.") + '</div></div></section>' +
      '<section class="detail-section"><h2>04 / Build steps</h2>' + projectSteps(project.steps) + '</section>' +
      '<section class="detail-section"><h2>05 / Project gallery</h2>' + projectGalleryImages(project.gallery) + '</section>' +
      (project.notes ? '<section class="detail-section"><h2>06 / Notes</h2><p>' + esc(project.notes) + '</p></section>' : "") +
      '<div class="return-row"><a class="button secondary" href="#/projects">← Back to projects</a></div>' +
      '</article></div>';
  }

  function renderHome() {
    const cards = (cfg.homeCards || []).map(card =>
      '<a class="home-card" href="' + href(card.path) + '"><div class="home-card-image"><img src="' + esc(card.image) +
      '" alt="' + esc(card.imageAlt || "") + '" loading="lazy"></div><div class="home-card-copy">' +
      '<span class="card-kicker">' + esc(card.eyebrow || "EXPLORE") + '</span><h3>' + esc(card.title) +
      '</h3><p>' + esc(card.description) + '</p><span class="text-link">' + esc(card.linkLabel || "Open section") + ' →</span></div></a>'
    ).join("");
    const featured = projects.filter(project => project.featured).slice(0, 3);
    const shownProjects = featured.length ? featured : projects.slice(0, 3);
    const projectContent = shownProjects.length
      ? '<div class="project-grid home-project-grid">' + shownProjects.map(projectCard).join("") + '</div>'
      : '<p class="muted-note">Project entries will appear here once they are added in data/projects.js.</p>';
    return '<section class="hero-banner"><img class="hero-banner-image" src="' + esc(cfg.heroImage || "assets/images/workshop-banner.svg") +
      '" alt="' + esc(cfg.heroImageAlt || "Workshop") + '"><div class="hero-banner-shade"></div>' +
      '<div class="hero-banner-inner"><p class="eyebrow">' + esc(cfg.heroEyebrow || cfg.tagline || "SHOP CLASS") + '</p>' +
      '<h1>' + esc(cfg.heroTitleTop || "SHOP CLASS") + '<span>' + esc(cfg.heroTitleAccent || "Build skills. Make things.") + '</span></h1>' +
      '<p class="hero-intro">' + esc(cfg.intro || "Your home for projects and class references.") + '</p>' +
      '<div class="actions"><a class="button primary" href="#/projects">Explore projects <span>→</span></a>' +
      '<a class="button secondary" href="#/schematics">Browse schematics</a></div></div>' +
      '<div class="hero-banner-footer"><span>PLAN / BUILD / TEST</span><span>SHOP CLASS REFERENCE LIBRARY</span></div></section>' +
      '<div class="wrap home-content"><section class="home-section"><div class="section-heading"><div><p class="eyebrow">START HERE</p><h2>Browse the site</h2></div>' +
      '<p>Find a plan, open a project, or look up a shared reference.</p></div><div class="home-grid">' + cards + '</div></section>' +
      '<section class="home-section projects-home"><div class="section-heading"><div><p class="eyebrow">PROJECT LIBRARY</p><h2>Project pages</h2></div>' +
      '<a class="text-link" href="#/projects">All projects →</a></div>' + projectContent + '</section></div>';
  }

  function renderPage(path) {
    if (path === "/projects") return projectGallery(path);
    const page = pages[path];
    if (!page) return '<div class="page-layout">' + sidebar(path) + '<article class="page-main"><header class="page-head"><p class="eyebrow">404 / NOT FOUND</p><h1>Page not found</h1><p>This path needs an entry in data/navigation.js and data/pages.js.</p></header><a class="button secondary" href="#/">Return home</a></article></div>';
    const item = findItem(path, navData);
    const content = sectionMarkup(page.sections) + childCards(item) + cardMarkup(page.cards) + callout(page.callout);
    const empty = content ? "" : '<div class="empty-state"><strong>Ready for your material</strong>Update this page in data/pages.js. Add text, images, downloads, or links as the content is ready.</div>';
    return '<div class="page-layout">' + sidebar(path) + '<article class="page-main">' + breadcrumbs(path) +
      '<header class="page-head"><p class="eyebrow">' + esc(page.eyebrow || "SHOP CLASS LIBRARY") + '</p><h1>' +
      esc(page.title || (item && item.label) || "Shop Class") + '</h1><p>' + esc(page.description || "") + '</p></header>' +
      content + empty + '</article></div>';
  }

  function render() {
    const path = pathNow();
    const project = getProjectFromPath(path);
    renderTop(path);
    app.innerHTML = path === "/" ? renderHome() : project ? renderProjectDetail(project, path) : renderPage(path);
    const currentPage = pages[path];
    document.title = (project ? project.title : currentPage ? currentPage.title : path === "/" ? "Home" : "Shop Class") + " — " + (cfg.brand || "Shop Class");
    topNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    bindTree();
    bindFilter();
  }

  function bindTree() {
    app.querySelectorAll("[data-branch]").forEach(button => button.addEventListener("click", () => {
      const path = button.dataset.branch;
      const list = Array.from(app.querySelectorAll("[data-children]")).find(node => node.dataset.children === path);
      const next = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(next));
      button.textContent = next ? "−" : "+";
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
          if (button) { button.textContent = "−"; button.setAttribute("aria-expanded", "true"); }
        }
      });
    });
  }

  function searchPages(query) {
    const q = query.toLowerCase().trim();
    if (!q) { results.hidden = true; results.innerHTML = ""; return; }
    const navMatches = allLinks.filter(item => {
      const page = pages[item.path] || {};
      const body = (page.sections || []).map(section => (section.heading || "") + " " + (section.text || "")).join(" ");
      return (item.trail.join(" ") + " " + (page.title || "") + " " + (page.description || "") + " " + body).toLowerCase().includes(q);
    }).map(item => {
      const page = pages[item.path] || {};
      return { path: item.path, title: page.title || item.label, description: page.description || item.trail.join(" / ") };
    });
    const projectMatches = projects.filter(project => (project.title + " " + project.slug + " " + project.grade + " " + project.category + " " + project.summary + " " + project.description).toLowerCase().includes(q))
      .map(project => ({ path: getProjectPath(project), title: project.title, description: project.summary || project.description || "Project page" }));
    const matches = navMatches.concat(projectMatches).filter((item, index, arr) => arr.findIndex(match => match.path === item.path) === index).slice(0, 7);
    results.innerHTML = '<div class="search-results-heading">Search results</div>' + (matches.length
      ? matches.map(item => '<a href="' + href(item.path) + '"><strong>' + esc(item.title) + '</strong><small>' + esc(item.description) + '</small></a>').join("")
      : '<div class="search-empty">No matches. Try “schematics”, “projects”, or “safety”.</div>');
    results.hidden = false;
  }

  document.getElementById("brand-name").textContent = cfg.brand || "SHOP CLASS";
  document.getElementById("brand-tagline").textContent = cfg.tagline || "BAYPATH RVTHS";
  document.getElementById("footer-brand").textContent = cfg.brand || "SHOP CLASS";
  document.getElementById("footer-year").textContent = "© " + new Date().getFullYear() + " · BAYPATH RVTHS";

  document.addEventListener("click", event => {
    const anchor = event.target.closest && event.target.closest('a[href^="#/"]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(anchor.getAttribute("href").slice(1));
  });

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
    if (event.key === "Enter" && results.querySelector("a")) navigate(results.querySelector("a").getAttribute("href").slice(1));
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".search") && !event.target.closest(".search-results")) results.hidden = true;
  });
  document.addEventListener("keydown", event => {
    if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
  });
  window.addEventListener("popstate", render);
  render();
})();
