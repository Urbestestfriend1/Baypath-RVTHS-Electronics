(() => {
  "use strict";

  const cfg = window.SHOP_CONFIG || {};
  const navData = window.SHOP_NAVIGATION || [];
  const pages = window.SHOP_PAGES || {};
  const projects = window.SHOP_PROJECTS || [];
  const app = document.getElementById("app");
  const topNav = document.getElementById("top-nav");
  const contextNav = document.getElementById("context-nav");
  const search = document.getElementById("site-search");
  const results = document.getElementById("search-results");
  const menuButton = document.getElementById("menu-button");
  const flatNav = flatten(navData, []);

  function flatten(items, parents) {
    return items.flatMap(item => {
      const entry = { ...item, trail: parents.concat(item.label) };
      return [entry].concat(flatten(item.children || [], entry.trail));
    });
  }
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
  const href = path => "#" + (path || "/");
  const pathNow = () => {
    const raw = location.hash.slice(1);
    if (!raw || raw === "/" || !raw.startsWith("/")) return "/";
    return raw.replace(/\/+$/, "") || "/";
  };
  const isActive = (path, link) => link === "/" ? path === "/" : path === link || path.startsWith(link + "/");
  const navItem = path => flatNav.find(item => item.path === path);
  const pageFor = path => pages[path] || null;
  const projectPath = project => "/projects/" + project.slug;
  function projectFor(path) {
    const match = path.match(/^\/projects\/([^/]+)$/);
    if (!match) return null;
    let slug = match[1];
    try { slug = decodeURIComponent(slug); } catch (_) {}
    return projects.find(project => project.slug === slug) || null;
  }
  function setTheme() {
    const theme = cfg.theme || {};
    const variables = {
      "--bg": theme.background, "--surface": theme.surface, "--raised": theme.raised,
      "--border": theme.border, "--text": theme.text, "--muted": theme.muted,
      "--dim": theme.dim, "--accent": theme.accent
    };
    Object.entries(variables).forEach(([key, value]) => {
      if (value) document.documentElement.style.setProperty(key, value);
    });
  }

  function renderTop(path) {
    const mainLinks = navData.filter(item => item.path === "/" || !item.path.includes("/", 1));
    topNav.innerHTML = mainLinks.map(item =>
      '<a href="' + href(item.path) + '"' + (isActive(path, item.path) ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>'
    ).join("");
  }

  function topSection(path) {
    if (path.startsWith("/projects")) return navData.find(item => item.path === "/projects");
    return navData.filter(item => item.path !== "/" && path.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0] || null;
  }

  function renderContext(path, project) {
    if (path === "/") { contextNav.hidden = true; contextNav.innerHTML = ""; return; }
    contextNav.hidden = false;
    let root = topSection(path);
    if (!root) { contextNav.innerHTML = ""; contextNav.hidden = true; return; }

    if (project) {
      contextNav.innerHTML = '<div class="context-inner"><span class="context-label">PROJECTS</span><a href="#/projects">All projects</a><span class="context-current">' + esc(project.title) + '</span></div>';
      return;
    }

    const items = root.children || [];
    let markup = '<div class="context-inner"><span class="context-label">' + esc(root.label) + '</span><a href="' + href(root.path) + '"' +
      (path === root.path ? ' aria-current="page"' : "") + '>Overview</a>';
    markup += items.map(item => '<a href="' + href(item.path) + '"' + (isActive(path, item.path) ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>').join("");
    markup += '</div>';

    // A selected grade gets its own compact second level, e.g. Freshman / Projects.
    const child = items.find(item => isActive(path, item.path));
    if (child && child.children && child.children.length) {
      markup += '<div class="context-inner context-inner-sub"><span class="context-label">' + esc(child.label) + '</span>' +
        '<a href="' + href(child.path) + '"' + (path === child.path ? ' aria-current="page"' : "") + '>Overview</a>' +
        child.children.map(item => '<a href="' + href(item.path) + '"' + (path === item.path ? ' aria-current="page"' : "") + '>' + esc(item.label) + '</a>').join("") +
        '</div>';
    }
    contextNav.innerHTML = markup;
  }

  function breadcrumbs(path, project) {
    if (project) return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/projects">Projects</a><span>/</span><span aria-current="page">' + esc(project.title) + '</span></nav>';
    const item = flatNav.find(entry => entry.path === path);
    if (!item) return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><span>Page</span></nav>';
    return '<nav class="crumbs" aria-label="Breadcrumb">' + item.trail.map((label, index) => {
      const entry = flatNav.find(candidate => candidate.trail.join("|") === item.trail.slice(0, index + 1).join("|"));
      return (index ? '<span>/</span>' : "") + (index === item.trail.length - 1
        ? '<span aria-current="page">' + esc(label) + '</span>'
        : '<a href="' + href(entry ? entry.path : "/") + '">' + esc(label) + '</a>');
    }).join("") + '</nav>';
  }

  function callout(data, style) {
    if (!data) return "";
    return '<aside class="callout ' + (style || "") + '"><strong>' + esc(data.title || "Note") + '</strong><p>' + esc(data.text || "") + '</p></aside>';
  }
  function sectionMarkup(sections) {
    return (sections || []).map(section => '<section class="content-section"><h2>' + esc(section.heading) + '</h2>' +
      (section.text ? '<p>' + esc(section.text) + '</p>' : "") +
      (section.bullets && section.bullets.length ? '<ul class="plain-list">' + section.bullets.map(item => '<li>' + esc(item) + '</li>').join("") + '</ul>' : "") +
      (section.image ? '<img class="section-image" src="' + esc(section.image) + '" alt="' + esc(section.imageAlt || section.heading) + '" loading="lazy">' : "") +
      '</section>').join("");
  }
  function contentCards(cards) {
    if (!cards || !cards.length) return "";
    return '<div class="content-card-grid">' + cards.map(card => {
      const inner = (card.image ? '<img src="' + esc(card.image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy">' : "") +
        '<div class="content-card-copy"><span class="mini-label">' + esc(card.tag || "REFERENCE") + '</span><h3>' + esc(card.title || "Untitled") + '</h3><p>' + esc(card.description || "") + '</p></div>';
      return card.path ? '<a class="content-card" href="' + href(card.path) + '">' + inner + '<span class="content-card-link">' + esc(card.linkLabel || "Open section") + ' →</span></a>' : '<article class="content-card">' + inner + '</article>';
    }).join("") + '</div>';
  }
  function childCards(path) {
    const item = flatNav.find(entry => entry.path === path);
    if (!item || !item.children || !item.children.length) return "";
    return contentCards(item.children.map(child => {
      const page = pages[child.path] || {};
      return { title: child.label, description: page.description || "Open this section to browse related material.", image: child.image || (child.path.includes("project") ? "assets/images/project.svg" : "assets/images/schematic.svg"), imageAlt: "", path: child.path, tag: child.children ? "SECTION" : "LIBRARY" };
    }));
  }

  function projectCard(project) {
    return '<a class="project-card" href="' + href(projectPath(project)) + '">' +
      '<div class="project-card-image"><img src="' + esc(project.featuredImage || "assets/images/project.svg") + '" alt="' + esc(project.featuredImageAlt || "") + '" loading="lazy">' +
      (project.template ? '<span class="image-label">PROJECT TEMPLATE</span>' : "") + '</div>' +
      '<div class="project-card-body"><div class="project-tags"><span>' + esc(project.grade || "Project") + '</span><span>' + esc(project.category || "Build") + '</span></div>' +
      '<h3>' + esc(project.title || "Untitled project") + '</h3><p>' + esc(project.summary || project.description || "") + '</p><span class="project-card-link">Open project <b>→</b></span></div></a>';
  }

  function renderHome() {
    const cards = (cfg.homeCards || []).map(card =>
      '<a class="shortcut" href="' + href(card.path) + '">' +
      '<img src="' + esc(card.image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy">' +
      '<span class="shortcut-copy"><small>' + esc(card.eyebrow || "EXPLORE") + '</small><strong>' + esc(card.title) + '</strong><span>' + esc(card.description) + '</span><b>' + esc(card.linkLabel || "Open") + ' →</b></span></a>'
    ).join("");
    const featured = projects.filter(project => project.featured && !project.template);
    const realProjects = projects.filter(project => !project.template);
    const mainProjects = featured.length ? featured.slice(0, 2) : realProjects.slice(0, 2);
    const projectBlock = mainProjects.length
      ? '<div class="project-grid compact-project-grid">' + mainProjects.map(projectCard).join("") + '</div>'
      : '<div class="empty-projects"><div><strong>Your project gallery starts here.</strong><p>Add a project in <code>data/projects.js</code> and it will appear here automatically.</p></div><a class="button button-outline" href="#/projects">Open project gallery →</a></div>';
    const grades = [
      { label: "Freshman", path: "/schematics/freshman" },
      { label: "Sophomore", path: "/schematics/sophomore" },
      { label: "Junior", path: "/schematics/junior" },
      { label: "Senior", path: "/schematics/senior" },
      { label: "Common", path: "/schematics/common" }
    ];
    const quickLinks = (cfg.quickLinks || []).map(link => '<a class="quick-link" href="' + href(link.path) + '"><span>' + esc(link.label) + '</span><b>→</b></a>').join("");
    return '<section class="hero-banner"><img class="hero-banner-image" src="' + esc(cfg.heroImage || "assets/images/workshop-banner.svg") + '" alt="' + esc(cfg.heroImageAlt || "Workshop") + '">' +
      '<div class="hero-banner-shade"></div><div class="hero-banner-inner"><p class="eyebrow">' + esc(cfg.heroEyebrow || cfg.schoolName || "SHOP CLASS") + '</p>' +
      '<h1>' + esc(cfg.heroTitleTop || "SHOP CLASS") + '</h1><p class="hero-subtitle">' + esc(cfg.heroTitleAccent || "Build skills. Make things.") + '</p>' +
      '<p class="hero-intro">' + esc(cfg.intro || "Projects, schematics, and shop resources.") + '</p>' +
      '<a class="button button-accent" href="#/projects">Explore projects <span>→</span></a></div></section>' +
      '<div class="home-layout"><div class="home-primary">' +
      '<section class="home-section"><div class="section-heading"><div><span class="section-index">01</span><h2>Browse the library</h2></div><p>Start with a section or go straight to a reference.</p></div>' +
      '<div class="shortcut-grid">' + cards + '</div></section>' +
      '<section class="home-section"><div class="section-heading"><div><span class="section-index">02</span><h2>Projects</h2></div><a href="#/projects" class="section-link">View all projects →</a></div>' + projectBlock + '</section></div>' +
      '<aside class="home-rail"><section class="rail-panel"><div class="rail-heading"><span>QUICK LINKS</span><b>⌁</b></div>' + quickLinks + '</section>' +
      '<section class="rail-panel"><div class="rail-heading"><span>SCHEMATICS BY GRADE</span><b>＋</b></div>' +
      grades.map((grade, index) => '<a class="grade-link" href="' + href(grade.path) + '"><span class="grade-number">0' + (index + 1) + '</span><span>' + esc(grade.label) + '</span><b>→</b></a>').join("") +
      '</section><div class="rail-note"><span class="note-mark">i</span><p>Need to update a section? Start in <code>data/</code>. The editing guide explains what to change.</p><a href="EDITING-GUIDE.md" target="_blank" rel="noopener">Open editing guide ↗</a></div></aside></div>';
  }

  function renderProjectGallery(path) {
    const ready = projects.length ? '<div class="project-grid">' + projects.map(projectCard).join("") + '</div>' :
      '<div class="empty-projects"><div><strong>No projects have been added yet.</strong><p>Copy the example object in <code>data/projects.js</code>, then replace its title, images, and details.</p></div></div>';
    return '<div class="page-shell">' + breadcrumbs(path) +
      '<header class="page-intro"><div><p class="eyebrow">PROJECT LIBRARY</p><h1>Projects</h1><p>Each project uses the same page layout, so every build is documented in a familiar way.</p></div><span class="count-label">' + projects.filter(p => !p.template).length + ' projects</span></header>' +
      ready + callout({title:"Add a project",text:"Open data/projects.js, copy the sample project object, and change its slug, description, pictures, schematic, parts, tools, and steps. No layout code needs to be changed."}) + '</div>';
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
      '<li><span class="step-number">' + String(index + 1).padStart(2, "0") + '</span><div class="step-body"><h3>' +
      esc(step.title || "Step " + (index + 1)) + '</h3><p>' + esc(step.description || "") + '</p>' +
      (step.image ? '<img src="' + esc(step.image) + '" alt="' + esc(step.imageAlt || step.title || "") + '" loading="lazy">' : "") +
      '</div></li>').join("") + '</ol>';
  }
  function projectGalleryImages(gallery) {
    if (!gallery || !gallery.length) return '<p class="muted-note">Add project photos to the gallery array in data/projects.js.</p>';
    return '<div class="photo-gallery">' + gallery.map(photo =>
      '<figure><a href="' + esc(photo.image) + '" target="_blank" rel="noopener"><img src="' + esc(photo.image) + '" alt="' + esc(photo.alt || "") + '" loading="lazy"></a>' +
      (photo.caption ? '<figcaption>' + esc(photo.caption) + '</figcaption>' : "") + '</figure>').join("") + '</div>';
  }
  function projectFiles(files) {
    if (!files || !files.length) return '<p class="muted-note">Add downloadable drawings or documents in data/projects.js.</p>';
    return '<div class="file-list">' + files.map(file =>
      '<a class="file-row" href="' + esc(file.href || "#") + '" target="_blank" rel="noopener"><span class="file-icon">↧</span>' +
      '<span class="file-copy"><strong>' + esc(file.label || "Project file") + '</strong><small>' + esc(file.description || "") + '</small></span><span class="file-arrow">↗</span></a>'
    ).join("") + '</div>';
  }

  function renderProjectDetail(project, path) {
    const image = project.featuredImage || "assets/images/project.svg";
    const schematic = project.schematicImage || "";
    return '<div class="page-shell project-page">' + breadcrumbs(path, project) +
      (project.template ? callout({title:"Project template",text:"This is the starter entry. Edit it or copy it in data/projects.js, replace the sample content and images, and change template to false when it becomes a real project."},"template-notice") : "") +
      '<header class="page-intro project-intro"><div><p class="eyebrow">' + esc(project.grade || "SHOP PROJECT") + ' / ' + esc(project.category || "BUILD") + '</p><h1>' + esc(project.title) + '</h1><p>' + esc(project.summary || "") + '</p>' +
      '<div class="project-tags"><span>' + esc(project.status || "Project") + '</span><span>' + esc(project.grade || "Grade not set") + '</span><span>' + esc(project.category || "Category not set") + '</span></div></div>' +
      '<img class="project-cover" src="' + esc(image) + '" alt="' + esc(project.featuredImageAlt || project.title) + '"></header>' +
      '<section class="detail-section"><div class="detail-heading"><span>01</span><h2>Overview</h2></div><div class="detail-copy"><p>' + esc(project.description || "Add a project overview in data/projects.js.") + '</p>' +
      ((project.objectives && project.objectives.length) ? '<h3>Goals and learning objectives</h3>' + bulletList(project.objectives) : "") + '</div></section>' +
      '<section class="detail-section"><div class="detail-heading"><span>02</span><h2>Schematic & files</h2></div><div class="detail-two-column">' +
      (schematic ? '<a class="schematic-preview" href="' + esc(schematic) + '" target="_blank" rel="noopener"><img src="' + esc(schematic) + '" alt="' + esc(project.schematicAlt || "Project schematic") + '" loading="lazy"><span>Open full-size schematic ↗</span></a>' :
      '<div class="schematic-placeholder">Add a schematicImage path in data/projects.js.</div>') +
      '<div class="detail-panel"><h3>Downloads and references</h3>' + projectFiles(project.files) + '</div></div></section>' +
      '<section class="detail-section"><div class="detail-heading"><span>03</span><h2>Materials & tools</h2></div><div class="requirements-grid">' +
      '<div class="detail-panel"><h3>Materials / parts</h3>' + bulletList(project.materials,"Add materials and quantities in data/projects.js.") + '</div>' +
      '<div class="detail-panel"><h3>Tools / equipment</h3>' + bulletList(project.tools,"Add the tools required for the build.") + '</div></div></section>' +
      '<section class="detail-section"><div class="detail-heading"><span>04</span><h2>Build steps</h2></div>' + projectSteps(project.steps) + '</section>' +
      '<section class="detail-section"><div class="detail-heading"><span>05</span><h2>Gallery</h2></div>' + projectGalleryImages(project.gallery) + '</section>' +
      (project.notes ? '<section class="detail-section"><div class="detail-heading"><span>06</span><h2>Notes</h2></div><div class="detail-copy"><p>' + esc(project.notes) + '</p></div></section>' : "") +
      '<div class="return-row"><a class="button button-outline" href="#/projects">← Back to projects</a></div></div>';
  }

  function renderPage(path) {
    if (path === "/projects") return renderProjectGallery(path);
    const page = pages[path];
    if (!page) return '<div class="page-shell">' + breadcrumbs(path) + '<header class="page-intro"><div><p class="eyebrow">404 / NOT FOUND</p><h1>Page not found</h1><p>Add this route in data/navigation.js and its content in data/pages.js.</p><a class="button button-outline" href="#/">Return home</a></div></header></div>';
    const content = sectionMarkup(page.sections) + childCards(path) + contentCards(page.cards) + callout(page.callout);
    const empty = content ? "" : '<div class="empty-state"><strong>Ready for your content.</strong><p>Add text, images, cards, or downloadable files in <code>data/pages.js</code>.</p></div>';
    return '<div class="page-shell">' + breadcrumbs(path) + '<header class="page-intro"><div><p class="eyebrow">' + esc(page.eyebrow || "SHOP CLASS LIBRARY") + '</p><h1>' +
      esc(page.title || (navItem(path) || {}).label || "Shop Class") + '</h1><p>' + esc(page.description || "") + '</p></div></header>' +
      '<div class="page-content">' + content + empty + '</div></div>';
  }

  function render() {
    const path = pathNow();
    const project = projectFor(path);
    renderTop(path);
    renderContext(path, project);
    const output = path === "/" ? renderHome() : project ? renderProjectDetail(project, path) : renderPage(path);
    app.innerHTML = '<div class="route-view">' + output + '</div>';
    app.classList.remove("is-entering");
    void app.offsetWidth;
    app.classList.add("is-entering");
    const page = pages[path];
    document.title = (project ? project.title : page ? page.title : path === "/" ? "Home" : "Shop Class") + " — " + (cfg.brand || "Shop Class");
    topNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  function searchPages(query) {
    const q = query.toLowerCase().trim();
    if (!q) { results.hidden = true; results.innerHTML = ""; return; }
    const navResults = flatNav.filter(item => {
      const page = pages[item.path] || {};
      const sectionText = (page.sections || []).map(section => (section.heading || "") + " " + (section.text || "")).join(" ");
      return (item.trail.join(" ") + " " + (page.title || "") + " " + (page.description || "") + " " + sectionText).toLowerCase().includes(q);
    }).map(item => {
      const page = pages[item.path] || {};
      return {path:item.path,title:page.title || item.label,description:page.description || item.trail.join(" / ")};
    });
    const projectResults = projects.filter(project => (project.title + " " + project.slug + " " + project.grade + " " + project.category + " " + project.summary + " " + project.description).toLowerCase().includes(q))
      .map(project => ({path:projectPath(project),title:project.title,description:project.summary || project.description || "Project page"}));
    const matches = navResults.concat(projectResults).filter((item,index,list) => list.findIndex(other => other.path === item.path) === index).slice(0,7);
    results.innerHTML = '<div class="search-results-heading">Search results</div>' + (matches.length
      ? matches.map(item => '<a href="' + href(item.path) + '"><strong>' + esc(item.title) + '</strong><small>' + esc(item.description) + '</small></a>').join("")
      : '<div class="search-empty">No results. Try “schematics”, “projects”, or “safety”.</div>');
    results.hidden = false;
  }

  setTheme();
  document.getElementById("brand-name").textContent = cfg.brand || "SHOP CLASS";
  document.getElementById("brand-tagline").textContent = cfg.tagline || "BAYPATH RVTHS";
  document.getElementById("footer-brand").textContent = cfg.brand || "SHOP CLASS";
  document.getElementById("footer-school").textContent = cfg.schoolName || "Shop Class";
  document.getElementById("footer-year").textContent = "© " + new Date().getFullYear();

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
  document.addEventListener("click", event => {
    if (!event.target.closest(".search") && !event.target.closest(".search-results")) results.hidden = true;
  });
  document.addEventListener("keydown", event => {
    if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
  });
  window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#/")) { render(); window.scrollTo(0, 0); results.hidden = true; }
  });
  render();
})();
