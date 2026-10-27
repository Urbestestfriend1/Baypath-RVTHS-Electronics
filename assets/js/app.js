(() => {
  "use strict";

  const cfg = window.SHOP_CONFIG || {};
  const navData = window.SHOP_NAVIGATION || [];
  const pages = window.SHOP_PAGES || {};
  const projects = window.SHOP_PROJECTS || [];
  const spotlights = window.SHOP_SPOTLIGHTS || [];
  const baseProjects = projects.map(item => ({ ...item }));
  const baseSpotlights = spotlights.map(item => ({ ...item }));
  const basePages = { ...pages };
  let siteContent = [];
  let siteContentLoading = true;
  let siteContentError = "";
  let contentEditorOpen = false;
  let contentEditorType = "spotlight";
  let contentEditorRecord = null;
  let contentEditorMessage = "";
  let inventory = [];
  const supabaseConfig = window.BAYPATH_SUPABASE_CONFIG || {};
  let supabaseClient = null;
  let signedInUser = null;
  let currentProfile = null;
  let currentRole = null;
  let databaseInventoryLoaded = false;
  let inventoryLoading = true;
  let inventoryLoadError = "";
  let accountMessage = "";
  let accountMessageKind = "info";
  let adminUsers = [];
  let adminUsersLoading = false;
  let adminUsersError = "";
  let supabaseInitError = "";
  const inventoryState = { query: "", category: "all", area: "all", stock: "all", sortBy: "name", sortDir: "asc", page: 1, pageSize: 50 };
  const app = document.getElementById("app");
  const topNav = document.getElementById("top-nav");
  const contextNav = document.getElementById("context-nav");
  const search = document.getElementById("site-search");
  const results = document.getElementById("search-results");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleLabel = document.getElementById("theme-toggle-label");
  const menuButton = document.getElementById("menu-button");
  const sidebar = document.getElementById("site-sidebar");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const sidebarClose = document.getElementById("sidebar-close");
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
  let authFlow = (() => {
    const requested = new URLSearchParams(location.search).get("auth");
    const fragment = location.hash.slice(1);
    if (requested === "invite" || /(?:^|&)type=invite(?:&|$)/.test(fragment)) return "invite";
    if (requested === "recovery" || /(?:^|&)type=recovery(?:&|$)/.test(fragment)) return "recovery";
    return "";
  })();
  const pathNow = () => {
    if (authFlow) return "/account";
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
  const spotlightPath = spotlight => "/spotlights/" + spotlight.slug;
  function spotlightFor(path) {
    const match = path.match(/^\/spotlights\/([^/]+)$/);
    if (!match) return null;
    let slug = match[1];
    try { slug = decodeURIComponent(slug); } catch (_) {}
    return spotlights.find(item => item.slug === slug && item.published === true) || null;
  }
  function publishedSpotlights() {
    return spotlights.filter(item => item.published === true && item.slug && item.title);
  }
  function youtubeEmbed(videoId, title) {
    const id = String(videoId || "").trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return "";
    return '<section class="spotlight-block spotlight-video-block"><div class="spotlight-block-heading"><p class="section-overline">VIDEO</p><h2>Watch the creation</h2></div>' +
      '<div class="spotlight-video"><iframe src="https://www.youtube-nocookie.com/embed/' + id + '" title="' + esc(title || "Creator spotlight video") + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></section>';
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

  const colorModeKey = "baypath-electronics-color-mode";
  function savedColorMode() {
    try {
      return window.localStorage.getItem(colorModeKey) === "dark" ? "dark" : "light";
    } catch (_) {
      return "light";
    }
  }
  function applyColorMode(mode, persist) {
    const selected = mode === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selected;
    document.body.dataset.theme = selected;
    document.documentElement.style.colorScheme = selected;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", selected === "dark" ? "#101318" : "#f3f5f7");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(selected === "dark"));
      themeToggle.setAttribute("aria-label", "Toggle dark mode");
      themeToggle.title = selected === "dark" ? "Dark mode is on. Select to use light mode." : "Dark mode is off. Select to use dark mode.";
    }
    if (themeToggleLabel) themeToggleLabel.textContent = selected === "dark" ? "Dark mode: On" : "Dark mode";
    if (persist) {
      try { window.localStorage.setItem(colorModeKey, selected); } catch (_) {}
    }
  }

  function renderTop(path) {
    const mainLinks = navData.filter(item => item.path === "/" || !item.path.includes("/", 1));
    topNav.innerHTML = mainLinks.map(item =>
      '<a href="' + href(item.path) + '"' + (isActive(path, item.path) ? ' aria-current="page"' : "") + '>' +
      '<span class="nav-icon" aria-hidden="true">' + esc(item.icon || "•") + '</span><span class="nav-link-label">' + esc(item.label) + '</span>' +
      (item.path === "/inventory" ? '<span class="nav-count">' + inventory.length + '</span>' : '') +
      (item.path === "/projects" ? '<span class="nav-arrow">↗</span>' : '') + '</a>'
    ).join("");
  }

  function topSection(path) {
    if (path.startsWith("/projects")) return navData.find(item => item.path === "/projects");
    return navData.filter(item => item.path !== "/" && path.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0] || null;
  }

  function renderContext(path, project, spotlight) {
    if (path === "/") { contextNav.hidden = true; contextNav.innerHTML = ""; return; }
    contextNav.hidden = false;
    let root = topSection(path);
    if (!root) { contextNav.innerHTML = ""; contextNav.hidden = true; return; }

    if (spotlight) {
      contextNav.innerHTML = '<div class="context-inner"><span class="context-label">SPOTLIGHTS</span><a href="#/spotlights">All spotlights</a><span class="context-current">' + esc(spotlight.title) + '</span></div>';
      return;
    }
    if (project) {
      contextNav.innerHTML = '<div class="context-inner"><span class="context-label">PROJECTS</span><a href="#/projects">All projects</a><span class="context-current">' + esc(project.title) + '</span></div>';
      return;
    }

    const items = root.children || [];
    if (!items.length) { contextNav.hidden = true; contextNav.innerHTML = ""; return; }
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
      return { title: child.label, description: page.description || "Open this section to browse related material.", image: child.image || (child.path.includes("project") ? "assets/images/project.png" : "assets/images/schematic.png"), imageAlt: "", path: child.path, tag: child.children ? "SECTION" : "LIBRARY" };
    }));
  }

  function projectCard(project) {
    return '<a class="project-card" href="' + href(projectPath(project)) + '">' +
      '<div class="project-card-image"><img src="' + esc(project.featuredImage || "assets/images/project.png") + '" alt="' + esc(project.featuredImageAlt || "") + '" loading="lazy">' +
      (project.template ? '<span class="image-label">PROJECT TEMPLATE</span>' : "") + '</div>' +
      '<div class="project-card-body"><div class="project-tags"><span>' + esc(project.grade || "Project") + '</span><span>' + esc(project.category || "Build") + '</span></div>' +
      '<h3>' + esc(project.title || "Untitled project") + '</h3><p>' + esc(project.summary || project.description || "") + '</p><span class="project-card-link">Open project <b>→</b></span></div></a>';
  }

  function renderHome() {
    const exampleInventory = inventory.length && inventory.every(item => item.recordType === "example");
    const inventoryDescription = exampleInventory
      ? "A demonstration catalog showing how part numbers, categories, cabinet paths, minimum quantities, and notes can be organized. Replace the examples with verified shop records before using any quantities as a stock count."
      : "Search the shop catalog by part number, name, category, storage area, quantity, or notes. Filter the full list instead of paging through one enormous document.";
    const cards = (cfg.homeCards || []).map((card, index) =>
      '<a class="library-card library-card-' + (index + 1) + '" href="' + href(card.path) + '">' +
      '<div class="library-card-art"><img src="' + esc(card.image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy"><span class="library-card-index">' + String(index + 1).padStart(2, "0") + '</span></div>' +
      '<div class="library-card-copy"><span class="library-card-eyebrow">' + esc(card.eyebrow || "LIBRARY") + '</span><h3>' + esc(card.title) + '</h3><p>' + esc(card.path === "/inventory" ? inventoryDescription : card.description || "") + '</p><span class="library-card-link">' + esc(card.linkLabel || "Open section") + '<b>↗</b></span></div></a>'
    ).join("");
    const liveSpotlights = publishedSpotlights();
    const spotlightPool = liveSpotlights.filter(item => item.featured);
    const weeklyPool = spotlightPool.length ? spotlightPool : liveSpotlights;
    const now = new Date();
    const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const weekStart = utcMidnight - ((new Date(utcMidnight).getUTCDay() + 6) % 7) * 86400000;
    const weekIndex = Math.floor(weekStart / (7 * 86400000));
    const weeklySpotlight = weeklyPool.length
      ? weeklyPool[((weekIndex % weeklyPool.length) + weeklyPool.length) % weeklyPool.length]
      : null;
    const weeklyFeatureBanner = weeklySpotlight
      ? '<section class="weekly-spotlight" aria-labelledby="weekly-spotlight-title">' +
        '<a class="weekly-spotlight-image" href="' + href(spotlightPath(weeklySpotlight)) + '" aria-label="View spotlight: ' + esc(weeklySpotlight.title) + '">' +
        '<img src="' + esc(weeklySpotlight.featuredImage || "assets/images/workshop-banner.png") + '" alt="' + esc(weeklySpotlight.featuredImageAlt || weeklySpotlight.title) + '">' +
        '<span class="weekly-spotlight-image-label">CREATOR SPOTLIGHT / THIS WEEK</span></a>' +
        '<div class="weekly-spotlight-copy"><p class="section-overline">FEATURED CREATION THIS WEEK</p>' +
        '<h2 id="weekly-spotlight-title">' + esc(weeklySpotlight.title) + '</h2>' +
        '<p class="weekly-spotlight-byline">Created by <strong>' + esc(weeklySpotlight.creatorName || "Contributor credit pending") + '</strong>' +
        (weeklySpotlight.classYear ? ' <span>· ' + esc(weeklySpotlight.classYear) + '</span>' : '') + '</p>' +
        '<p class="weekly-spotlight-description">' + esc(weeklySpotlight.summary || "") + '</p>' +
        '<a class="text-link weekly-spotlight-link" href="' + href(spotlightPath(weeklySpotlight)) + '">See the creation, story and media <span>↗</span></a></div></section>'
      : '<section class="weekly-spotlight weekly-spotlight-empty" aria-labelledby="weekly-spotlight-title">' +
        '<div class="weekly-spotlight-empty-image"><img src="assets/images/workshop-banner.png" alt="Illustration of an electronics workshop bench">' +
        '<span class="weekly-spotlight-image-label">CREATOR SPOTLIGHT</span></div>' +
        '<div class="weekly-spotlight-copy"><p class="section-overline">FEATURED CREATION THIS WEEK</p>' +
        '<h2 id="weekly-spotlight-title">The next spotlight is being prepared.</h2>' +
        '<p class="weekly-spotlight-description">This space is reserved for a real student creation or technical contribution, with creator credit, the story behind it, notable details, photos, and an optional video. No how-to steps—just the work and why it matters.</p>' +
        '<a class="text-link weekly-spotlight-link" href="#/spotlights">Explore creator spotlights <span>↗</span></a></div></section>';
    const featured = projects.filter(project => project.featured && !project.template);
    const displayProjects = (featured.length ? featured : projects.filter(project => !project.template)).slice(0, 2);
    const featuredCards = displayProjects.length
      ? '<div class="featured-projects">' + displayProjects.map(projectCard).join("") + '</div>'
      : '<div class="empty-projects"><strong>The project shelf is ready for your first build.</strong><p>Add a project object in data/projects.js to give each build a home for its design, parts, instructions, and test results.</p></div>';
    const exampleCount = inventory.length.toLocaleString("en-US");
    const categoryCount = [...new Set(inventory.map(item => item.category).filter(Boolean))].length;
    return '<div class="page-shell dashboard-page">' +
      '<header class="dashboard-hero"><div class="dashboard-hero-copy"><p class="eyebrow">BAYPATH RVTHS / ELECTRONICS WORKSPACE</p>' +
      '<h1>A better place to <span>plan, build, and find things.</span></h1>' +
      '<p class="dashboard-lede">Your shop reference, organized around the work itself. Explore circuit drawings, follow projects from the first idea to final test, and find components by part number or storage location without digging through one long document. The goal is simple: make the information useful at the bench, easy to maintain, and clear enough for someone else to follow.</p>' +
      '<div class="dashboard-actions"><a class="button button-accent" href="#/inventory"><span class="button-icon">⌕</span> Find a part <span class="button-end">↗</span></a><a class="button button-outline" href="#/projects">Explore projects <span class="button-end">↗</span></a></div>' +
      '</div><div class="dashboard-hero-side"><div class="hero-side-top"><span class="hero-status-dot"></span><span>SHOP REFERENCE / 01</span></div>' +
      '<div class="hero-side-diagram"><img src="assets/images/schematic.png" alt="" loading="lazy"></div>' +
      '<div class="hero-side-bottom"><span>LOOK IT UP</span><span>BUILD IT RIGHT</span><span>CHECK THE RESULT</span></div></div></header>' +
      weeklyFeatureBanner + '<section class="dashboard-metrics" aria-label="Library overview">' +
      '<div class="metric-card"><span class="metric-icon">◇</span><span class="metric-label">PROJECT LIBRARY</span><strong>' + projects.filter(p => !p.template).length.toString().padStart(2,"0") + '</strong><small>Reference builds and notes</small></div>' +
      '<div class="metric-card"><span class="metric-icon">▤</span><span class="metric-label">REFERENCE SECTIONS</span><strong>' + flatNav.filter(item => item.path !== "/" && item.path !== "/projects" && item.path !== "/inventory").length.toString().padStart(2,"0") + '</strong><small>Drawings, resources, and class pages</small></div>' +
      '<div class="metric-card metric-card-inventory"><span class="metric-icon">▦</span><span class="metric-label">INVENTORY CATALOG</span><strong>' + exampleCount.padStart(2,"0") + '</strong><small>' + (exampleInventory ? "Demonstration rows — not verified stock" : "Catalog line items") + '</small></div>' +
      '<div class="metric-card"><span class="metric-icon">⌁</span><span class="metric-label">PART CATEGORIES</span><strong>' + categoryCount.toString().padStart(2,"0") + '</strong><small>' + (exampleInventory ? "Example categories" : "Ways to narrow the catalog") + '</small></div>' +
      '</section>' +
      '<section class="dashboard-section"><div class="dashboard-section-heading"><div><p class="section-overline">THE REFERENCE LIBRARY</p><h2>Go straight to what you need.</h2><p>Each section has a clear job. Drawings stay separate from assembly instructions, and inventory records stay separate from project write-ups.</p></div><span class="section-side-label">LIBRARY INDEX / 01</span></div>' +
      '<div class="library-grid">' + cards + '</div></section>' +
      '<section class="dashboard-section dashboard-project-section"><div class="dashboard-section-heading"><div><p class="section-overline">PROJECT GUIDES & REFERENCE BUILDS</p><h2>Guides for learning and building.</h2><p>These pages are separate from Creator Spotlights: use them when you need circuit drawings, parts lists, assembly steps, and troubleshooting guidance.</p></div><a href="#/projects" class="text-link">View all projects ↗</a></div>' +
      featuredCards + '</section>' +
      '<section class="workflow-strip"><div class="workflow-strip-heading"><span class="workflow-chip">WORKFLOW</span><h2>From question to working build.</h2></div>' +
      '<div class="workflow-strip-steps"><div><span>01</span><strong>Look it up</strong><p>Find the drawing, component, or class resource before work begins.</p></div><div><span>02</span><strong>Plan the work</strong><p>Review part ratings, connections, tools, and the expected result.</p></div><div><span>03</span><strong>Build in order</strong><p>Follow the numbered instructions and the checks attached to each step.</p></div><div><span>04</span><strong>Verify</strong><p>Test the result, compare it to the plan, and note what needs to change.</p></div></div></section>' +
      '<aside class="dashboard-note"><span class="note-mark">i</span><div><strong>Keep the catalog useful</strong><p>The inventory table is built for bulk browsing, but its quantities and storage locations only become dependable when real stock is counted and the records are kept current.</p></div><a href="#/inventory">Open inventory ↗</a></aside>' +
      '</div>';
  }

  function inventoryLocation(item) {
    const l=item.location||{};
    return [l.area,l.cabinet,l.shelf,l.bin].filter(Boolean).join(" / ")||"Location not entered";
  }
  function inventoryArea(item){return (item.location&&item.location.area)||"Location not entered";}
  function inventoryStock(item){
    if(item.quantity==null||item.quantity==="")return {key:"unknown",label:"Count needed"};
    const q=Number(item.quantity);
    if(!Number.isFinite(q))return {key:"unknown",label:"Count needed"};
    if(q<=0)return {key:"out",label:"Out of stock"};
    if(item.minimumQuantity!=null&&Number(item.minimumQuantity)>0&&q<=Number(item.minimumQuantity))return {key:"low",label:"Low stock"};
    return {key:"in",label:"In stock"};
  }
  function inventoryCategories(){return [...new Set(inventory.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));}
  function inventoryAreas(){return [...new Set(inventory.map(inventoryArea))].sort((a,b)=>a.localeCompare(b));}
  function optionList(values,current,allLabel){
    return '<option value="all"'+(current==="all"?" selected":"")+'>'+esc(allLabel)+'</option>'+
      values.map(value=>'<option value="'+esc(value)+'"'+(current===value?" selected":"")+'>'+esc(value)+'</option>').join("");
  }
  function inventoryMatches(){
    const q=inventoryState.query.trim().toLowerCase();
    return inventory.filter(item=>{
      const loc=item.location||{},status=inventoryStock(item);
      const haystack=[item.id,item.partNumber,item.name,item.manufacturer,item.category,item.description,
        inventoryLocation(item),loc.area,loc.cabinet,loc.shelf,loc.bin,item.quantity,item.unit,item.minimumQuantity,
        item.condition,item.supplier,item.notes,item.datasheet,item.updatedAt,...(item.tags||[])].join(" ").toLowerCase();
      return (!q||haystack.includes(q)) &&
        (inventoryState.category==="all"||item.category===inventoryState.category) &&
        (inventoryState.area==="all"||inventoryArea(item)===inventoryState.area) &&
        (inventoryState.stock==="all"||status.key===inventoryState.stock);
    }).sort((a,b)=>{
      const key=inventoryState.sortBy;let av,bv;
      if(key==="location"){av=inventoryLocation(a);bv=inventoryLocation(b);}
      else if(key==="status"){av=inventoryStock(a).label;bv=inventoryStock(b).label;}
      else if(key==="quantity"){av=a.quantity==null?-1:Number(a.quantity);bv=b.quantity==null?-1:Number(b.quantity);}
      else{av=a[key]==null?"":a[key];bv=b[key]==null?"":b[key];}
      const cmp=typeof av==="number"&&typeof bv==="number"?av-bv:String(av).localeCompare(String(bv),undefined,{numeric:true,sensitivity:"base"});
      return (inventoryState.sortDir==="desc"?-cmp:cmp)||String(a.id).localeCompare(String(b.id));
    });
  }

  function isVerifiedAccount(){ return Boolean(signedInUser && signedInUser.email_confirmed_at); }
  function isActiveAccount(){ return Boolean(isVerifiedAccount() && currentProfile && currentProfile.is_active); }
  function canEditInventory(){ return Boolean(isActiveAccount() && (currentRole === "editor" || currentRole === "admin")); }
  function canDeleteInventory(){ return Boolean(isActiveAccount() && currentRole === "admin"); }
  function dbToInventory(row){
    return {
      id: row.legacy_id || row.id, dbId: row.id, legacyId: row.legacy_id || "",
      recordType: row.record_type || "verified", partNumber: row.part_number || "",
      name: row.name || "", manufacturer: row.manufacturer || "", category: row.category || "",
      description: row.description || "",
      location: { area: row.location_area || "", cabinet: row.location_cabinet || "", shelf: row.location_shelf || "", bin: row.location_bin || "" },
      quantity: row.quantity == null ? null : Number(row.quantity), unit: row.unit || "pcs",
      minimumQuantity: row.minimum_quantity == null ? 0 : Number(row.minimum_quantity),
      condition: row.condition || "", supplier: row.supplier || "", datasheet: row.datasheet || "", notes: row.notes || "",
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().slice(0,10) : ""
    };
  }
  async function refreshDatabaseInventory(){
    if(!supabaseClient){ inventory = []; databaseInventoryLoaded = false; inventoryLoading = false; inventoryLoadError = "Supabase is not available."; return; }
    inventoryLoadError = "";
    inventoryLoading = true;
    if(pathNow() === "/inventory") render();
    try{
      const { data, error } = await supabaseClient.from("inventory_items").select("*").order("name", { ascending: true });
      if(error) throw error;
      inventory = (data || []).map(dbToInventory);
      databaseInventoryLoaded = true;
    }catch(error){
      inventory = [];
      databaseInventoryLoaded = false;
      inventoryLoadError = error && error.message ? error.message : "Unable to load the shared inventory database. Check your connection and try again.";
    }finally{
      inventoryLoading = false;
      if(pathNow() === "/inventory") render();
    }
  }
  async function loadAdminUsers(){
    if(!supabaseClient || !isActiveAccount() || currentRole !== "admin"){ adminUsers = []; return; }
    adminUsersLoading = true; adminUsersError = "";
    if(pathNow() === "/account") render();
    const { data, error } = await supabaseClient.functions.invoke("admin-users", { body: { action: "list" } });
    adminUsersLoading = false;
    if(error){ adminUsersError = error.message || "Could not load users. Check the Edge Function configuration."; adminUsers = []; }
    else { adminUsers = Array.isArray(data && data.users) ? data.users : []; }
    if(pathNow() === "/account") render();
  }
  function applySiteContentRecords(records) {
    siteContent = Array.isArray(records) ? records : [];
    projects.splice(0, projects.length, ...baseProjects.map(item => ({ ...item })));
    spotlights.splice(0, spotlights.length, ...baseSpotlights.map(item => ({ ...item })));
    Object.keys(pages).forEach(key => { delete pages[key]; });
    Object.assign(pages, basePages);
    for (const row of siteContent) {
      const data = row && row.content && typeof row.content === "object" ? row.content : {};
      const common = { ...data, slug: row.slug, title: row.title || data.title || row.slug,
        _siteContentId: row.id, _siteContentType: row.content_type,
        _sitePublished: row.published === true, featured: row.featured === true };
      if (row.content_type === "project") {
        const idx = projects.findIndex(item => item.slug === row.slug);
        const projectRecord = { ...common, featured: data.featured === true, grade: data.grade || data.gradeLevel || data.classYear || "Unassigned" };
        if (idx >= 0) projects[idx] = { ...projects[idx], ...projectRecord };
        else projects.push(projectRecord);
      } else if (row.content_type === "spotlight") {
        common.published = row.published === true;
        const idx = spotlights.findIndex(item => item.slug === row.slug);
        if (idx >= 0) spotlights[idx] = { ...spotlights[idx], ...common };
        else spotlights.push(common);
      } else if (row.content_type === "schematic") {
        common._contentType = "schematic";
        pages["/schematics/" + row.slug] = common;
      }
    }
  }

  async function loadSiteContent(shouldRender = false) {
    if (!supabaseClient) { siteContentLoading = false; return; }
    siteContentLoading = true; siteContentError = "";
    const { data, error } = await supabaseClient.from("site_content").select("*").order("updated_at", { ascending: false });
    siteContentLoading = false;
    if (error) { siteContentError = error.message || "Could not load the site content."; return; }
    applySiteContentRecords(data || []);
    if (shouldRender) render();
  }

  function isActiveAdmin() { return Boolean(isActiveAccount() && currentRole === "admin"); }
  function rowsToText(items, fields) {
    return (Array.isArray(items) ? items : []).map(item =>
      fields.map(field => String(typeof item === "string" && fields.length === 1 ? item : item && item[field] != null ? item[field] : "").replace(/\|/g, "/").replace(/\r?\n/g, " ")).join(" | ")
    ).join("\n");
  }
  function textToLines(value) {
    return String(value || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  }
  function textToRows(value, fields) {
    return textToLines(value).map(line => {
      const pieces = line.split("|").map(part => part.trim()), item = {};
      fields.forEach((field, index) => { item[field] = pieces[index] || ""; });
      return item;
    }).filter(item => Object.values(item).some(Boolean));
  }
  function videoIdFromValue(value) {
    const raw = String(value || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
    const match = raw.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
    return match ? match[1] : "";
  }
  function contentVideoBlock(item, title) {
    const videoValue = String(item && (item.videoUrl || item.video) || "").trim();
    const videoId = videoIdFromValue(item && item.videoId) || videoIdFromValue(videoValue);
    if (videoId) return youtubeEmbed(videoId, title || item.title || "Project video");
    if (/^https:\/\//i.test(videoValue) && /\.(mp4|webm)(?:[?#].*)?$/i.test(videoValue)) {
      return '<section class="spotlight-block spotlight-video-block"><div class="spotlight-block-heading"><p class="section-overline">VIDEO</p><h2>Watch the creation</h2></div><div class="spotlight-video"><video controls playsinline preload="metadata"><source src="' + esc(videoValue) + '">Your browser does not support embedded video.</video></div></section>';
    }
    return "";
  }
  async function uploadSiteMedia(file, contentType, slug, folder) {
    if (!supabaseClient || !isActiveAdmin()) throw new Error("An active administrator account is required to upload media.");
    if (!file) return "";
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"];
    if (!allowed.includes(file.type)) throw new Error("Use PNG, JPEG, WebP, GIF, AVIF, MP4, or WebM files.");
    if (file.size > 50 * 1024 * 1024) throw new Error("Each media file must be 50 MB or smaller.");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
    const objectPath = contentType + "/" + (slug || "untitled") + "/" + folder + "-" + Date.now() + "-" + safeName;
    const { error } = await supabaseClient.storage.from("site-media").upload(objectPath, file, { cacheControl: "3600", contentType: file.type, upsert: false });
    if (error) throw error;
    return supabaseClient.storage.from("site-media").getPublicUrl(objectPath).data.publicUrl;
  }

  async function syncAuthSession(session){
    signedInUser = session && session.user ? session.user : null;
    currentProfile = null; currentRole = null; adminUsers = []; adminUsersError = "";
    if(signedInUser && supabaseClient){
      const { data, error } = await supabaseClient.from("profiles").select("id, display_name, role, is_active").eq("id", signedInUser.id).maybeSingle();
      if(error){ accountMessage = "Signed in, but the profile could not be loaded: " + error.message; accountMessageKind = "error"; }
      else if(data){ currentProfile = data; currentRole = data.role; if(!isVerifiedAccount()){ accountMessage = "Verify your email address before using this account."; accountMessageKind = "error"; } else if(data.is_active){ accountMessage = ""; } else { accountMessage = "This account is not active yet. Ask the site administrator to invite or activate it."; accountMessageKind = "error"; } }
      else { accountMessage = "Your account exists, but its profile is missing. Ask an administrator to repair it."; accountMessageKind = "error"; }
      await refreshDatabaseInventory();
      await loadSiteContent(false);
      updateAccountLink();
      if(currentRole === "admin" && isActiveAccount()) await loadAdminUsers();
    } else {
      currentProfile = null; currentRole = null;
      updateAccountLink();
      await refreshDatabaseInventory();
      await loadSiteContent(false);
    }
    render();
  }
  function updateAccountLink(){
    const link = document.getElementById("account-link");
    if(!link) return;
    link.textContent = signedInUser ? (isActiveAccount() && currentRole ? "Account · " + currentRole[0].toUpperCase() + currentRole.slice(1) : "Account · Pending") : "Sign in";
    link.setAttribute("aria-label", signedInUser ? "Account and permissions" : "Sign in to Baypath Electronics");
  }
  function initSupabase(){
    try{
      if(!supabaseConfig.url || !supabaseConfig.publishableKey) throw new Error("Supabase project settings are missing.");
      if(!window.supabase || typeof window.supabase.createClient !== "function") throw new Error("The Supabase JavaScript library did not load. Check your connection and refresh.");
      supabaseClient = window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey);
      supabaseClient.channel("shared-inventory-live")
        .on("postgres_changes", { event: "*", schema: "public", table: "inventory_items" }, async () => {
          await refreshDatabaseInventory();
          if(pathNow() === "/inventory" || (pathNow() === "/account" && currentRole === "admin")) { inventoryState.page = 1; render(); }
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, async () => {
          await loadSiteContent(false);
          if(pathNow() === "/" || pathNow().startsWith("/projects") || pathNow().startsWith("/schematics") || pathNow().startsWith("/spotlights") || (pathNow() === "/account" && isActiveAdmin())) render();
        })
        .subscribe();
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        window.setTimeout(() => { syncAuthSession(session).catch(error => { accountMessage = error.message || "Unable to sync account."; accountMessageKind = "error"; render(); }); }, 0);
      });
      supabaseClient.auth.getSession().then(({data}) => syncAuthSession(data.session)).catch(error => {
        supabaseInitError = error.message || "Could not check your sign-in session."; render();
      });
    } catch(error){ supabaseInitError = error.message || "Supabase is not available."; inventoryLoading = false; inventoryLoadError = supabaseInitError; updateAccountLink(); render(); }
  }
  function renderInventoryEditorPanel(){
    if(!canEditInventory()) return "";
    return '<section class="inventory-editor-panel" id="inventory-editor-panel" hidden aria-labelledby="inventory-editor-title">' +
      '<div class="inventory-editor-heading"><div><p class="section-overline">DATABASE EDITOR</p><h2 id="inventory-editor-title">Add inventory item</h2><p>Changes save to Supabase and are visible to authorized signed-in users.</p></div><button type="button" class="button button-outline" data-inventory-editor-cancel>Close</button></div>' +
      '<form id="inventory-edit-form"><input type="hidden" name="dbId" value=""><div class="inventory-editor-grid">' +
      '<label>Part number <span>*</span><input name="partNumber" required maxlength="120" placeholder="e.g. RES-1K-025W"></label>' +
      '<label>Item name <span>*</span><input name="name" required maxlength="200" placeholder="e.g. 1 kΩ resistor, ¼ W"></label>' +
      '<label>Category <span>*</span><input name="category" required maxlength="120" placeholder="e.g. Resistors"></label>' +
      '<label>Manufacturer<input name="manufacturer" maxlength="160"></label>' +
      '<label>Internal ID (optional)<input name="legacyId" maxlength="120" placeholder="Cabinet or stock code"></label>' +
      '<label>Quantity<input name="quantity" type="number" min="0" step="0.001" placeholder="Leave blank if not counted"></label>' +
      '<label>Unit<input name="unit" maxlength="40" value="pcs"></label>' +
      '<label>Minimum stock<input name="minimumQuantity" type="number" min="0" step="0.001" value="0"></label>' +
      '<label>Condition<input name="condition" maxlength="120" placeholder="New, used, needs testing…"></label>' +
      '<label>Supplier<input name="supplier" maxlength="200"></label>' +
      '<label>Storage area<input name="locationArea" maxlength="160" placeholder="e.g. Electronics Lab"></label>' +
      '<label>Cabinet<input name="locationCabinet" maxlength="120"></label>' +
      '<label>Shelf / drawer<input name="locationShelf" maxlength="120"></label>' +
      '<label>Bin<input name="locationBin" maxlength="120"></label>' +
      '<label>Datasheet URL<input name="datasheet" type="url" maxlength="1000" placeholder="https://…"></label>' +
      '<label class="inventory-editor-wide">Description<textarea name="description" rows="2" maxlength="3000"></textarea></label>' +
      '<label class="inventory-editor-wide">Notes<textarea name="notes" rows="2" maxlength="3000"></textarea></label></div>' +
      '<div class="inventory-editor-actions"><p id="inventory-editor-message" role="status" aria-live="polite"></p><button type="button" class="button button-outline" data-inventory-editor-cancel>Cancel</button><button class="button button-accent" type="submit">Save inventory item</button></div></form></section>';
  }
  function showInventoryEditor(dbId){
    const panel=document.getElementById("inventory-editor-panel"), form=document.getElementById("inventory-edit-form");
    if(!panel || !form) return;
    form.reset(); form.elements.dbId.value=""; form.elements.unit.value="pcs"; form.elements.minimumQuantity.value="0";
    const item=dbId ? inventory.find(row=>row.dbId===dbId) : null;
    const fields={
      dbId:item?item.dbId:"",partNumber:item?item.partNumber:"",name:item?item.name:"",category:item?item.category:"",
      manufacturer:item?item.manufacturer:"",legacyId:item?item.legacyId:"",quantity:item&&item.quantity!=null?item.quantity:"",
      unit:item?item.unit:"pcs",minimumQuantity:item&&item.minimumQuantity!=null?item.minimumQuantity:0,condition:item?item.condition:"",
      supplier:item?item.supplier:"",locationArea:item?(item.location||{}).area:"",locationCabinet:item?(item.location||{}).cabinet:"",
      locationShelf:item?(item.location||{}).shelf:"",locationBin:item?(item.location||{}).bin:"",datasheet:item?item.datasheet:"",
      description:item?item.description:"",notes:item?item.notes:""
    };
    Object.entries(fields).forEach(([name,value])=>{ if(form.elements[name]) form.elements[name].value=value==null?"":String(value); });
    const title=document.getElementById("inventory-editor-title"); if(title) title.textContent=item?"Edit inventory item":"Add inventory item";
    const message=document.getElementById("inventory-editor-message"); if(message) message.textContent="";
    const submit=form.querySelector('button[type="submit"]'); if(submit) submit.textContent=item?"Save changes":"Save inventory item";
    panel.hidden=false; panel.scrollIntoView({behavior:"smooth",block:"start"}); form.elements.partNumber.focus();
  }
  function renderAdminUsers(){
    if(adminUsersLoading) return '<p class="account-muted">Loading accounts…</p>';
    if(adminUsersError) return '<p class="account-error" role="alert">'+esc(adminUsersError)+'</p><button class="button button-outline" type="button" data-admin-users-refresh>Retry</button>';
    if(!adminUsers.length) return '<p class="account-muted">No user profiles found yet.</p>';
    return '<div class="admin-user-list">'+adminUsers.map(user=>
      '<div class="admin-user-row"><div class="admin-user-identity"><strong>'+esc(user.display_name||user.email||"Unnamed user")+'</strong><span>'+esc(user.email||"Email unavailable")+'</span><small>'+esc(user.id)+'</small>'+(user.email_confirmed?'':'<span class="account-pending">Email not verified</span>')+(user.is_active?'':'<span class="account-pending">Inactive account</span>')+'</div>' +
      '<label class="admin-role-control"><span>Role</span><select data-user-role="'+esc(user.id)+'"'+(user.id===(signedInUser&&signedInUser.id)?' disabled title="Your own role cannot be changed"':'')+'><option value="viewer"'+(user.role==="viewer"?" selected":"")+'>Viewer</option><option value="editor"'+(user.role==="editor"?" selected":"")+'>Inventory editor</option><option value="admin"'+(user.role==="admin"?" selected":"")+'>Administrator</option></select></label>' +
      '<div class="admin-user-actions">' + (user.id!== (signedInUser&&signedInUser.id)?'<button class="button button-outline" type="button" data-user-role-save="'+esc(user.id)+'"><span aria-hidden="true">♙</span> Save role</button>':'<span class="account-muted">Your role is locked</span>')+(user.id!== (signedInUser&&signedInUser.id)?'<button class="button button-outline" type="button" data-user-active-toggle="'+esc(user.id)+'" data-next-active="'+(!user.is_active?'true':'false')+'"'+(!user.email_confirmed&&!user.is_active?' disabled title="User must verify their email first"':'')+'>'+(user.is_active?'Deactivate':'Activate')+'</button><button class="button button-danger" type="button" data-user-delete="'+esc(user.id)+'">Remove</button>':'<span class="account-muted">You</span>')+'</div></div>'
    ).join("")+'</div>';
  }


  function renderContentEditorForm() {
    if (!contentEditorOpen) return "";
    const row = contentEditorRecord || {};
    const d = row.content || {};
    const type = row.content_type || contentEditorType;
    const val = (key, fallback = "") => d[key] == null ? fallback : d[key];
    const input = (label, name, value, extra = "") => '<label class="content-editor-field">' + esc(label) + '<input name="' + name + '" value="' + esc(value) + '" ' + extra + '></label>';
    const area = (label, name, value, rows = 3, hint = "") => '<label class="content-editor-field content-editor-field-wide">' + esc(label) + '<textarea name="' + name + '" rows="' + rows + '">' + esc(value) + '</textarea>' + (hint ? '<small>' + esc(hint) + '</small>' : '') + '</label>';
    const file = (label, name, accept, multiple = false) => '<label class="content-editor-field">' + esc(label) + '<input name="' + name + '" type="file" accept="' + accept + '"' + (multiple ? ' multiple' : '') + '></label>';
    const gradeValue = d.gradeLevel || d.grade || d.classYear || "";
    const videoValue = d.videoUrl || d.videoId || "";
    const principle = d.principle || {};
    return '<section class="site-content-editor" id="site-content-editor" aria-labelledby="site-content-editor-title">' +
      '<div class="content-editor-heading"><div><p class="admin-panel-eyebrow">CONTENT WORKSPACE</p><h3 id="site-content-editor-title">' + (row.id ? 'Edit content' : 'Create content') + '</h3><p>Save a draft, review it on the site, then publish when it is ready.</p></div><button type="button" class="button button-outline" data-content-cancel><span aria-hidden="true">×</span> Close editor</button></div>' +
      (contentEditorMessage ? '<p class="account-error" role="alert">' + esc(contentEditorMessage) + '</p>' : '') +
      '<form id="site-content-form"><input type="hidden" name="contentId" value="' + esc(row.id || "") + '"><input type="hidden" name="contentType" value="' + esc(type) + '">' +
      '<div class="content-editor-grid">' +
      '<div class="content-editor-type-note"><span class="section-overline">CONTENT TYPE</span><strong>' + esc(type === "spotlight" ? "Creator Spotlight" : type === "project" ? "Project Guide" : "Schematic") + '</strong><p>' + esc(type === "spotlight" ? "Celebrate the finished creation, the creator, and its contribution. No assembly procedure is shown on the spotlight page." : type === "project" ? "Document a real project with its brief, schematic, materials, steps, verification, and media." : "Create a reusable circuit reference with a schematic, design notes, optional video, and a related project guide.") + '</p></div>' +
      input("Title", "title", row.title || d.title || "", 'required maxlength="180"') +
      input("URL slug", "slug", row.slug || d.slug || "", 'required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxlength="100" placeholder="lowercase-words-with-hyphens"') +
      input("Category", "category", d.category || d.eyebrow || "", 'maxlength="120" placeholder="Timing circuits, Robotics, Design…"') +
      input("Creator / author", "creatorName", d.creatorName || d.author || d.featuredBy || "", 'maxlength="160" placeholder="Name for public credit"') +
      input("Class / grade year", "gradeLevel", gradeValue, 'maxlength="80" placeholder="Freshman, Sophomore, Junior, Senior"') +
      input("Status or date label", "status", d.status || d.dateLabel || "", 'maxlength="100" placeholder="Prototype, October 2026…"') +
      area("Short summary", "summary", d.summary || "", 3, "Used on cards and the homepage spotlight.") +
      area("Description / overview", "description", d.description || "", 5, "Explain what it is, what it does, and why it matters.") +
      area("Story / design notes", "story", d.story || d.notes || "", 5, "Spotlights: context and story. Projects/schematics: rationale or additional notes.") +
      area("Contribution / impact", "contribution", d.contribution || "", 4, "Spotlights: usefulness, originality, impact, or what others can learn.") +
      area("Highlights", "highlights", rowsToText(d.highlights || [], [""]), 3, "One point per line. Used by Spotlight entries.") +
      area("Tags", "tags", rowsToText(d.tags || [], [""]), 2, "One tag per line.") +
      input("Featured image URL", "featuredImage", d.featuredImage || "", 'placeholder="Upload below or paste a public URL"') +
      input("Featured image alt text", "featuredImageAlt", d.featuredImageAlt || "", 'maxlength="220"') +
      file("Upload / replace featured image", "featuredFile", "image/png,image/jpeg,image/webp,image/gif,image/avif") +
      input("Schematic image URL", "schematicImage", d.schematicImage || (d.sections && d.sections[0] && d.sections[0].image) || "", 'placeholder="Upload below or paste a public URL"') +
      input("Schematic alt text", "schematicAlt", d.schematicAlt || (d.sections && d.sections[0] && d.sections[0].imageAlt) || "", 'maxlength="220"') +
      file("Upload / replace schematic image", "schematicFile", "image/png,image/jpeg,image/webp,image/gif,image/avif") +
      area("Additional gallery images", "gallery", rowsToText(d.gallery || [], ["image", "alt", "caption"]), 4, "One per line: image URL | alt text | caption. Upload extra gallery images below to append them.") +
      file("Upload gallery images", "galleryFiles", "image/png,image/jpeg,image/webp,image/gif,image/avif", true) +
      input("Video URL or YouTube ID", "videoUrl", videoValue, 'placeholder="YouTube URL/ID or direct MP4/WebM URL"') +
      file("Upload video (MP4/WebM)", "videoFile", "video/mp4,video/webm") +
      '<div class="content-editor-type-note"><span class="section-overline">PROJECT GUIDE FIELDS</span><p>For Project Guides, fill in the fields below using one line per row. Separate values with a vertical bar, as shown in each hint.</p></div>' +
      area("Quick facts", "facts", rowsToText(d.facts || [], ["label", "value"]), 3, "One per line: Label | Value") +
      input("Core idea heading", "principleTitle", principle.title || "", 'maxlength="180"') +
      area("Core idea", "principleText", principle.text || "", 3) +
      input("Formula (optional)", "principleFormula", principle.formula || "", 'maxlength="240"') +
      area("Learning objectives", "objectives", rowsToText(d.objectives || [], [""]), 3, "One objective per line.") +
      area("Design process", "designProcess", rowsToText(d.designProcess || [], ["title", "description"]), 4, "One per line: Step title | Explanation") +
      area("Materials / parts", "materials", rowsToText(d.materials || [], ["name", "quantity", "notes"]), 5, "One per line: Part name | Quantity | Notes") +
      area("Tools / equipment", "tools", rowsToText(d.tools || [], [""]), 3, "One tool per line.") +
      area("Build steps", "steps", rowsToText(d.steps || [], ["title", "description", "why", "check"]), 7, "One per line: Step title | Instructions | Why | Check") +
      area("Verification / tests", "verification", rowsToText(d.verification || [], ["title", "description"]), 4, "One per line: Test | Expected result") +
      area("Troubleshooting", "troubleshooting", rowsToText(d.troubleshooting || [], ["problem", "cause", "fix"]), 4, "One per line: Problem | Likely cause | Fix") +
      area("References / datasheets", "files", rowsToText(d.files || [], ["label", "href", "description"]), 3, "One per line: Link label | URL | Description") +
      input("Related project slug (for schematics)", "relatedProjectSlug", d.relatedProjectSlug || "", 'placeholder="optional-project-slug"') +
      area("Final notes", "notes", d.notes || "", 3) +
      '<div class="content-editor-publish"><label><input type="checkbox" name="published"' + (row.published === true ? ' checked' : '') + '> Published — visible to all visitors</label><label><input type="checkbox" name="featured"' + (row.featured === true ? ' checked' : '') + '> Feature on homepage rotation (Spotlights)</label></div>' +
      '</div><p class="content-editor-upload-note">Files are stored in the public site media bucket. Each file must be 50 MB or smaller. Do not upload private student information.</p>' +
      '<div class="content-editor-actions"><button class="button button-accent" type="submit"><span aria-hidden="true">✓</span> Save content</button><button class="button button-outline" type="button" data-content-cancel>Cancel</button></div></form></section>';
  }

  function renderAdminContentManager() {
    if (!isActiveAdmin()) return "";
    const items = siteContent.slice().sort((a,b) => String(a.content_type).localeCompare(String(b.content_type)) || String(a.title).localeCompare(String(b.title)));
    const label = type => type === "spotlight" ? "SPOTLIGHT" : type === "project" ? "PROJECT GUIDE" : "SCHEMATIC";
    const list = items.length ? '<div class="site-content-list">' + items.map(row =>
      '<div class="site-content-row"><div class="site-content-row-main"><span class="content-type-label">' + label(row.content_type) + '</span><strong>' + esc(row.title) + '</strong><small>/' + esc(row.slug) + '</small></div><div class="site-content-row-status"><span class="' + (row.published ? 'content-state-live' : 'content-state-draft') + '">' + (row.published ? 'Published' : 'Draft') + '</span>' + (row.featured ? '<span class="content-state-featured">Featured</span>' : '') + '</div><div class="site-content-row-actions"><button type="button" class="button button-outline" data-content-edit="' + esc(row.id) + '"><span aria-hidden="true">✎</span> Edit</button><button type="button" class="button button-danger" data-content-delete="' + esc(row.id) + '" aria-label="Delete ' + esc(row.title) + '"><span aria-hidden="true">×</span> Delete</button></div></div>'
    ).join("") + '</div>' : '<div class="site-content-empty"><strong>No editable records yet.</strong><p>Import the current reference projects and schematics to start editing them here. You can also create a new spotlight, project guide, or schematic.</p></div>';
    return '<section class="admin-console-section admin-site-content-manager" aria-labelledby="site-content-manager-title"><div class="admin-console-section-heading"><div><p class="section-overline">PUBLISHING WORKSPACE</p><h2 id="site-content-manager-title">Spotlights, projects & schematics</h2><p>Edit descriptions, add media, manage build instructions, and publish content without editing source files.</p></div><span class="admin-console-section-tag">ADMIN ONLY</span></div>' +
      '<div class="site-content-toolbar"><button class="admin-primary-action" type="button" data-content-new="spotlight"><span aria-hidden="true">✦</span> New spotlight</button><button class="admin-secondary-action" type="button" data-content-new="project"><span aria-hidden="true">＋</span> New project guide</button><button class="admin-secondary-action" type="button" data-content-new="schematic"><span aria-hidden="true">⌁</span> New schematic</button><button class="admin-secondary-action" type="button" data-content-seed><span aria-hidden="true">↻</span> Import current references</button></div>' +
      (siteContentError ? '<p class="account-error" role="alert">' + esc(siteContentError) + '</p>' : '') +
      (siteContentLoading && !items.length ? '<p class="account-muted">Loading content records…</p>' : list) +
      (contentEditorOpen ? renderContentEditorForm() : '') +
      '<p class="admin-access-footnote"><span aria-hidden="true">ⓘ</span> Drafts are administrator-visible only. Publishing a record makes its text and attached media publicly accessible.</p></section>';
  }

  function renderAdminDashboard(path){
    const activeUsers=adminUsers.filter(user=>user.is_active && user.email_confirmed).length;
    const activeEditors=adminUsers.filter(user=>user.is_active && user.email_confirmed && (user.role==="editor"||user.role==="admin")).length;
    const displayName=currentProfile&&currentProfile.display_name||signedInUser.email||"Administrator";
    return '<div class="page-shell admin-dashboard">'+breadcrumbs(path)+
      '<header class="admin-console-hero"><div class="admin-console-hero-copy">'+
        '<p class="admin-console-kicker"><span class="admin-console-kicker-dot"></span> CONTROL ROOM / ACCESS MANAGEMENT</p>'+
        '<h1>Admin console<span>.</span></h1>'+
        '<p>Manage who can edit the catalog and keep the shared inventory accurate for everyone.</p>'+
        '<div class="admin-console-user"><span class="admin-console-avatar">'+esc(displayName.slice(0,1).toUpperCase())+'</span><span><strong>'+esc(displayName)+'</strong><small>'+esc(signedInUser.email||'')+' · Administrator</small></span></div>'+
      '</div><div class="admin-console-hero-side"><span class="admin-console-status"><span></span> Administrator access</span><button class="admin-console-signout" type="button" data-auth-signout><span aria-hidden="true">↗</span> Sign out</button><span class="admin-console-hero-note">Changes apply to the central inventory database.</span></div></header>'+
      (accountMessage?'<p class="account-'+esc(accountMessageKind)+'" role="status">'+esc(accountMessage)+'</p>':'')+
      '<section class="admin-stat-grid" aria-label="Administration overview">'+
        '<article class="admin-stat-card admin-stat-card-inventory"><span class="admin-stat-label">Shared inventory</span><strong>'+inventory.length.toLocaleString("en-US")+'</strong><small>'+(databaseInventoryLoaded?'Live database records':'Loading shared records')+'</small><a href="#/inventory">Open inventory <span aria-hidden="true">↗</span></a></article>'+
        '<article class="admin-stat-card"><span class="admin-stat-label">User accounts</span><strong>'+adminUsers.length.toLocaleString("en-US")+'</strong><small>'+activeUsers.toLocaleString("en-US")+' active account'+(activeUsers===1?'':'s')+'</small><span class="admin-stat-foot">Across all permission levels</span></article>'+
        '<article class="admin-stat-card"><span class="admin-stat-label">Editors & admins</span><strong>'+activeEditors.toLocaleString("en-US")+'</strong><small>Can change inventory records</small><span class="admin-stat-foot">Viewer access stays read-only</span></article>'+
      '</section>'+
      '<div class="admin-console-section-heading"><div><p class="section-overline">PEOPLE & PERMISSIONS</p><h2>Manage access</h2><p>Invite trusted users and grant only the permission level they need.</p></div><span class="admin-console-section-tag">ROLE-BASED ACCESS</span></div>'+
      '<section class="admin-console-grid">'+
        '<article class="admin-console-panel admin-console-invite"><div class="admin-panel-icon" aria-hidden="true">＋</div>'+
          '<div class="admin-panel-heading"><p class="admin-panel-eyebrow">ADD A TEAM MEMBER</p><h3>Invite a user</h3><p>They will receive an invitation email and can sign in after completing it.</p></div>'+
          '<form id="admin-invite-form" class="admin-invite-form admin-invite-form-dashboard">'+
            '<label>Name <span>Optional</span><input name="displayName" maxlength="120" placeholder="Person’s name"></label>'+
            '<label>Email address<input name="email" type="email" required placeholder="person@example.com"></label>'+
            '<label>Permission level<select name="role"><option value="viewer">Viewer — can view inventory</option><option value="editor">Inventory editor — add and edit items</option><option value="admin">Administrator — manage users too</option></select></label>'+
            '<button class="admin-primary-action" type="submit"><span aria-hidden="true">＋</span> Send invitation</button>'+
            '<p id="admin-invite-message" role="status" aria-live="polite"></p>'+
          '</form>'+
          '<div class="admin-role-legend"><div><span class="role-dot role-viewer"></span><span><strong>Viewer</strong><small>Read-only inventory access</small></span></div><div><span class="role-dot role-editor"></span><span><strong>Inventory editor</strong><small>Add and update records</small></span></div><div><span class="role-dot role-admin"></span><span><strong>Administrator</strong><small>Manage users and delete records</small></span></div></div>'+
        '</article>'+
        '<article class="admin-console-panel admin-console-access"><div class="admin-access-heading"><div><p class="admin-panel-eyebrow">CURRENT ACCESS</p><h3>Users & permissions</h3><p>Update a role, or remove access for a former team member.</p></div><button class="admin-secondary-action" type="button" data-admin-users-refresh><span aria-hidden="true">↻</span> Refresh</button></div>'+
          '<div class="admin-access-table-heading"><span>PERSON</span><span>ROLE</span><span>ACTIONS</span></div>'+
          '<div id="admin-users-container" class="admin-users-container">'+renderAdminUsers()+'</div>'+
          '<p class="admin-access-footnote"><span aria-hidden="true">ⓘ</span> Removing a user deletes their sign-in account. Role and inventory permissions are enforced by the database, not just by these controls.</p>'+
        '</article>'+
      '</section>'+
      renderAdminContentManager() +
      '<section class="admin-system-note"><span class="status-note-icon" aria-hidden="true">✓</span><div><strong>Shared data is live</strong><p>Inventory changes are saved centrally and propagate to the public catalog as well as signed-in sessions. Public visitors can read stock records; only active editors and administrators can change them.</p></div><a href="#/inventory">Review inventory ↗</a></section>'+
    '</div>';
  }

  function renderAccountPasswordFlow(path){
    const isInvite = authFlow === "invite";
    const heading = isInvite ? "Set up your account" : "Choose a new password";
    const intro = isInvite ? "Confirm your invitation by setting a password for your Baypath Electronics account." : "Choose a new password for your Baypath Electronics account.";
    if(!signedInUser) return '<div class="page-shell">'+breadcrumbs(path)+'<header class="page-intro"><div><p class="eyebrow">ACCOUNT / SETUP</p><h1>'+heading+'</h1><p>'+intro+'</p></div></header><section class="auth-card"><h2>Checking the secure link…</h2><p class="account-muted">If this does not finish, the invitation or reset link may have expired. Return to sign in and request a fresh link.</p><a class="button button-outline" href="#/account">Back to sign in</a></section></div>';
    return '<div class="page-shell">'+breadcrumbs(path)+'<header class="page-intro"><div><p class="eyebrow">ACCOUNT / SETUP</p><h1>'+heading+'</h1><p>'+intro+'</p></div></header><section class="auth-card"><div class="auth-card-heading"><span class="auth-icon" aria-hidden="true">♙</span><div><h2>'+heading+'</h2><p>'+esc(signedInUser.email||"")+'</p></div></div>'+(accountMessage?'<p class="account-'+esc(accountMessageKind)+'" role="status">'+esc(accountMessage)+'</p>':"")+'<form id="finish-password-form" class="auth-form"><label>New password<input name="password" type="password" autocomplete="new-password" minlength="10" required></label><label>Confirm password<input name="confirmPassword" type="password" autocomplete="new-password" minlength="10" required></label><p class="account-muted">Use at least 10 characters. Do not reuse a password from another account.</p><button class="button button-accent" type="submit"><span aria-hidden="true">✓</span> Save password and continue</button></form></section></div>';
  }

  function renderAccountPage(path){
    const roleLabel=!(currentProfile&&currentProfile.is_active)?"Pending activation":currentRole==="admin"?"Administrator":currentRole==="editor"?"Inventory editor":currentRole==="viewer"?"Viewer":"No role assigned";
    if(!supabaseClient) return '<div class="page-shell">'+breadcrumbs(path)+'<header class="page-intro"><div><p class="eyebrow">ACCOUNT / SIGN IN</p><h1>Account access</h1><p>Sign-in is currently unavailable.</p></div></header><div class="auth-card"><p class="account-error">'+esc(supabaseInitError||"Supabase configuration could not be loaded.")+'</p></div></div>';
    if(authFlow) return renderAccountPasswordFlow(path);
    if(!signedInUser){
      return '<div class="page-shell">'+breadcrumbs(path)+'<header class="page-intro"><div><p class="eyebrow">ACCOUNT / SIGN IN</p><h1>Sign in to Electronics</h1><p>Sign in to view the live inventory database. Inventory editing and account management are role-restricted.</p></div></header>' +
        '<div class="auth-card"><div class="auth-card-heading"><span class="auth-icon">↪</span><div><h2>Sign in</h2><p>Use the account created in Supabase Authentication.</p></div></div>' +
        (accountMessage?'<p class="account-'+esc(accountMessageKind)+'" role="status">'+esc(accountMessage)+'</p>':"")+
        '<form id="sign-in-form" class="auth-form"><label>Email address<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button class="button button-accent" type="submit"><span aria-hidden="true">↪</span> Sign in</button><button class="text-link auth-reset-toggle" type="button" data-password-reset-toggle><span aria-hidden="true">↻</span> Forgot password?</button><p class="account-muted">Invited users must confirm their email and create a password from the invitation link. If that link has expired, use password recovery or request a new invitation.</p></form><form id="password-reset-form" class="auth-form auth-reset-form" hidden><label>Email address<input name="email" type="email" autocomplete="username" required></label><button class="button button-outline" type="submit"><span aria-hidden="true">✉</span> Send password reset link</button><button class="text-link" type="button" data-password-reset-toggle>Cancel</button></form></div></div>';
    }
    if(currentRole==="admin" && isActiveAccount()) return renderAdminDashboard(path);
    return '<div class="page-shell">'+breadcrumbs(path)+'<header class="page-intro"><div><p class="eyebrow">ACCOUNT / ACCESS CONTROL</p><h1>Account</h1><p>Manage your session and review your permission level.</p></div></header>' +
      '<section class="account-summary"><div class="account-avatar">'+esc((currentProfile&&currentProfile.display_name||signedInUser.email||"U").slice(0,1).toUpperCase())+'</div><div class="account-summary-copy"><h2>'+esc(currentProfile&&currentProfile.display_name||signedInUser.email)+'</h2><p>'+esc(signedInUser.email||"")+'</p><span class="account-role">'+esc(roleLabel)+'</span></div><button class="button button-outline" type="button" data-auth-signout>Sign out</button></section>' +
      (accountMessage?'<p class="account-'+esc(accountMessageKind)+'" role="status">'+esc(accountMessage)+'</p>':"")+
      (currentRole==="admin" && currentProfile && currentProfile.is_active ? '<section class="account-admin"><div class="account-section-heading"><div><p class="section-overline">ADMINISTRATOR TOOLS</p><h2>Invite a user</h2><p>Send an email invitation and choose the least-privileged role they need.</p></div></div><form id="admin-invite-form" class="admin-invite-form"><label>Name (optional)<input name="displayName" maxlength="120" placeholder="Person’s name"></label><label>Email address<input name="email" type="email" required placeholder="person@example.com"></label><label>Role<select name="role"><option value="viewer">Viewer — view inventory</option><option value="editor">Inventory editor — add and edit items</option><option value="admin">Administrator — manage users and inventory</option></select></label><button class="button button-accent" type="submit">Send invitation</button><p id="admin-invite-message" role="status" aria-live="polite"></p></form>' +
      '<div class="account-section-heading account-users-heading"><div><p class="section-overline">ACCESS LIST</p><h2>Users and permissions</h2><p>Role updates apply to database access. Removing a user deletes their Supabase Auth account.</p></div><button class="button button-outline" type="button" data-admin-users-refresh>Refresh users</button></div><div id="admin-users-container">'+renderAdminUsers()+'</div></section>' :
      '<section class="account-permission-note"><h2>Your permissions</h2><p>'+(!(currentProfile&&currentProfile.is_active)?"Your account is not active yet. Ask the administrator to invite or activate it.":currentRole==="editor"?"You can view, add, and edit inventory records. Only administrators can delete records or manage user accounts.":currentRole==="viewer"?"You can view the live inventory database. Ask an administrator if you need editing access.":"Your account has no recognized role. Contact an administrator.")+'</p></section>')+
      '</div>';
  }

  function inventoryTableRows(rows){
    if(!rows.length)return '<tr><td colspan="7"><div class="inventory-no-results"><strong>No matching inventory records.</strong><p>Try a shorter search, clear one of the filters, or reset the catalog view.</p><button class="button button-outline" type="button" data-inventory-reset>Reset filters</button></div></td></tr>';
    return rows.map(item=>{
      const stock=inventoryStock(item),loc=item.location||{};
      return '<tr><td class="inventory-number-cell"><span class="inventory-part-number">'+esc(item.partNumber||item.id||"—")+'</span><small>'+esc(item.id||"")+'</small></td>'+
        '<td class="inventory-name-cell"><strong>'+esc(item.name||"Unnamed part")+'</strong><small>'+esc(item.manufacturer||"Manufacturer not listed")+'</small><span class="inventory-row-meta">'+esc(item.condition||"Condition not recorded")+(item.supplier?" · "+esc(item.supplier):"")+'</span></td>'+
        '<td><span class="inventory-category-tag">'+esc(item.category||"Uncategorized")+'</span></td>'+
        '<td class="inventory-location-cell"><strong>'+esc(loc.area||"Area not entered")+'</strong><small>'+esc([loc.cabinet,loc.shelf,loc.bin].filter(Boolean).join(" / ")||"Cabinet or bin not entered")+'</small></td>'+
        '<td class="inventory-quantity-cell"><strong>'+esc(item.quantity==null?"—":Number(item.quantity).toLocaleString("en-US"))+'</strong><small>'+esc(item.unit||"units")+(item.minimumQuantity!=null?" · Min "+esc(item.minimumQuantity):"")+'</small></td>'+
        '<td><span class="stock-pill stock-'+stock.key+'">'+(stock.key==="in"?"✓":stock.key==="low"?"!":stock.key==="out"?"×":"?")+' '+esc(stock.label)+'</span></td>'+
        '<td class="inventory-notes-cell"><p>'+esc(item.description||"No description recorded.")+'</p>'+(item.notes?'<small>'+esc(item.notes)+'</small>':"")+
        (item.datasheet?'<a href="'+esc(item.datasheet)+'" target="_blank" rel="noopener">Datasheet / reference ↗</a>':"")+
        (item.updatedAt?'<span class="inventory-updated">Updated '+esc(item.updatedAt)+'</span>':"")+
        (canEditInventory()?'<div class="inventory-row-actions"><button type="button" class="button button-outline" data-inventory-edit="'+esc(item.dbId||"")+'">Edit</button>'+(canDeleteInventory()?'<button type="button" class="button button-danger" data-inventory-delete="'+esc(item.dbId||"")+'">Delete</button>':"")+'</div>':"")+'</td></tr>';
    }).join("");
  }
  function inventoryExportCSV(rows){
    const headers=["id","partNumber","name","manufacturer","category","locationArea","cabinet","shelf","bin","quantity","unit","minimumQuantity","condition","supplier","description","notes","datasheet","updatedAt","recordType"];
    const quote=value=>'"'+String(value==null?"":value).replace(/"/g,'""')+'"';
    const data=rows.map(item=>headers.map(h=>{
      if(h==="locationArea")return quote(inventoryArea(item));
      if(["cabinet","shelf","bin"].includes(h))return quote((item.location||{})[h]);
      return quote(item[h]);
    }).join(","));
    const blob=new Blob(["\uFEFF",[headers.map(quote).join(","),...data].join("\r\n")],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="electronics-inventory-export.csv";
    document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  function updateInventoryResults(){
    const host=document.getElementById("inventory-results");if(!host)return;
    if(inventoryLoading && !databaseInventoryLoaded){
      host.innerHTML='<div class="inventory-no-results inventory-loading-state"><strong>Loading shared inventory…</strong><p>Fetching the latest records from the central database.</p></div>';
      const loadingSummary=document.getElementById("inventory-live-summary");if(loadingSummary)loadingSummary.textContent="Loading shared inventory";
      return;
    }
    const rows=inventoryMatches(),total=rows.length,size=Math.max(10,Number(inventoryState.pageSize)||50);
    const pageCount=Math.max(1,Math.ceil(total/size));inventoryState.page=Math.min(Math.max(1,inventoryState.page),pageCount);
    const start=total?(inventoryState.page-1)*size:0,end=Math.min(start+size,total),shown=rows.slice(start,start+size);
    const range=total?(start+1).toLocaleString("en-US")+"–"+end.toLocaleString("en-US"):"0";
    const arrow=k=>inventoryState.sortBy===k?(inventoryState.sortDir==="asc"?" ↑":" ↓"):"";
    host.innerHTML='<div class="inventory-table-toolbar"><div><p class="inventory-range"><strong>'+range+'</strong> of '+total.toLocaleString("en-US")+' matching records</p><span>Page '+inventoryState.page+' of '+pageCount+'</span></div><label class="page-size-control">Rows per page <select id="inventory-page-size">'+[25,50,100,200].map(n=>'<option value="'+n+'"'+(n===size?" selected":"")+'>'+n+'</option>').join("")+'</select></label></div>'+
      '<div class="inventory-table-scroll"><table class="inventory-table"><thead><tr>'+
      '<th><button type="button" data-inventory-sort="partNumber">Part number'+arrow("partNumber")+'</button></th>'+
      '<th><button type="button" data-inventory-sort="name">Part / maker'+arrow("name")+'</button></th>'+
      '<th><button type="button" data-inventory-sort="category">Category'+arrow("category")+'</button></th>'+
      '<th><button type="button" data-inventory-sort="location">Storage location'+arrow("location")+'</button></th>'+
      '<th><button type="button" data-inventory-sort="quantity">Quantity'+arrow("quantity")+'</button></th>'+
      '<th><button type="button" data-inventory-sort="status">Stock status'+arrow("status")+'</button></th><th>Description / notes</th></tr></thead><tbody>'+inventoryTableRows(shown)+'</tbody></table></div>'+
      '<div class="inventory-pagination"><span>Showing '+range+' records</span><div><button type="button" class="button button-outline" data-inventory-prev '+(inventoryState.page<=1?"disabled":"")+'>← Previous</button><span>Page '+inventoryState.page+' / '+pageCount+'</span><button type="button" class="button button-outline" data-inventory-next '+(inventoryState.page>=pageCount?"disabled":"")+'>Next →</button></div></div>';
    const summary=document.getElementById("inventory-live-summary");if(summary)summary.textContent=total.toLocaleString("en-US")+" matching record"+(total===1?"":"s");
  }
  function renderInventory(path){
    const categories=inventoryCategories(),areas=inventoryAreas();
    const low=inventory.filter(x=>inventoryStock(x).key==="low").length,out=inventory.filter(x=>inventoryStock(x).key==="out").length;
    return '<div class="page-shell inventory-page">'+breadcrumbs(path)+
      '<header class="inventory-page-heading"><div><p class="eyebrow">INVENTORY / MASTER CATALOG</p><h1>Inventory<span class="heading-period">.</span></h1>'+
      '<p>A searchable, structured catalog for electronic components, wiring, hand tools, test equipment, consumables, and reusable shop assets. Search by the part you know, filter by where it lives, and sort the list to review quantities or identify records that need attention. As the catalog grows, filters narrow the full dataset while pagination keeps each view manageable.</p></div>'+
      '<div class="inventory-heading-side"><span class="inventory-heading-icon">▦</span><strong>MASTER STOCK LIST</strong><small>Part → Location → Quantity → Notes</small><a href="#inventory-catalog">Browse the catalog ↓</a></div></header>'+
      renderInventoryEditorPanel()+
      '<aside class="inventory-auth-notice"><strong>Shared inventory database</strong><p>This is the same live catalog for everyone, whether signed in or not. Authorized editors’ changes appear here automatically. <a href="#/account">Sign in</a> to manage records if you have editing permissions.</p></aside>'+
      (inventoryLoadError ? '<aside class="account-error" role="alert">Could not load shared inventory: '+esc(inventoryLoadError)+' <button type="button" class="button button-outline" data-inventory-retry>Retry</button></aside>' : '')+
      (databaseInventoryLoaded && inventory.length===0 ? '<aside class="inventory-auth-notice"><strong>No stock records yet</strong><p>The shared database is currently empty. An authorized inventory editor can add the first item.</p></aside>' : '')+
      '<section class="inventory-summary-grid" aria-label="Inventory summary"><div class="inventory-summary-card"><span>Catalog records</span><strong>'+inventory.length.toLocaleString("en-US")+'</strong><small>'+"Shared with all visitors"+'</small></div>'+
      '<div class="inventory-summary-card"><span>Categories</span><strong>'+categories.length.toString().padStart(2,"0")+'</strong><small>Types of item listed</small></div>'+
      '<div class="inventory-summary-card"><span>Low stock</span><strong>'+low.toLocaleString("en-US")+'</strong><small>'+"At or below minimum quantity"+'</small></div>'+
      '<div class="inventory-summary-card"><span>Out of stock</span><strong>'+out.toLocaleString("en-US")+'</strong><small>'+"Quantity recorded as zero"+'</small></div></section>'+
      '<section class="inventory-catalog" id="inventory-catalog"><div class="inventory-catalog-heading"><div><p class="section-overline">INVENTORY TABLE</p><h2>Find an item</h2><p>Use search or combine filters. Search checks part numbers, item names, manufacturers, categories, storage paths, descriptions, and notes.</p></div><div class="inventory-catalog-actions">'+(canEditInventory()?'<button type="button" class="button button-accent" data-inventory-add>+ Add item</button>':"")+'<button type="button" class="button button-outline" data-inventory-reset>Reset filters</button><button type="button" class="button button-accent" data-inventory-export>Export CSV</button></div></div>'+
      '<section class="inventory-how-to" aria-labelledby="inventory-how-to-title"><div class="inventory-how-to-header"><h3 id="inventory-how-to-title">How to use the catalog</h3><p>Filters work together. For example, choose a category and a storage area to see only that type of item stored in that place.</p></div><div class="inventory-help-grid">'+
      '<div><strong>Search</strong><p>Type part of a name, part number, value, manufacturer, cabinet, shelf, bin, or note. Partial words work.</p></div>'+
      '<div><strong>Category = what it is</strong><p>Choose a type of item, such as Resistors, Capacitors, LEDs &amp; Displays, Integrated Circuits, or Wires &amp; Cables.</p></div>'+
      '<div><strong>Storage area = where it is</strong><p>Choose the room or area first. The table shows a more specific cabinet, drawer or shelf, and bin when recorded.</p></div>'+
      '<div><strong>Stock status = what needs attention</strong><p>In stock means a positive count that is not flagged low. Low stock means a positive count at or below a configured minimum. Out of stock means the count is zero. Count needed means no reliable quantity has been entered.</p></div></div><p class="inventory-help-footer">Click a table heading to sort. Use <strong>Reset filters</strong> to clear the search and filters. <strong>Export CSV</strong> downloads records that match your current filters; it does not change the website data.</p></section>'+
      '<div class="inventory-filter-grid"><label class="inventory-search-control"><span>Search items</span><div class="inventory-search-box"><span aria-hidden="true">⌕</span><input type="search" id="inventory-search" aria-label="Search inventory by name, part number, location, or notes" value="'+esc(inventoryState.query)+'" placeholder="Try “1 kΩ”, “LED”, or “Cabinet A”" autocomplete="off"><kbd>/</kbd></div></label>'+
      '<label><span>Category (item type)</span><select id="inventory-category" aria-label="Filter by item category">'+optionList(categories,inventoryState.category,"All categories")+'</select></label>'+
      '<label><span>Storage area (where it is)</span><select id="inventory-area" aria-label="Filter by storage area">'+optionList(areas,inventoryState.area,"All areas")+'</select></label>'+
      '<label><span>Stock status</span><select id="inventory-stock" aria-label="Filter by stock status"><option value="all"'+(inventoryState.stock==="all"?" selected":"")+'>All statuses</option><option value="in"'+(inventoryState.stock==="in"?" selected":"")+'>In stock</option><option value="low"'+(inventoryState.stock==="low"?" selected":"")+'>Low stock</option><option value="out"'+(inventoryState.stock==="out"?" selected":"")+'>Out of stock</option><option value="unknown"'+(inventoryState.stock==="unknown"?" selected":"")+'>Count needed</option></select></label></div>'+
      '<div class="inventory-results-strip"><span class="inventory-live-dot"></span><span id="inventory-live-summary" aria-live="polite">Loading catalog results</span><span class="inventory-strip-note">Counts are shown with their units and minimum restock levels.</span></div><div id="inventory-results" aria-live="polite"></div>'+
      '<div class="inventory-field-guide"><div><span class="field-guide-mark">01</span><div><strong>Part number</strong><p>Use a consistent internal ID, manufacturer SKU, or other unique identifier. Keep it stable when an item is moved to another shelf.</p></div></div><div><span class="field-guide-mark">02</span><div><strong>Storage location</strong><p>Record the area, cabinet, shelf or drawer, and bin. Make the location specific enough that someone unfamiliar with the list can find the item without guessing.</p></div></div><div><span class="field-guide-mark">03</span><div><strong>Quantity & minimum</strong><p>Record the counted amount and the level that should trigger a restock review. Use a consistent unit such as pcs, sets, reels, or units.</p></div></div></div></section>'+
      '<aside class="inventory-maintenance-note"><span class="note-mark">i</span><div><strong>One shared source of truth.</strong><p>Records are stored centrally in Supabase, not in this browser. Use a consistent part number and verify physical counts before relying on quantities. This page listens for changes so the catalog can refresh automatically.</p></div></aside></div>';
  }

  function renderGradeProjectGallery(path, gradeKey) {
    const gradeLabels = {
      freshman: ["freshman", "grade9", "9th", "9thgrade", "9"],
      sophomore: ["sophomore", "grade10", "10th", "10thgrade", "10"],
      junior: ["junior", "grade11", "11th", "11thgrade", "11"],
      senior: ["senior", "grade12", "12th", "12thgrade", "12"]
    };
    const label = gradeKey.charAt(0).toUpperCase() + gradeKey.slice(1);
    const normalize = value => String(value == null ? "" : value).toLowerCase().replace(/[^a-z0-9]/g, "");
    const validLabels = gradeLabels[gradeKey] || [normalize(gradeKey)];
    const items = projects.filter(project => !project.template &&
      [project.gradeLevel, project.classYear, project.grade, project.year].some(value => validLabels.includes(normalize(value)))
    );
    const ready = items.length
      ? '<div class="project-grid">' + items.map(projectCard).join("") + '</div>'
      : '<div class="project-empty-by-grade"><strong>No ' + esc(label) + ' projects have been added yet.</strong>' +
        '<p>When a class project is documented and assigned to ' + esc(label) + ', it will appear here. Shared reusable circuit references are available in Schematics.</p>' +
        '<a class="text-link" href="#/schematics/common">Browse common circuits ↗</a></div>';
    const countText = items.length + (items.length === 1 ? " PROJECT" : " PROJECTS");
    return '<div class="page-shell">' + breadcrumbs(path) +
      '<header class="page-intro"><div><p class="eyebrow">PROJECTS / ' + esc(label.toUpperCase()) + '</p><h1>' + esc(label) + ' project list</h1>' +
      '<p>Class projects and student builds assigned to this year. Complete design records and tutorials remain with each project; generic circuit references live in Schematics.</p></div><span class="count-label">' + countText + '</span></header>' +
      ready + '</div>';
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
    if (!steps || !steps.length) {
      return '<div class="empty-state"><strong>Build instructions have not been added.</strong><p>Add step objects to the <code>steps</code> array in data/projects.js.</p></div>';
    }
    return '<ol class="steps-list">' + steps.map((step, index) =>
      '<li class="build-step"><span class="step-number">' + String(index + 1).padStart(2, "0") + '</span><div class="step-body">' +
      '<p class="step-kicker">BUILD STEP ' + String(index + 1).padStart(2, "0") + '</p><h3>' +
      esc(step.title || "Step " + (index + 1)) + '</h3><p class="step-instructions">' + esc(step.description || "") + '</p>' +
      ((step.why || step.check) ? '<div class="step-guidance">' +
        (step.why ? '<div class="step-guidance-item"><span>WHY IT MATTERS</span><p>' + esc(step.why) + '</p></div>' : '') +
        (step.check ? '<div class="step-guidance-item step-check"><span>CHECK BEFORE MOVING ON</span><p>' + esc(step.check) + '</p></div>' : '') +
        '</div>' : '') +
      (step.image ? '<img src="' + esc(step.image) + '" alt="' + esc(step.imageAlt || step.title || "") + '" loading="lazy">' : "") +
      '</div></li>').join("") + '</ol>';
  }

  function projectDesignProcess(items) {
    if (!items || !items.length) {
      items = [
        { title: "Define the goal", description: "Write down what the finished project should do and the constraints it must meet." },
        { title: "Plan the design", description: "Choose a circuit or construction approach and record the important connections." },
        { title: "Review the parts", description: "Check ratings, dimensions, pinouts, polarity, and the tools required." },
        { title: "Build and verify", description: "Prototype carefully, test the result, and revise the design if needed." }
      ];
    }
    return '<div class="process-grid">' + items.map((item, index) =>
      '<article class="process-card"><div class="process-card-top"><span>' + String(index + 1).padStart(2, "0") + '</span><span class="process-card-line"></span></div>' +
      '<h3>' + esc(item.title || "Design stage " + (index + 1)) + '</h3><p>' + esc(item.description || "") + '</p></article>'
    ).join("") + '</div>';
  }

  function projectVerification(items) {
    if (!items || !items.length) {
      return '<div class="empty-state"><strong>Verification checks have not been added.</strong><p>Add a <code>verification</code> array in data/projects.js to explain the expected result and how to measure it.</p></div>';
    }
    return '<div class="verification-list">' + items.map((item, index) =>
      '<article class="verification-item"><span class="verification-icon">' + String(index + 1).padStart(2, "0") + '</span><div><h3>' +
      esc(item.title || "Check " + (index + 1)) + '</h3><p>' + esc(item.description || "") + '</p></div></article>'
    ).join("") + '</div>';
  }

  function projectTroubleshooting(items) {
    if (!items || !items.length) {
      return '<div class="empty-state"><strong>No troubleshooting notes yet.</strong><p>Add problem, cause, and fix entries to the <code>troubleshooting</code> array in data/projects.js.</p></div>';
    }
    return '<div class="troubleshooting-list">' + items.map(item =>
      '<article class="troubleshooting-item"><h3>' + esc(item.problem || "Problem to check") + '</h3>' +
      (item.cause ? '<p><span>Possible cause</span>' + esc(item.cause) + '</p>' : '') +
      (item.fix ? '<p><span>What to try</span>' + esc(item.fix) + '</p>' : '') +
      '</article>'
    ).join("") + '</div>';
  }

  function projectGalleryImages(gallery) {
    if (!gallery || !gallery.length) return '<p class="muted-note">No gallery photos are available for this project yet.</p>';
    return '<div class="photo-gallery">' + gallery.map(photo =>
      '<figure><a href="' + esc(photo.image) + '" target="_blank" rel="noopener"><img src="' + esc(photo.image) + '" alt="' + esc(photo.alt || "") + '" loading="lazy"></a>' +
      (photo.caption ? '<figcaption>' + esc(photo.caption) + '</figcaption>' : "") + '</figure>').join("") + '</div>';
  }

  function projectFiles(files) {
    if (!files || !files.length) return '<p class="muted-note">No datasheets or external references have been added yet.</p>';
    return '<div class="file-list">' + files.map(file =>
      '<a class="file-row" href="' + esc(file.href || "#") + '" target="_blank" rel="noopener"><span class="file-icon">↗</span>' +
      '<span class="file-copy"><strong>' + esc(file.label || "Project reference") + '</strong><small>' + esc(file.description || "") + '</small></span><span class="file-arrow">↗</span></a>'
    ).join("") + '</div>';
  }

  function renderProjectDetail(project, path) {
    const image = project.featuredImage || "assets/images/project.png";
    const schematic = project.schematicImage || "";
    const facts = (project.facts || []).length
      ? '<div class="project-facts">' + project.facts.map(fact =>
          '<div class="project-fact"><span>' + esc(fact.label) + '</span><strong>' + esc(fact.value) + '</strong></div>'
        ).join("") + '</div>'
      : "";
    const principle = project.principle
      ? '<aside class="principle-panel"><p class="principle-label">THE CORE IDEA</p><h3>' + esc(project.principle.title || "How it works") + '</h3><p>' + esc(project.principle.text || "") + '</p>' +
        (project.principle.formula ? '<code>' + esc(project.principle.formula) + '</code>' : "") + '</aside>'
      : "";
    const objectives = (project.objectives && project.objectives.length)
      ? '<div class="learning-panel"><h3>What you will learn</h3>' + bulletList(project.objectives, "Learning goals have not been listed.") + '</div>'
      : "";
    const notice = project.template ? callout({title:"Project template",text:"A reusable project-page layout. Replace the example text and arrays in data/projects.js."},"template-notice") : "";
    const navLinks = [
      ["brief","Project brief"],["design-process","Design process"],["schematic","Schematic"],
      ["materials","Parts & tools"],["build-steps","Build steps"],["verification","Test & troubleshoot"],
      ["references","References"],["gallery","Gallery"]
    ];
    return '<div class="page-shell project-page">' + breadcrumbs(path, project) + notice +
      '<header class="project-hero"><div class="project-hero-copy"><p class="eyebrow">' + esc(project.grade || "SHOP PROJECT") + ' / ' + esc(project.category || "BUILD") + '</p>' +
      '<h1>' + esc(project.title) + '</h1><p class="project-summary">' + esc(project.summary || "") + '</p>' +
      '<div class="project-tags"><span>' + esc(project.status || "Project") + '</span><span>' + esc(project.grade || "General") + '</span><span>' + esc(project.category || "Build") + '</span></div>' +
      '<a class="button button-accent project-start-link" href="#build-steps">Go to build instructions <span>↓</span></a></div>' +
      '<div class="project-hero-image"><img class="project-cover" src="' + esc(image) + '" alt="' + esc(project.featuredImageAlt || project.title) + '"><span class="image-corner-label">PROJECT FILE / ' + esc(project.slug.toUpperCase()) + '</span></div></header>' +
      facts +
      '<div class="project-roadmap"><div class="roadmap-heading"><span class="roadmap-pulse"></span><span>HOW TO USE THIS PAGE</span><small>PLAN → BUILD → CHECK</small></div>' +
      '<nav class="project-jump-nav" aria-label="Jump to project section">' + navLinks.map((link,index) =>
        '<a href="#' + link[0] + '"><span>' + String(index + 1).padStart(2, "0") + '</span>' + link[1] + '</a>'
      ).join("") + '</nav></div>' +
      '<section class="project-section" id="brief"><div class="project-section-heading"><span class="section-num">01</span><div><p class="section-overline">START HERE</p><h2>Project brief</h2><p>Understand what you are making before touching the parts.</p></div></div>' +
      '<div class="brief-grid"><div class="project-description"><p>' + esc(project.description || "Project details have not been added yet.") + '</p>' + objectives + '</div>' + principle + '</div></section>' +
      '<section class="project-section" id="design-process"><div class="project-section-heading"><span class="section-num">02</span><div><p class="section-overline">THINK IT THROUGH</p><h2>Design process</h2><p>The decisions to make before the physical build begins.</p></div></div>' +
      projectDesignProcess(project.designProcess) + '<p class="section-hint">Use this section to explain the reasoning and planning. The numbered build instructions below cover the actual assembly.</p></section>' +
      '<section class="project-section" id="schematic"><div class="project-section-heading"><span class="section-num">03</span><div><p class="section-overline">READ THE DRAWING</p><h2>Schematic</h2><p>Use the diagram as the connection map while you work.</p></div></div>' +
      '<div class="schematic-layout">' + (schematic
        ? '<a class="schematic-preview" href="' + esc(schematic) + '" target="_blank" rel="noopener"><img src="' + esc(schematic) + '" alt="' + esc(project.schematicAlt || "Project schematic") + '" loading="lazy"><span>Open full-size schematic ↗</span></a>'
        : '<div class="schematic-placeholder">A schematic has not been added to this project yet.</div>') +
      '<aside class="diagram-notes"><h3>How to use the drawing</h3><p>Follow one connection at a time. Match component labels and values, and trace each path to its power rail or ground.</p><p>Do not power the circuit while you are still moving wires or checking connections.</p></aside></div></section>' +
      '<section class="project-section" id="materials"><div class="project-section-heading"><span class="section-num">04</span><div><p class="section-overline">GET READY</p><h2>Parts & tools</h2><p>Collect the listed components before you start wiring.</p></div></div>' +
      '<div class="requirements-grid"><div class="detail-panel"><div class="panel-heading"><span class="panel-icon">01</span><h3>Materials / parts</h3></div>' +
      bulletList(project.materials,"No parts list has been added yet.") + '</div><div class="detail-panel"><div class="panel-heading"><span class="panel-icon">02</span><h3>Tools / equipment</h3></div>' +
      bulletList(project.tools,"No tool list has been added yet.") + '</div></div></section>' +
      '<section class="project-section project-build-section" id="build-steps"><div class="project-section-heading"><span class="section-num">05</span><div><p class="section-overline">ASSEMBLE IN ORDER</p><h2>Build instructions</h2><p>Complete each step, then use its check to confirm the circuit is ready for the next one.</p></div></div>' +
      '<div class="build-safety-note"><span class="safety-note-icon">!</span><p><strong>Before you change a connection:</strong> disconnect the power supply. For these examples, use low-voltage DC only.</p></div>' +
      projectSteps(project.steps) + '</section>' +
      '<section class="project-section" id="verification"><div class="project-section-heading"><span class="section-num">06</span><div><p class="section-overline">PROVE IT WORKS</p><h2>Test & troubleshoot</h2><p>Compare your result with the expected behavior before changing the design.</p></div></div>' +
      '<div class="verification-panel"><div class="verification-heading"><span>✓</span><div><h3>Verification checklist</h3><p>What should happen and what to measure.</p></div></div>' + projectVerification(project.verification) + '</div>' +
      '<div class="troubleshooting-heading"><h3>Something is not working?</h3><p>Disconnect power first, then check one possible cause at a time.</p></div>' +
      projectTroubleshooting(project.troubleshooting) + '</section>' +
      '<section class="project-section" id="references"><div class="project-section-heading"><span class="section-num">07</span><div><p class="section-overline">LOOK UP THE DETAILS</p><h2>References & datasheets</h2><p>Use manufacturer documents to confirm the exact part ratings and pinout.</p></div></div>' +
      '<div class="detail-panel references-panel">' + projectFiles(project.files) + '</div></section>' +
      '<section class="project-section" id="gallery"><div class="project-section-heading"><span class="section-num">08</span><div><p class="section-overline">VISUAL NOTES</p><h2>Project gallery</h2><p>Diagrams, photos, and supporting visuals.</p></div></div>' + projectGalleryImages(project.gallery) + '</section>' + contentVideoBlock(project, project.title + ' project video') +
      (project.notes ? '<aside class="project-notes"><span class="note-mark">i</span><div><strong>Notes & limitations</strong><p>' + esc(project.notes) + '</p></div></aside>' : "") +
      '<div class="return-row"><a class="button button-outline" href="#/projects">← Back to projects</a><a class="text-link" href="#/projects">Browse another project ↗</a></div></div>';
  }

  function renderSpotlightCard(item) {
    const image = item.featuredImage || "assets/images/workshop-banner.png";
    const tags = (item.tags || []).slice(0, 3);
    return '<a class="spotlight-card" href="' + href(spotlightPath(item)) + '">' +
      '<div class="spotlight-card-image"><img src="' + esc(image) + '" alt="' + esc(item.featuredImageAlt || item.title) + '" loading="lazy"></div>' +
      '<div class="spotlight-card-copy"><p class="section-overline">' + esc(item.category || "CREATOR SHOWCASE") + '</p>' +
      '<h2>' + esc(item.title) + '</h2><p class="spotlight-card-creator">By ' + esc(item.creatorName || "Contributor credit pending") + '</p>' +
      '<p>' + esc(item.summary || "") + '</p>' +
      (tags.length ? '<div class="spotlight-tags">' + tags.map(tag => '<span>' + esc(tag) + '</span>').join("") + '</div>' : '') +
      '<span class="spotlight-card-link">View creation and details <b>↗</b></span></div></a>';
  }
  function renderSpotlightGallery(path) {
    const items = publishedSpotlights().slice().sort((a,b) => String(b.dateLabel || "").localeCompare(String(a.dateLabel || "")));
    const body = items.length
      ? '<div class="spotlight-grid">' + items.map(renderSpotlightCard).join("") + '</div>'
      : '<section class="spotlight-empty-state"><div class="spotlight-empty-kicker">CREATOR SHOWCASE</div><h2>No spotlights published yet.</h2><p>This collection is for completed creations, useful tools, thoughtful designs, and contributions that deserve recognition. Each entry will credit its creator and include the story, highlights, photos, and a video when one is available.</p><p>Spotlights are separate from build guides: this page celebrates the result and its contribution, rather than publishing step-by-step assembly instructions.</p></section>';
    return '<div class="page-shell spotlight-index-page">' + breadcrumbs(path) +
      '<header class="page-intro"><div><p class="eyebrow">CREATOR SHOWCASE</p><h1>Spotlights</h1><p>Student-built creations and useful technical contributions—presented with creator credit, context, results, and media.</p></div><span class="count-label">' + items.length + (items.length === 1 ? ' SHOWCASE' : ' SHOWCASES') + '</span></header>' +
      body + '</div>';
  }
  function renderSpotlightDetail(item) {
    const image = item.featuredImage || "assets/images/workshop-banner.png";
    const gallery = (item.gallery || []).filter(media => media && media.image).map(media =>
      '<figure class="spotlight-gallery-item"><img src="' + esc(media.image) + '" alt="' + esc(media.alt || item.title) + '" loading="lazy">' +
      (media.caption ? '<figcaption>' + esc(media.caption) + '</figcaption>' : '') + '</figure>').join("");
    const facts = [
      item.creatorName ? {label:"Creator",value:item.creatorName} : null,
      item.classYear ? {label:"Class / year",value:item.classYear} : null,
      item.category ? {label:"Category",value:item.category} : null,
      item.dateLabel ? {label:"Published",value:item.dateLabel} : null
    ].filter(Boolean);
    const factMarkup = facts.length ? '<dl class="spotlight-facts">' + facts.map(f =>
      '<div><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>').join("") + '</dl>' : '';
    const highlights = (item.highlights || []).filter(Boolean);
    const highlightsMarkup = highlights.length ? '<section class="spotlight-block"><div class="spotlight-block-heading"><p class="section-overline">HIGHLIGHTS</p><h2>What stands out</h2></div><ul class="spotlight-highlights">' +
      highlights.map(point => '<li>' + esc(point) + '</li>').join("") + '</ul></section>' : "";
    const storyMarkup = item.story ? '<section class="spotlight-block"><div class="spotlight-block-heading"><p class="section-overline">THE STORY</p><h2>About the creation</h2></div><p>' + esc(item.story) + '</p></section>' : "";
    const contributionMarkup = item.contribution ? '<section class="spotlight-block"><div class="spotlight-block-heading"><p class="section-overline">WHY IT MATTERS</p><h2>Contribution</h2></div><p>' + esc(item.contribution) + '</p></section>' : "";
    const tags = (item.tags || []).length ? '<div class="spotlight-tags">' + item.tags.map(tag => '<span>' + esc(tag) + '</span>').join("") + '</div>' : "";
    return '<div class="page-shell spotlight-detail-page">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/spotlights">Spotlights</a><span>/</span><span aria-current="page">' + esc(item.title) + '</span></nav>' +
      '<header class="spotlight-detail-hero"><div class="spotlight-detail-copy"><p class="eyebrow">' + esc(item.category || "CREATOR SPOTLIGHT") + '</p>' +
      '<h1>' + esc(item.title) + '</h1><p class="spotlight-detail-byline">Created by <strong>' + esc(item.creatorName || "Contributor credit pending") + '</strong>' +
      (item.classYear ? '<span> · ' + esc(item.classYear) + '</span>' : '') + '</p>' +
      '<p class="spotlight-detail-summary">' + esc(item.summary || "") + '</p>' + factMarkup + tags +
      '</div><figure class="spotlight-detail-image"><img src="' + esc(image) + '" alt="' + esc(item.featuredImageAlt || item.title) + '">' +
      (item.featuredCaption ? '<figcaption>' + esc(item.featuredCaption) + '</figcaption>' : '') + '</figure></header>' +
      '<div class="spotlight-content">' + storyMarkup + contributionMarkup + highlightsMarkup +
      (gallery ? '<section class="spotlight-block"><div class="spotlight-block-heading"><p class="section-overline">GALLERY</p><h2>More views</h2></div><div class="spotlight-gallery">' + gallery + '</div></section>' : '') +
      contentVideoBlock(item, item.title + " — creator spotlight") +
      '</div><div class="spotlight-return"><a class="text-link" href="#/spotlights">← Back to all spotlights</a></div></div>';
  }

  function renderSchematicLibrary(path) {
    const rows = siteContent
      .filter(row => row.content_type === "schematic" && (row.published === true || isActiveAdmin()))
      .slice()
      .sort((a,b) => String(a.title).localeCompare(String(b.title)));
    const body = rows.length
      ? '<div class="schematic-content-list">' + rows.map(row => {
          const data = row.content || {};
          const image = data.featuredImage || data.schematicImage || "assets/images/schematic.png";
          const description = data.summary || data.description || "";
          return '<article class="schematic-content-row"><a class="schematic-content-image" href="' + href("/schematics/" + row.slug) + '"><img src="' + esc(image) + '" alt="' + esc(data.featuredImageAlt || data.schematicAlt || row.title) + '" loading="lazy"></a>' +
            '<div class="schematic-content-copy"><p class="section-overline">' + esc(data.category || "SHARED CIRCUIT REFERENCE") + '</p><h2><a href="' + href("/schematics/" + row.slug) + '">' + esc(row.title) + '</a></h2><p>' + esc(description) + '</p>' +
            '<a class="text-link" href="' + href("/schematics/" + row.slug) + '">Open schematic <span aria-hidden="true">↗</span></a></div>' +
            (isActiveAdmin() && row.published !== true ? '<span class="content-state-draft">Draft · admin only</span>' : '') +
            '</article>';
        }).join("") + '</div>'
      : '<div class="schematic-content-empty"><h2>Common circuit references</h2><p>These reusable examples remain available while the editable schematic collection is being set up. Administrators can select “Import current references” in the account console, then update drawings, notes, and video from the content manager.</p>' +
        contentCards((basePages["/schematics"] && basePages["/schematics"].cards) || []) + '</div>';
    return '<div class="page-shell schematic-library-page">' + breadcrumbs(path) +
      '<header class="page-intro"><div><p class="eyebrow">SHARED CIRCUIT LIBRARY</p><h1>Schematics</h1><p>Reusable circuit drawings and design notes used across classes. Each schematic focuses on the circuit purpose and how to read the drawing; full materials lists, assembly, and verification procedures belong in the companion project guides.</p></div>' +
      '<span class="count-label">' + rows.length + (rows.length === 1 ? ' SCHEMATIC' : ' SCHEMATICS') + '</span></header>' +
      body + '</div>';
  }

  function renderPage(path) {
    const page = pages[path];
    if (!page) return '<div class="page-shell">' + breadcrumbs(path) + '<header class="page-intro"><div><p class="eyebrow">404 / NOT FOUND</p><h1>Page not found</h1><p>This page is not available. Check the navigation or return to the home page.</p><a class="button button-outline" href="#/">Return home</a></div></header></div>';
    const content = sectionMarkup(page.sections) + childCards(path) + contentCards(page.cards) + callout(page.callout);
    const media = page._contentType === "schematic" ? contentVideoBlock(page, page.title + " video") : "";
    const empty = content ? "" : '<div class="empty-state"><strong>This section is still taking shape.</strong><p>Class notes, drawings, and reference files will appear here when available.</p></div>';
    return '<div class="page-shell">' + breadcrumbs(path) + '<header class="page-intro"><div><p class="eyebrow">' + esc(page.eyebrow || "Electronics library") + '</p><h1>' +
      esc(page.title || (navItem(path) || {}).label || "Electronics") + '</h1><p>' + esc(page.description || "") + '</p></div></header>' +
      '<div class="page-content">' + content + media + empty + '</div></div>';
  }

  function setSidebarOpen(open) {
    if (sidebar) sidebar.classList.toggle("is-open", open);
    if (sidebarBackdrop) sidebarBackdrop.hidden = !open;
    document.body.classList.toggle("sidebar-open", open);
    if (menuButton) menuButton.setAttribute("aria-expanded", String(open));
  }

  function render() {
    const path = pathNow();
    const project = projectFor(path);
    const spotlight = spotlightFor(path);
    renderTop(path);
    renderContext(path, project, spotlight);
    const gradeProjectMatch = path.match(/^\/projects\/(freshman|sophomore|junior|senior)\/projects$/);
    const output = path === "/" ? renderHome()
      : path === "/inventory" ? renderInventory(path)
      : path === "/account" ? renderAccountPage(path)
      : path === "/spotlights" ? renderSpotlightGallery(path)
      : path === "/schematics" ? renderSchematicLibrary(path)
      : path === "/projects" ? renderPage(path)
      : gradeProjectMatch ? renderGradeProjectGallery(path, gradeProjectMatch[1])
      : spotlight ? renderSpotlightDetail(spotlight)
      : project ? renderProjectDetail(project, path)
      : renderPage(path);
    app.innerHTML = '<div class="route-view">' + output + '</div>';
    app.classList.remove("is-entering");
    void app.offsetWidth;
    app.classList.add("is-entering");
    if (path === "/inventory") updateInventoryResults();
    updateAccountLink();
    const page = pages[path];
    document.title = (spotlight ? spotlight.title : project ? project.title : path === "/account" ? "Account" : path === "/inventory" ? "Inventory" : page ? page.title : path === "/" ? "Home" : "Electronics") + " — " + (cfg.brand || "Electronics");
    setSidebarOpen(false);
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
    const spotlightResults = publishedSpotlights().filter(item =>
      [item.title, item.creatorName, item.category, item.summary, item.story, item.contribution, ...(item.highlights || []), ...(item.tags || [])].join(" ").toLowerCase().includes(q)
    ).map(item => ({path:spotlightPath(item),title:"Spotlight · " + item.title,description:item.summary || item.contribution || "Creator showcase"}));
    const inventoryResults = inventory.filter(item => {
      const loc = item.location || {};
      return [item.id,item.partNumber,item.name,item.manufacturer,item.category,item.description,inventoryLocation(item),loc.area,loc.cabinet,loc.shelf,loc.bin,item.notes,item.supplier].join(" ").toLowerCase().includes(q);
    }).slice(0,4).map(item => ({path:"/inventory",title:"Inventory · " + (item.name || item.partNumber),description:(item.partNumber || item.id) + " · " + inventoryArea(item) + " · " + inventoryStock(item).label}));
    const matches = navResults.concat(projectResults,spotlightResults,inventoryResults).filter((item,index,list) => list.findIndex(other => other.path === item.path && other.title === item.title) === index).slice(0,8);
    results.innerHTML = '<div class="search-results-heading">Search results</div>' + (matches.length
      ? matches.map(item => '<a href="' + href(item.path) + '"><strong>' + esc(item.title) + '</strong><small>' + esc(item.description) + '</small></a>').join("")
      : '<div class="search-empty">No results. Try “schematics”, “projects”, or “safety”.</div>');
    results.hidden = false;
  }

  setTheme();
  applyColorMode(savedColorMode(), false);
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextMode = document.body.dataset.theme === "dark" ? "light" : "dark";
      applyColorMode(nextMode, true);
    });
  }
  document.getElementById("brand-name").textContent = cfg.brand || "ELECTRONICS";
  document.getElementById("brand-tagline").textContent = cfg.tagline || "BAYPATH RVTHS";
  document.getElementById("footer-brand").textContent = cfg.brand || "ELECTRONICS";
  document.getElementById("footer-school").textContent = cfg.schoolName || "Electronics";
  document.getElementById("footer-year").textContent = "© " + new Date().getFullYear();

  app.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const destination = link.getAttribute("href");
    if (!destination || destination.startsWith("#/")) return;
    const target = document.getElementById(destination.slice(1));
    if (!target) return;
    event.preventDefault();
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  });

  menuButton.addEventListener("click", () => {
    setSidebarOpen(!sidebar.classList.contains("is-open"));
  });
  if (sidebarClose) sidebarClose.addEventListener("click", () => setSidebarOpen(false));
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
  topNav.addEventListener("click", event => {
    if (event.target.closest("a")) setSidebarOpen(false);
  });
  app.addEventListener("click", event => {
    const jump = event.target.closest('a[href^="#"]');
    if (!jump) return;
    const destination = jump.getAttribute("href");
    if (!destination || destination.startsWith("#/")) return;
    const target = document.getElementById(destination.slice(1));
    if (!target) return;
    event.preventDefault();
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({behavior:reduced ? "auto" : "smooth",block:"start"});
  });
  document.addEventListener("input", event => {
    if (event.target.id === "inventory-search") {
      inventoryState.query = event.target.value;
      inventoryState.page = 1;
      updateInventoryResults();
    }
  });
  document.addEventListener("change", event => {
    const id = event.target.id;
    if (id === "inventory-category") inventoryState.category = event.target.value;
    else if (id === "inventory-area") inventoryState.area = event.target.value;
    else if (id === "inventory-stock") inventoryState.stock = event.target.value;
    else if (id === "inventory-page-size") inventoryState.pageSize = Number(event.target.value);
    else return;
    inventoryState.page = 1;
    updateInventoryResults();
  });
  document.addEventListener("click", event => {
    const sort = event.target.closest("[data-inventory-sort]");
    if (sort) {
      const key = sort.getAttribute("data-inventory-sort");
      if (inventoryState.sortBy === key) inventoryState.sortDir = inventoryState.sortDir === "asc" ? "desc" : "asc";
      else { inventoryState.sortBy = key; inventoryState.sortDir = "asc"; }
      updateInventoryResults(); return;
    }
    if (event.target.closest("[data-inventory-prev]")) { inventoryState.page = Math.max(1,inventoryState.page-1); updateInventoryResults(); return; }
    if (event.target.closest("[data-inventory-next]")) { inventoryState.page += 1; updateInventoryResults(); return; }
    if (event.target.closest("[data-inventory-reset]")) {
      inventoryState.query = ""; inventoryState.category = "all"; inventoryState.area = "all"; inventoryState.stock = "all";
      inventoryState.sortBy = "name"; inventoryState.sortDir = "asc"; inventoryState.page = 1; inventoryState.pageSize = 50;
      const q = document.getElementById("inventory-search"); if (q) q.value = "";
      const category = document.getElementById("inventory-category"); if (category) category.value = "all";
      const area = document.getElementById("inventory-area"); if (area) area.value = "all";
      const stock = document.getElementById("inventory-stock"); if (stock) stock.value = "all";
      updateInventoryResults(); return;
    }
    if (event.target.closest("[data-inventory-export]")) inventoryExportCSV(inventoryMatches());
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


  async function submitSiteContentForm(event) {
    event.preventDefault();
    if (!supabaseClient || !isActiveAdmin()) { contentEditorMessage = "Only active administrators can edit site content."; render(); return; }
    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = true; button.textContent = "Saving content…"; }
    contentEditorMessage = "";
    const value = name => String(form.elements[name] && form.elements[name].value != null ? form.elements[name].value : "").trim();
    const slug = value("slug").toLowerCase();
    const title = value("title");
    const type = value("contentType");
    if (!title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      contentEditorMessage = "Enter a title and a URL slug using lowercase letters, numbers, and hyphens.";
      render(); return;
    }
    try {
      let featuredImage = value("featuredImage");
      let schematicImage = value("schematicImage");
      let videoUrl = value("videoUrl");
      let videoId = videoIdFromValue(videoUrl);
      if (videoId) videoUrl = "";
      const featuredFile = form.elements.featuredFile && form.elements.featuredFile.files[0];
      const schematicFile = form.elements.schematicFile && form.elements.schematicFile.files[0];
      const videoFile = form.elements.videoFile && form.elements.videoFile.files[0];
      if (featuredFile) featuredImage = await uploadSiteMedia(featuredFile, type, slug, "cover");
      if (schematicFile) schematicImage = await uploadSiteMedia(schematicFile, type, slug, "schematic");
      if (videoFile) { videoUrl = await uploadSiteMedia(videoFile, type, slug, "video"); videoId = ""; }
      let gallery = textToRows(value("gallery"), ["image", "alt", "caption"]);
      const galleryFiles = form.elements.galleryFiles ? Array.from(form.elements.galleryFiles.files || []) : [];
      if (galleryFiles.length > 8) throw new Error("Upload no more than 8 gallery images at once.");
      for (const file of galleryFiles) {
        const uploaded = await uploadSiteMedia(file, type, slug, "gallery");
        gallery.push({ image: uploaded, alt: file.name, caption: "" });
      }
      const summary = value("summary");
      const description = value("description");
      const category = value("category");
      const gradeLevel = value("gradeLevel");
      const status = value("status");
      const common = {
        summary, description, category, status, featuredImage, featuredImageAlt: value("featuredImageAlt"),
        schematicImage, schematicAlt: value("schematicAlt"), videoId, videoUrl, gallery,
        tags: textToLines(value("tags")), notes: value("notes")
      };
      let content;
      if (type === "spotlight") {
        content = {
          ...common,
          creatorName: value("creatorName"),
          classYear: gradeLevel,
          dateLabel: status,
          story: value("story"),
          contribution: value("contribution"),
          highlights: textToLines(value("highlights"))
        };
      } else if (type === "project") {
        const principleTitle = value("principleTitle");
        const principleText = value("principleText");
        const principleFormula = value("principleFormula");
        content = {
          ...common,
          grade: gradeLevel || "Unassigned",
          gradeLevel,
          classYear: gradeLevel,
          featured: form.elements.featured.checked,
          facts: textToRows(value("facts"), ["label", "value"]),
          principle: principleTitle || principleText || principleFormula ? { title: principleTitle, text: principleText, formula: principleFormula } : null,
          objectives: textToLines(value("objectives")),
          designProcess: textToRows(value("designProcess"), ["title", "description"]),
          materials: textToRows(value("materials"), ["name", "quantity", "notes"]),
          tools: textToLines(value("tools")),
          steps: textToRows(value("steps"), ["title", "description", "why", "check"]),
          verification: textToRows(value("verification"), ["title", "description"]),
          troubleshooting: textToRows(value("troubleshooting"), ["problem", "cause", "fix"]),
          files: textToRows(value("files"), ["label", "href", "description"])
        };
      } else if (type === "schematic") {
        const sections = [];
        if (description || schematicImage) sections.push({ heading: "Schematic", text: description || summary, image: schematicImage || featuredImage, imageAlt: value("schematicAlt") || value("featuredImageAlt") || title });
        if (value("story")) sections.push({ heading: "Design notes", text: value("story") });
        content = {
          ...common,
          eyebrow: category || "Shared circuit reference",
          sections,
          relatedProjectSlug: value("relatedProjectSlug"),
          cards: value("relatedProjectSlug") ? [{
            title: "Related project guide",
            tag: "BUILD GUIDE",
            description: "Open the companion guide for parts, assembly steps, and verification.",
            image: featuredImage || schematicImage,
            imageAlt: value("featuredImageAlt") || title,
            path: "/projects/" + value("relatedProjectSlug"),
            linkLabel: "Open project guide"
          }] : []
        };
        content.featuredImage = featuredImage || schematicImage;
      } else {
        throw new Error("Choose a supported content type.");
      }
      const payload = {
        content_type: type,
        slug,
        title,
        content,
        published: Boolean(form.elements.published.checked),
        featured: type === "spotlight" && Boolean(form.elements.featured.checked),
        updated_by: signedInUser.id,
        updated_at: new Date().toISOString()
      };
      const id = value("contentId");
      let result;
      if (id) {
        result = await supabaseClient.from("site_content").update(payload).eq("id", id).select("*").single();
      } else {
        result = await supabaseClient.from("site_content").insert({ ...payload, created_by: signedInUser.id }).select("*").single();
      }
      if (result.error) throw result.error;
      contentEditorOpen = false;
      contentEditorRecord = null;
      contentEditorType = type;
      accountMessage = (payload.published ? "Content published." : "Draft saved.") + " Media and page content are stored centrally.";
      accountMessageKind = "success";
      await loadSiteContent(false);
      render();
    } catch (error) {
      contentEditorMessage = error && error.message ? error.message : "Could not save site content.";
      render();
    }
  }

  async function seedExistingReferenceContent() {
    if (!isActiveAdmin() || !supabaseClient) return;
    const have = new Set(siteContent.map(row => row.content_type + "|" + row.slug));
    const rows = [];
    for (const project of baseProjects) {
      if (!project.slug || have.has("project|" + project.slug)) continue;
      rows.push({
        content_type: "project", slug: project.slug, title: project.title,
        content: project, published: true, featured: false,
        created_by: signedInUser.id, updated_by: signedInUser.id
      });
    }
    const schematicDefinitions = [
      ["555-timer-led-flasher", "/schematics/555-timer-led-flasher", "assets/images/schematic-555-timer.png"],
      ["led-current-limiter", "/schematics/led-current-limiter", "assets/images/schematic-led-current.png"],
      ["npn-transistor-switch", "/schematics/npn-transistor-switch", "assets/images/schematic-transistor-switch.png"]
    ];
    for (const [slug, path, image] of schematicDefinitions) {
      if (have.has("schematic|" + slug)) continue;
      const page = basePages[path];
      if (!page) continue;
      const content = { ...page, slug, title: page.title || slug, featuredImage: image, schematicImage: image };
      rows.push({
        content_type: "schematic", slug, title: content.title,
        content, published: true, featured: false,
        created_by: signedInUser.id, updated_by: signedInUser.id
      });
    }
    if (!rows.length) {
      accountMessage = "The current reference records have already been imported.";
      accountMessageKind = "info";
      return;
    }
    const { error } = await supabaseClient.from("site_content").insert(rows);
    if (error) {
      accountMessage = error.message || "Could not import current references.";
      accountMessageKind = "error";
      return;
    }
    accountMessage = "Imported " + rows.length + " reference records. You can now edit and publish them here.";
    accountMessageKind = "success";
    await loadSiteContent(false);
    render();
  }

  document.addEventListener("submit", async event => {
    if (event.target.id === "site-content-form") { await submitSiteContentForm(event); return; }
    if(event.target.id === "finish-password-form"){
      event.preventDefault();
      if(!supabaseClient||!signedInUser||!authFlow){accountMessage="The secure setup session is missing. Reopen the invitation or request a fresh reset link.";accountMessageKind="error";render();return;}
      const form=event.target,password=form.elements.password.value;
      if(password.length<10){accountMessage="Use at least 10 characters for your password.";accountMessageKind="error";render();return;}
      if(password!==form.elements.confirmPassword.value){accountMessage="The passwords do not match.";accountMessageKind="error";render();return;}
      const button=form.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent="Saving password…";}
      const {error}=await supabaseClient.auth.updateUser({password});
      if(error){accountMessage=error.message||"Could not save the password.";accountMessageKind="error";render();return;}
      authFlow="";
      try{window.history.replaceState(null,"",location.pathname+"#/account");}catch(_){location.hash="#/account";}
      accountMessage="Password saved. Your account setup is complete.";accountMessageKind="success";
      const {data}=await supabaseClient.auth.getSession();
      await syncAuthSession(data&&data.session);
      return;
    }
    if(event.target.id==="password-reset-form"){
      event.preventDefault();
      if(!supabaseClient){accountMessage="Supabase is not available.";accountMessageKind="error";render();return;}
      const form=event.target,button=form.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent="Sending…";}
      const redirectTo=location.origin+location.pathname;
      const {error}=await supabaseClient.auth.resetPasswordForEmail(form.elements.email.value.trim(),{redirectTo});
      if(error){accountMessage=error.message||"Could not send the reset link.";accountMessageKind="error";}
      else{accountMessage="If an account exists for that address, a password reset email has been sent.";accountMessageKind="success";}
      render();return;
    }
    if (event.target.id === "sign-in-form") {
      event.preventDefault();
      if(!supabaseClient){accountMessage="Supabase is not available.";accountMessageKind="error";render();return;}
      const form=event.target,button=form.querySelector('button[type="submit"]');
      if(button){button.disabled=true;button.textContent="Signing in…";}
      accountMessage="";
      const {error}=await supabaseClient.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});
      if(error){accountMessage=error.message||"Sign-in failed.";accountMessageKind="error";if(button){button.disabled=false;button.textContent="Sign in";}render();}
      else {accountMessage="Signed in. Loading account permissions…";accountMessageKind="info";render();}
      return;
    }
    if (event.target.id === "inventory-edit-form") {
      event.preventDefault();
      if(!supabaseClient||!signedInUser||!canEditInventory())return;
      const form=event.target,button=form.querySelector('button[type="submit"]'),msg=document.getElementById("inventory-editor-message");
      if(button){button.disabled=true;button.textContent="Saving…";}
      if(msg)msg.textContent="";
      const value=name=>String(form.elements[name]?.value??"").trim();
      const numberOrNull=name=>value(name)===""?null:Number(value(name));
      const payload={
        legacy_id:value("legacyId")||null,part_number:value("partNumber"),name:value("name"),manufacturer:value("manufacturer")||null,
        category:value("category"),description:value("description")||null,quantity:numberOrNull("quantity"),unit:value("unit")||"pcs",
        minimum_quantity:numberOrNull("minimumQuantity")??0,condition:value("condition")||null,supplier:value("supplier")||null,
        location_area:value("locationArea")||null,location_cabinet:value("locationCabinet")||null,location_shelf:value("locationShelf")||null,
        location_bin:value("locationBin")||null,datasheet:value("datasheet")||null,notes:value("notes")||null,updated_by:signedInUser.id
      };
      if(!payload.part_number||!payload.name||!payload.category){if(msg)msg.textContent="Part number, item name, and category are required.";if(button){button.disabled=false;button.textContent="Save inventory item";}return;}
      const dbId=value("dbId");
      const result=dbId
        ? await supabaseClient.from("inventory_items").update(payload).eq("id",dbId).select("id").maybeSingle()
        : await supabaseClient.from("inventory_items").insert({...payload,created_by:signedInUser.id,record_type:"verified"}).select("id").single();
      if(result.error){
        if(msg)msg.textContent=result.error.message||"Could not save this item.";
        if(button){button.disabled=false;button.textContent=dbId?"Save changes":"Save inventory item";}
        return;
      }
      await refreshDatabaseInventory();inventoryState.page=1;render();
      const panel=document.getElementById("inventory-editor-panel");if(panel)panel.hidden=true;
      return;
    }
    if (event.target.id === "admin-invite-form") {
      event.preventDefault();
      if(!supabaseClient||currentRole!=="admin")return;
      const form=event.target,button=form.querySelector('button[type="submit"]'),msg=document.getElementById("admin-invite-message");
      if(button){button.disabled=true;button.textContent="Sending invitation…";}
      if(msg)msg.textContent="";
      const {data,error}=await supabaseClient.functions.invoke("admin-users",{body:{
        action:"invite",email:form.elements.email.value.trim(),display_name:form.elements.displayName.value.trim(),role:form.elements.role.value
      }});
      if(error||(data&&data.error)){
        if(msg)msg.textContent=(data&&data.error)||error.message||"Could not send invitation.";
        if(button){button.disabled=false;button.textContent="Send invitation";}
      } else {
        if(msg)msg.textContent="Invitation sent to "+(data.user&&data.user.email||form.elements.email.value.trim())+".";
        form.reset();await loadAdminUsers();
        if(button){button.disabled=false;button.textContent="Send invitation";}
      }
      return;
    }
  });
  document.addEventListener("click", async event => {
    const resetToggle=event.target.closest("[data-password-reset-toggle]");
    if(resetToggle){
      const resetForm=document.getElementById("password-reset-form"),signInForm=document.getElementById("sign-in-form");
      if(resetForm){resetForm.hidden=!resetForm.hidden;if(!resetForm.hidden&&signInForm)resetForm.elements.email.value=signInForm.elements.email.value.trim();if(!resetForm.hidden)resetForm.elements.email.focus();}
      return;
    }
    const newContent = event.target.closest("[data-content-new]");
    if (newContent) {
      if (!isActiveAdmin()) return;
      contentEditorType = newContent.getAttribute("data-content-new") || "spotlight";
      contentEditorRecord = null;
      contentEditorMessage = "";
      contentEditorOpen = true;
      render();
      const editor = document.getElementById("site-content-editor");
      if (editor) editor.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const editContent = event.target.closest("[data-content-edit]");
    if (editContent) {
      if (!isActiveAdmin()) return;
      const id = editContent.getAttribute("data-content-edit");
      contentEditorRecord = siteContent.find(row => row.id === id) || null;
      if (!contentEditorRecord) { accountMessage = "This content record could not be found. Refresh the content list."; accountMessageKind = "error"; render(); return; }
      contentEditorType = contentEditorRecord.content_type;
      contentEditorMessage = "";
      contentEditorOpen = true;
      render();
      const editor = document.getElementById("site-content-editor");
      if (editor) editor.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (event.target.closest("[data-content-cancel]")) {
      contentEditorOpen = false; contentEditorRecord = null; contentEditorMessage = ""; render(); return;
    }
    if (event.target.closest("[data-content-seed]")) {
      if (!isActiveAdmin()) return;
      await seedExistingReferenceContent();
      return;
    }
    const deleteContent = event.target.closest("[data-content-delete]");
    if (deleteContent) {
      if (!isActiveAdmin()) return;
      const id = deleteContent.getAttribute("data-content-delete");
      const row = siteContent.find(item => item.id === id);
      if (!row || !window.confirm('Delete "' + row.title + '" from the site content? This cannot be undone.')) return;
      deleteContent.disabled = true;
      const { error } = await supabaseClient.from("site_content").delete().eq("id", id);
      if (error) { accountMessage = error.message || "Could not delete content."; accountMessageKind = "error"; render(); return; }
      contentEditorOpen = false; contentEditorRecord = null;
      accountMessage = "Content deleted."; accountMessageKind = "success";
      await loadSiteContent(false);
      render();
      return;
    }
    const add=event.target.closest("[data-inventory-add]");
    if(add){showInventoryEditor("");return;}
    const edit=event.target.closest("[data-inventory-edit]");
    if(edit){showInventoryEditor(edit.getAttribute("data-inventory-edit"));return;}
    if(event.target.closest("[data-inventory-editor-cancel]")){
      const panel=document.getElementById("inventory-editor-panel");if(panel)panel.hidden=true;return;
    }
    const del=event.target.closest("[data-inventory-delete]");
    if(del){
      if(!supabaseClient||!canDeleteInventory())return;
      const dbId=del.getAttribute("data-inventory-delete"),item=inventory.find(row=>row.dbId===dbId);
      if(!dbId||!window.confirm('Delete "'+(item?item.name:"this item")+'" from the inventory? This cannot be undone.'))return;
      del.disabled=true;
      const {error}=await supabaseClient.from("inventory_items").delete().eq("id",dbId);
      if(error){window.alert("Delete failed: "+error.message);del.disabled=false;return;}
      await refreshDatabaseInventory();inventoryState.page=1;render();return;
    }
    if(event.target.closest("[data-auth-signout]")){
      if(supabaseClient){const {error}=await supabaseClient.auth.signOut();if(error){accountMessage=error.message;accountMessageKind="error";render();return;}}
      accountMessage="Signed out.";accountMessageKind="info";location.hash="#/account";return;
    }
    if(event.target.closest("[data-inventory-retry]")){await refreshDatabaseInventory();render();return;}
    if(event.target.closest("[data-admin-users-refresh]")){await loadAdminUsers();return;}
    const saveRole=event.target.closest("[data-user-role-save]");
    if(saveRole){
      if(!supabaseClient||currentRole!=="admin")return;
      const id=saveRole.getAttribute("data-user-role-save");
      if(!id || id === (signedInUser && signedInUser.id)){window.alert("You cannot change your own role.");return;}
      const selector=Array.from(document.querySelectorAll("[data-user-role]")).find(el=>el.getAttribute("data-user-role")===id);
      if(!selector)return;
      saveRole.disabled=true;
      const {data,error}=await supabaseClient.functions.invoke("admin-users",{body:{action:"set_role",user_id:id,role:selector.value}});
      if(error||(data&&data.error)){window.alert((data&&data.error)||(error&&error.message)||"Could not update role.");saveRole.disabled=false;return;}
      accountMessage="User role updated.";accountMessageKind="info";await loadAdminUsers();render();return;
    }
    const activeToggle=event.target.closest("[data-user-active-toggle]");
    if(activeToggle){
      if(!supabaseClient||currentRole!=="admin"||!currentProfile||!currentProfile.is_active)return;
      const id=activeToggle.getAttribute("data-user-active-toggle"),active=activeToggle.getAttribute("data-next-active")==="true";
      const target=adminUsers.find(user=>user.id===id);
      if(!id)return;
      if(active && target && !target.email_confirmed){window.alert("This account must verify its email or accept its invitation before activation.");return;}
      if(!active && !window.confirm("Deactivate "+(target?target.email:"this account")+"? They will lose access to protected inventory changes and admin tools."))return;
      activeToggle.disabled=true;
      const {data,error}=await supabaseClient.functions.invoke("admin-users",{body:{action:"set_active",user_id:id,active}});
      if(error||(data&&data.error)){window.alert((data&&data.error)||(error&&error.message)||"Could not update account activation.");activeToggle.disabled=false;return;}
      accountMessage=active?"Account activated.":"Account deactivated.";accountMessageKind="success";
      await loadAdminUsers();render();return;
    }
    const deleteUser=event.target.closest("[data-user-delete]");
    if(deleteUser){
      if(!supabaseClient||currentRole!=="admin")return;
      const id=deleteUser.getAttribute("data-user-delete"),user=adminUsers.find(row=>row.id===id);
      if(!window.confirm("Remove "+(user?user.email:"this user")+"? Their sign-in account will be deleted."))return;
      deleteUser.disabled=true;
      const {data,error}=await supabaseClient.functions.invoke("admin-users",{body:{action:"delete_user",user_id:id}});
      if(error||(data&&data.error)){window.alert((data&&data.error)||(error&&error.message)||"Could not remove user.");deleteUser.disabled=false;return;}
      await loadAdminUsers();render();return;
    }
  });

  window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#/")) { render(); window.scrollTo(0, 0); results.hidden = true; }
  });
  render();
  initSupabase();
})();
