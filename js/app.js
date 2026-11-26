(function () {
  const $ = id => document.getElementById(id);
  let products = [];
  let cat = "Todos";
  const PREFIX = "#producto-";
  const detail = $("detail");

  $("year").textContent = new Date().getFullYear();
  $("site-name").textContent = SITE.name;
  $("tagline").textContent = SITE.tagline;
  if ($("topbar")) $("topbar").textContent = SITE.barra || "";
  if ($("horario")) $("horario").textContent = SITE.horario || "";

  const waGeneral = waLink("Hola " + SITE.name + ", quiero hacer una consulta.");
  ["wa-float", "wa-contact", "wa-footer"].forEach(id => {
    if ($(id)) $(id).href = waGeneral;
  });

  // Menú celular
  if ($("burger") && $("nav")) {
    $("burger").addEventListener("click", () => $("nav").classList.toggle("open"));
    $("nav").addEventListener("click", e => {
      if (e.target.tagName === "A") $("nav").classList.remove("open");
    });
  }

  // Emojis decorativos del banner
  if ($("hero-art")) {
    $("hero-art").innerHTML = ["🎧", "⌚", "🔊", "🤖", "🎒", "🕶️"]
      .map(e => "<span>" + e + "</span>").join("");
  }

  // Bloque de Beneficios
  if ($("benefits") && Array.isArray(SITE.beneficios)) {
    $("benefits").innerHTML = SITE.beneficios.map(b =>
      '<div class="benefit-card"><div class="ico">' + esc(b.icono) +
      '</div><div><strong>' + esc(b.titulo) + '</strong><span>' + esc(b.detalle) + '</span></div></div>'
    ).join("");
  }

  // Bloque de Preguntas Frecuentes
  if ($("faq-list") && Array.isArray(SITE.faq)) {
    $("faq-list").innerHTML = SITE.faq.map(f =>
      '<details><summary>' + esc(f.p) + '</summary><p>' + esc(f.r) + '</p></details>'
    ).join("");
  }

  // Bloque de Contacto
  if ($("contact-list")) {
    const items = [];
    if (SITE.ciudad) items.push("📍 " + esc(SITE.ciudad));
    if (SITE.email) items.push("✉️ " + esc(SITE.email));
    if (SITE.whatsapp) items.push("📱 +" + esc(SITE.whatsapp));
    $("contact-list").innerHTML = items.map(i => "<li>" + i + "</li>").join("");
  }

  // Tarjeta de producto
  function card(p) {
    const color = safeColor(p.color);
    const img = safeImg(p.image);
    const off = p.old_price && p.old_price > p.price
      ? '<span class="badge">-' + Math.round(100 - (p.price * 100) / p.old_price) + "%</span>" : "";
    const star = p.featured ? '<span class="badge star">⭐ Destacado</span>' : "";
    const visual = img
      ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<span class="emoji">' + esc(p.emoji || "📦") + "</span>";
    const old = p.old_price && p.old_price > p.price ? '<span class="old">' + money(p.old_price) + "</span>" : "";
    const href = PREFIX + encodeURIComponent(p.id);
    const btn = p.available !== false
      ? '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + esc(waLinkProduct(p)) + '">💬 Consultar</a>'
      : '<span class="btn btn-off">Sin stock</span>';

    return '<article class="card"><a class="card-img" data-detail href="' + esc(href) + '" aria-label="Ver detalles de ' + esc(p.name) +
      '" style="background:linear-gradient(135deg,' + color + ',#0f172a)">' +
      off + star + visual + '</a><div class="card-body"><span class="cat">' + esc(p.category) + '</span><h3><a data-detail href="' + esc(href) + '">' + esc(p.name) +
      '</a></h3><p class="desc">' + esc(p.description) + '</p><div class="price"><strong>' + money(p.price) + '</strong>' + old +
      '</div><div class="card-actions"><a class="btn btn-detail" data-detail href="' + esc(href) + '">Ver detalles</a>' + btn + '</div></div></article>';
  }

  /* ---------- Detalle de producto ---------- */
  function detailHtml(p) {
    const img = safeImg(p.image);
    const hasOld = p.old_price && p.old_price > p.price;
    const visual = img
      ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + '">'
      : '<span class="emoji">' + esc(p.emoji || "📦") + "</span>";
    const bg = img ? "" : ' style="background:linear-gradient(135deg,' + safeColor(p.color) + ',#0f172a)"';
    const recargo = Number(SITE.recargoTransferencia) || 0;
    const transfer = Math.round(p.price * (1 + recargo / 100));
    const btn = p.available !== false
      ? '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + esc(waLinkProduct(p)) + '">💬 Consultar por WhatsApp</a>'
      : '<span class="btn btn-off">Sin stock</span>';

    return '<div class="detail-img"' + bg + '>' + visual + '</div><div class="detail-info">' +
      '<span class="cat">' + esc(p.category) + '</span><h2 id="detail-name">' + esc(p.name) + '</h2>' +
      '<div class="price"><strong>' + money(p.price) + '</strong>' +
      (hasOld ? '<span class="old">' + money(p.old_price) + '</span>' : "") + '</div>' +
      (p.description ? '<h3>Descripción</h3><p class="detail-desc">' + esc(p.description) + '</p>' : "") +
      '<ul class="detail-extra">' +
      '<li>💵 Efectivo: <strong>' + money(p.price) + '</strong></li>' +
      '<li>🏦 Transferencia' + (recargo ? " (+" + recargo + "%)" : "") + ': <strong>' + money(transfer) + '</strong></li>' +
      '<li>🚚 Envíos solo por zona, con costo mínimo adicional</li>' +
      '<li>🏠 Retiro en domicilio a coordinar</li>' +
      '</ul>' + btn + '</div>';
  }

  // Abre o cierra el detalle según la dirección (#producto-ID)
  function syncDetail() {
    const p = products.find(x => location.hash === PREFIX + encodeURIComponent(x.id));
    if (!p) {
      if (detail.open) detail.close();
      return;
    }
    $("detail-body").innerHTML = detailHtml(p);
    if (!detail.open) detail.showModal();
    $("detail-body").scrollTop = 0;
    document.documentElement.classList.add("modal-open");
  }

  document.addEventListener("click", e => {
    const link = e.target.closest("a[data-detail]");
    if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    history.pushState({ detail: true }, "", link.getAttribute("href"));
    syncDetail();
  });

  $("detail-close").addEventListener("click", () => detail.close());
  // Clic fuera de la ventana
  detail.addEventListener("click", e => { if (e.target === detail) detail.close(); });
  detail.addEventListener("close", () => {
    document.documentElement.classList.remove("modal-open");
    if (!location.hash.startsWith(PREFIX)) return;
    if (history.state && history.state.detail) history.back();
    else history.replaceState(null, "", location.pathname + location.search);
  });
  // Botón "atrás" del navegador o del celular
  window.addEventListener("popstate", syncDetail);

  function renderSections() {
    const catsMap = {};
    products.forEach(p => {
      if (!p.category) return;
      if (!catsMap[p.category]) catsMap[p.category] = { count: 0, emoji: p.emoji || "📦" };
      catsMap[p.category].count++;
    });
    const catNames = Object.keys(catsMap);
    if (catNames.length && $("sec-cats")) {
      $("sec-cats").hidden = false;
      $("cats").innerHTML = catNames.map(c =>
        '<button class="cat-box" data-c="' + esc(c) + '"><span class="c-ico">' + esc(catsMap[c].emoji) +
        '</span><strong>' + esc(c) + '</strong><small>' + catsMap[c].count + ' productos</small></button>'
      ).join("");
    }

    const feat = products.filter(p => p.featured && p.available !== false);
    if (feat.length && $("sec-featured")) {
      $("sec-featured").hidden = false;
      $("featured").innerHTML = feat.slice(0, 4).map(card).join("");
    }

    const offs = products.filter(p => p.old_price && p.old_price > p.price && p.available !== false);
    if (offs.length && $("sec-promo") && $("ofertas")) {
      $("sec-promo").hidden = false;
      $("promo-title").textContent = SITE.ofertasTitulo || "Ofertas";
      $("promo-text").textContent = SITE.ofertasTexto || "";
      $("ofertas").hidden = false;
      $("offers").innerHTML = offs.slice(0, 4).map(card).join("");
    }
  }

  function renderChips() {
    const cats = ["Todos", ...new Set(products.map(p => p.category).filter(Boolean))];
    $("chips").innerHTML = cats.map(c =>
      '<button class="chip' + (c === cat ? " active" : "") + '" data-c="' + esc(c) + '">' + esc(c) + "</button>"
    ).join("");
  }

  function render() {
    const term = $("q").value.trim().toLowerCase();
    const order = $("sort") ? $("sort").value : "";
    let list = products.filter(p =>
      (cat === "Todos" || p.category === cat) &&
      (!term || (p.name + " " + p.description + " " + p.category).toLowerCase().includes(term))
    );

    if (order === "asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (order === "desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (order === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    $("grid").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No encontramos productos con ese filtro.</p>';
  }

  $("chips").addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    cat = b.dataset.c;
    renderChips();
    render();
  });

  if ($("cats")) {
    $("cats").addEventListener("click", e => {
      const b = e.target.closest(".cat-box");
      if (!b) return;
      cat = b.dataset.c;
      renderChips();
      render();
      $("productos").scrollIntoView({ behavior: "smooth" });
    });
  }

  if ($("sort")) $("sort").addEventListener("change", render);
  $("q").addEventListener("input", render);
  if ($("search-form")) {
    $("search-form").addEventListener("submit", e => {
      e.preventDefault();
      $("productos").scrollIntoView({ behavior: "smooth" });
    });
  }

  fetch("products.json?v=" + Date.now())
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      products = Array.isArray(data) ? data : [];
      renderSections();
      renderChips();
      render();
      syncDetail(); // por si entraron con el link directo a un producto
    })
    .catch(() => {
      $("grid").innerHTML = '<p class="empty">No se pudieron cargar los productos.</p>';
    });
})();
