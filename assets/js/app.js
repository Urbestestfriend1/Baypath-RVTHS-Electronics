(() => {
  "use strict";

  const cfg = window.SHOP_CONFIG || {};
  const navData = window.SHOP_NAVIGATION || [];
  const pages = window.SHOP_PAGES || {};
  const projects = window.SHOP_PROJECTS || [];
  const inventory = window.SHOP_INVENTORY || [];
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
    const exampleInventory = inventory.length && inventory.every(item => item.recordType === "example");
    const inventoryDescription = exampleInventory
      ? "A demonstration catalog showing how part numbers, categories, cabinet paths, minimum quantities, and notes can be organized. Replace the examples with verified shop records before using any quantities as a stock count."
      : "Search the shop catalog by part number, name, category, storage area, quantity, or notes. Filter the full list instead of paging through one enormous document.";
    const cards = (cfg.homeCards || []).map((card, index) =>
      '<a class="library-card library-card-' + (index + 1) + '" href="' + href(card.path) + '">' +
      '<div class="library-card-art"><img src="' + esc(card.image) + '" alt="' + esc(card.imageAlt || "") + '" loading="lazy"><span class="library-card-index">' + String(index + 1).padStart(2, "0") + '</span></div>' +
      '<div class="library-card-copy"><span class="library-card-eyebrow">' + esc(card.eyebrow || "LIBRARY") + '</span><h3>' + esc(card.title) + '</h3><p>' + esc(card.path === "/inventory" ? inventoryDescription : card.description || "") + '</p><span class="library-card-link">' + esc(card.linkLabel || "Open section") + '<b>↗</b></span></div></a>'
    ).join("");
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
      '<div class="hero-side-diagram"><img src="assets/images/schematic.svg" alt="" loading="lazy"></div>' +
      '<div class="hero-side-bottom"><span>LOOK IT UP</span><span>BUILD IT RIGHT</span><span>CHECK THE RESULT</span></div></div></header>' +
      '<section class="dashboard-metrics" aria-label="Library overview">' +
      '<div class="metric-card"><span class="metric-icon">◇</span><span class="metric-label">PROJECT LIBRARY</span><strong>' + projects.filter(p => !p.template).length.toString().padStart(2,"0") + '</strong><small>Reference builds and notes</small></div>' +
      '<div class="metric-card"><span class="metric-icon">▤</span><span class="metric-label">REFERENCE SECTIONS</span><strong>' + flatNav.filter(item => item.path !== "/" && item.path !== "/projects" && item.path !== "/inventory").length.toString().padStart(2,"0") + '</strong><small>Drawings, resources, and class pages</small></div>' +
      '<div class="metric-card metric-card-inventory"><span class="metric-icon">▦</span><span class="metric-label">INVENTORY CATALOG</span><strong>' + exampleCount.padStart(2,"0") + '</strong><small>' + (exampleInventory ? "Demonstration rows — not verified stock" : "Catalog line items") + '</small></div>' +
      '<div class="metric-card"><span class="metric-icon">⌁</span><span class="metric-label">PART CATEGORIES</span><strong>' + categoryCount.toString().padStart(2,"0") + '</strong><small>' + (exampleInventory ? "Example categories" : "Ways to narrow the catalog") + '</small></div>' +
      '</section>' +
      '<section class="dashboard-section"><div class="dashboard-section-heading"><div><p class="section-overline">THE WORKSPACE</p><h2>Go straight to what you need.</h2><p>Each section has a clear job. Drawings stay separate from assembly instructions, and inventory records stay separate from project write-ups.</p></div><span class="section-side-label">LIBRARY INDEX / 01</span></div>' +
      '<div class="library-grid">' + cards + '</div></section>' +
      '<section class="dashboard-section dashboard-project-section"><div class="dashboard-section-heading"><div><p class="section-overline">FROM THE PROJECT BENCH</p><h2>Build notes with a clear path.</h2><p>Start with the brief, understand the design choices, follow the assembly steps, then verify the finished circuit. Each reference build keeps its drawing, parts, procedure, and troubleshooting notes together.</p></div><a href="#/projects" class="text-link">View all projects ↗</a></div>' +
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
        (item.updatedAt?'<span class="inventory-updated">Updated '+esc(item.updatedAt)+'</span>':"")+'</td></tr>';
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
    const categories=inventoryCategories(),areas=inventoryAreas(),isExample=inventory.length>0&&inventory.every(item=>item.recordType==="example");
    const low=inventory.filter(x=>inventoryStock(x).key==="low").length,out=inventory.filter(x=>inventoryStock(x).key==="out").length;
    return '<div class="page-shell inventory-page">'+breadcrumbs(path)+
      '<header class="inventory-page-heading"><div><p class="eyebrow">INVENTORY / MASTER CATALOG</p><h1>Inventory<span class="heading-period">.</span></h1>'+
      '<p>A searchable, structured catalog for electronic components, wiring, hand tools, test equipment, consumables, and reusable shop assets. Search by the part you know, filter by where it lives, and sort the list to review quantities or identify records that need attention. As the catalog grows, filters narrow the full dataset while pagination keeps each view manageable.</p></div>'+
      '<div class="inventory-heading-side"><span class="inventory-heading-icon">▦</span><strong>MASTER STOCK LIST</strong><small>Part → Location → Quantity → Notes</small><a href="#inventory-catalog">Browse the catalog ↓</a></div></header>'+
      (isExample?'<aside class="inventory-demo-notice"><span class="demo-notice-icon">!</span><div><strong>Demonstration data — not verified Baypath stock</strong><p>The rows below are examples that show how the catalog works. Quantities, manufacturers, and storage locations are fictional sample values. Replace or remove these records in <code>data/inventory.js</code> before using the table to locate real parts or make purchasing decisions.</p></div></aside>':"")+
      '<section class="inventory-summary-grid" aria-label="Inventory summary"><div class="inventory-summary-card"><span>Catalog records</span><strong>'+inventory.length.toLocaleString("en-US")+'</strong><small>'+(isExample?"Example records loaded":"Records in the catalog")+'</small></div>'+
      '<div class="inventory-summary-card"><span>Categories</span><strong>'+categories.length.toString().padStart(2,"0")+'</strong><small>Types of item listed</small></div>'+
      '<div class="inventory-summary-card"><span>Low stock</span><strong>'+(isExample?"—":low.toLocaleString("en-US"))+'</strong><small>'+(isExample?"Demo count not real":"At or below minimum quantity")+'</small></div>'+
      '<div class="inventory-summary-card"><span>Out of stock</span><strong>'+(isExample?"—":out.toLocaleString("en-US"))+'</strong><small>'+(isExample?"Demo count not real":"Quantity recorded as zero")+'</small></div></section>'+
      '<section class="inventory-catalog" id="inventory-catalog"><div class="inventory-catalog-heading"><div><p class="section-overline">INVENTORY TABLE</p><h2>Find an item</h2><p>Use search or combine filters. Search checks part numbers, item names, manufacturers, categories, storage paths, descriptions, and notes.</p></div><div class="inventory-catalog-actions"><button type="button" class="button button-outline" data-inventory-reset>Reset filters</button><button type="button" class="button button-accent" data-inventory-export>Export CSV</button></div></div>'+
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
      '<aside class="inventory-maintenance-note"><span class="note-mark">i</span><div><strong>Keep counts trustworthy.</strong><p>This is a static catalog, so permanent changes are made in <code>data/inventory.js</code> and published with a GitHub commit. Search, filters, sorting, pagination, and CSV export work in the browser, but changing a displayed quantity does not write it back to GitHub. Periodic counts and a consistent part-number format keep the master list dependable.</p></div></aside></div>';
  }

  function renderProjectGallery(path) {
    const realCount = projects.filter(p => !p.template).length;
    const ready = projects.length
      ? '<div class="project-grid">' + projects.map(projectCard).join("") + '</div>'
      : '<div class="empty-projects"><div><strong>The project shelf is empty for now.</strong><p>Project write-ups will appear here as the class collection grows.</p></div></div>';
    const countText = realCount + (realCount === 1 ? " PROJECT" : " PROJECTS");
    return '<div class="page-shell">' + breadcrumbs(path) +
      '<header class="page-intro"><div><p class="eyebrow">PROJECT LIBRARY</p><h1>Projects</h1><p>Project pages separate the design plan, circuit drawing, parts, numbered build instructions, and test checklist.</p></div><span class="count-label">' + countText + '</span></header>' +
      ready + callout({title:"Inside each project",text:"Start with the design process, then follow the build instructions in order. Use the verification checklist to test the result and the datasheets to confirm part ratings."}) + '</div>';
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
    const image = project.featuredImage || "assets/images/project.svg";
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
      '<section class="project-section" id="gallery"><div class="project-section-heading"><span class="section-num">08</span><div><p class="section-overline">VISUAL NOTES</p><h2>Project gallery</h2><p>Diagrams, photos, and supporting visuals.</p></div></div>' + projectGalleryImages(project.gallery) + '</section>' +
      (project.notes ? '<aside class="project-notes"><span class="note-mark">i</span><div><strong>Notes & limitations</strong><p>' + esc(project.notes) + '</p></div></aside>' : "") +
      '<div class="return-row"><a class="button button-outline" href="#/projects">← Back to projects</a><a class="text-link" href="#/projects">Browse another project ↗</a></div></div>';
  }

  function renderPage(path) {
    if (path === "/projects") return renderProjectGallery(path);
    const page = pages[path];
    if (!page) return '<div class="page-shell">' + breadcrumbs(path) + '<header class="page-intro"><div><p class="eyebrow">404 / NOT FOUND</p><h1>Page not found</h1><p>This page is not available. Check the navigation or return to the home page.</p><a class="button button-outline" href="#/">Return home</a></div></header></div>';
    const content = sectionMarkup(page.sections) + childCards(path) + contentCards(page.cards) + callout(page.callout);
    const empty = content ? "" : '<div class="empty-state"><strong>This section is still taking shape.</strong><p>Class notes, drawings, and reference files will appear here when available.</p></div>';
    return '<div class="page-shell">' + breadcrumbs(path) + '<header class="page-intro"><div><p class="eyebrow">' + esc(page.eyebrow || "Electronics library") + '</p><h1>' +
      esc(page.title || (navItem(path) || {}).label || "Electronics") + '</h1><p>' + esc(page.description || "") + '</p></div></header>' +
      '<div class="page-content">' + content + empty + '</div></div>';
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
    renderTop(path);
    renderContext(path, project);
    const output = path === "/" ? renderHome() : path === "/inventory" ? renderInventory(path) : project ? renderProjectDetail(project, path) : renderPage(path);
    app.innerHTML = '<div class="route-view">' + output + '</div>';
    app.classList.remove("is-entering");
    void app.offsetWidth;
    app.classList.add("is-entering");
    if (path === "/inventory") updateInventoryResults();
    const page = pages[path];
    document.title = (project ? project.title : page ? page.title : path === "/" ? "Home" : "Electronics") + " — " + (cfg.brand || "Electronics");
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
    const inventoryResults = inventory.filter(item => {
      const loc = item.location || {};
      return [item.id,item.partNumber,item.name,item.manufacturer,item.category,item.description,inventoryLocation(item),loc.area,loc.cabinet,loc.shelf,loc.bin,item.notes,item.supplier].join(" ").toLowerCase().includes(q);
    }).slice(0,4).map(item => ({path:"/inventory",title:"Inventory · " + (item.name || item.partNumber),description:(item.partNumber || item.id) + " · " + inventoryArea(item) + " · " + inventoryStock(item).label}));
    const matches = navResults.concat(projectResults,inventoryResults).filter((item,index,list) => list.findIndex(other => other.path === item.path && other.title === item.title) === index).slice(0,8);
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
  window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#/")) { render(); window.scrollTo(0, 0); results.hidden = true; }
  });
  render();
})();
