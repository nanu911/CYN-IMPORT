(function () {
  const $ = id => document.getElementById(id);
  const S = window.SITE;
  const ICONS = { "Electrónica": "📱", "Hogar": "🏠", "Accesorios": "👜", "Belleza": "💄", "Deportes": "⚽" };

  let products = [];
  let cat = "Todos";
  let term = "";
  let sort = "";

  /* ---------- textos de la config ---------- */
  document.title = S.name + " - Productos importados";
  $("year").textContent = new Date().getFullYear();
  $("site-name").textContent = S.name;
  $("tagline").textContent = S.tagline;
  $("horario").textContent = S.horario || "";
  if (S.barra) $("topbar").textContent = S.barra; else $("topbar").hidden = true;
  const wa = waLink("Hola " + S.name + ", quiero hacer una consulta.");
  ["wa-float", "wa-footer", "wa-contact"].forEach(id => { $(id).href = wa; });

  $("benefits").innerHTML = (S.beneficios || []).map(b =>
    '<div class="benefit"><span class="ic">' + esc(b.icono) + "</span><div><strong>" + esc(b.titulo) + "</strong><small>" + esc(b.detalle) + "</small></div></div>").join("");
  $("faq-list").innerHTML = (S.faq || []).map(f =>
    "<details><summary>" + esc(f.p) + "</summary><p>" + esc(f.r) + "</p></details>").join("");
  $("promo-title").textContent = S.ofertasTitulo || "🔥 Ofertas";
  $("promo-text").textContent = S.ofertasTexto || "";
  $("contact-list").innerHTML =
    "<li>💬 WhatsApp: +" + esc(S.whatsapp) + "</li>" +
    (S.email ? "<li>✉️ " + esc(S.email) + "</li>" : "") +
    (S.ciudad ? "<li>📍 " + esc(S.ciudad) + "</li>" : "");

  // Menú móvil
  $("burger").addEventListener("click", () => $("nav").classList.toggle("open"));
  $("nav").addEventListener("click", e => { if (e.target.closest("a")) $("nav").classList.remove("open"); });

  /* ---------- tarjetas ---------- */
  function card(p) {
    const color = safeColor(p.color);
    const img = safeImg(p.image);
    const hasOld = p.old_price && p.old_price > p.price;
    const off = hasOld ? '<span class="badge">-' + Math.round(100 - (p.price * 100) / p.old_price) + "%</span>" : "";
    const star = p.featured ? '<span class="badge star">⭐</span>' : "";
    const visual = img
      ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<span class="emoji">' + esc(p.emoji || "📦") + "</span>";
    const old = hasOld ? '<span class="old">' + money(p.old_price) + "</span>" : "";
    const cuotas = S.cuotas > 1
      ? '<small class="cuotas">' + S.cuotas + " cuotas de " + money(Math.round(p.price / S.cuotas)) + " sin interés</small>" : "";
    const btn = p.available !== false
      ? '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + esc(waLinkProduct(p)) + '">💬 Consultar por WhatsApp</a>'
      : '<button class="btn btn-disabled" disabled>Sin stock</button>';
    return '<article class="card"><div class="card-img" style="background:linear-gradient(135deg,' + color + ',#0b1220)">' +
      off + star + visual + '</div><div class="card-body"><span class="cat">' + esc(p.category) + "</span><h3>" + esc(p.name) +
      '</h3><p class="desc">' + esc(p.description) + '</p><div class="price"><strong>' + money(p.price) + "</strong>" + old + "</div>" +
      cuotas + btn + "</div></article>";
  }

  /* ---------- secciones ---------- */
  function renderHome() {
    const avail = products.filter(p => p.available !== false);

    // Categorías
    const counts = {};
    products.forEach(p => { if (p.category) (counts[p.category] = counts[p.category] || { n: 0, emoji: p.emoji }).n++; });
    const names = Object.keys(counts).sort((a, b) => a.localeCompare(b, "es"));
    $("cats").innerHTML = names.map(c =>
      '<button class="cat-card" data-c="' + esc(c) + '"><span class="ic">' + esc(ICONS[c] || counts[c].emoji || "📦") +
      "</span><strong>" + esc(c) + "</strong><br><small>" + counts[c].n + " producto" + (counts[c].n === 1 ? "" : "s") + "</small></button>").join("");
    $("sec-cats").hidden = !names.length;

    // Destacados
    const feat = avail.filter(p => p.featured).slice(0, 8);
    $("featured").innerHTML = feat.map(card).join("");
    $("sec-featured").hidden = !feat.length;

    // Ofertas
    const offers = avail.filter(p => p.old_price && p.old_price > p.price)
      .sort((a, b) => (b.old_price - b.price) / b.old_price - (a.old_price - a.price) / a.old_price).slice(0, 4);
    $("offers").innerHTML = offers.map(card).join("");
    $("ofertas").hidden = $("sec-promo").hidden = !offers.length;

    // Arte del hero con emojis de productos
    const arts = (feat.length ? feat : avail).slice(0, 6).map(p => p.emoji || "📦");
    $("hero-art").innerHTML = arts.map(e => "<div>" + esc(e) + "</div>").join("");
  }

  function renderChips() {
    const cats = ["Todos", ...new Set(products.map(p => p.category).filter(Boolean))];
    $("chips").innerHTML = cats.map(c => '<button class="chip' + (c === cat ? " on" : "") + '" data-c="' + esc(c) + '">' + esc(c) + "</button>").join("");
  }

  function renderGrid() {
    let list = products.filter(p =>
      (cat === "Todos" || p.category === cat) &&
      (!term || (p.name + " " + p.description + " " + p.category).toLowerCase().includes(term)));
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    $("grid").innerHTML = list.length ? list.map(card).join("")
      : '<div class="empty" style="grid-column:1/-1"><div class="big">🔎</div><p>No encontramos productos con ese filtro.</p></div>';
  }

  function setCat(c, scroll) {
    cat = c; renderChips(); renderGrid();
    if (scroll) $("productos").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- eventos ---------- */
  $("chips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setCat(b.dataset.c, false); });
  $("cats").addEventListener("click", e => { const b = e.target.closest(".cat-card"); if (b) setCat(b.dataset.c, true); });
  $("sort").addEventListener("change", e => { sort = e.target.value; renderGrid(); });
  $("q").addEventListener("input", e => { term = e.target.value.trim().toLowerCase(); renderGrid(); });
  $("search-form").addEventListener("submit", e => { e.preventDefault(); $("productos").scrollIntoView({ behavior: "smooth" }); });

  /* ---------- carga ---------- */
  fetch("products.json?v=" + Date.now())
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      products = (Array.isArray(data) ? data : []).filter(p => p && p.name);
      renderHome(); renderChips(); renderGrid();
    })
    .catch(() => { $("grid").innerHTML = '<div class="empty" style="grid-column:1/-1">No se pudieron cargar los productos.</div>'; });
})();
