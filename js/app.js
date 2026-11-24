(function () {
  const $ = id => document.getElementById(id);
  let products = [];
  let cat = "Todos";

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
    const cuotas = SITE.cuotas > 1 && p.price > 0
      ? '<div class="cuotas-tag">' + SITE.cuotas + " cuotas sin interés de " + money(Math.round(p.price / SITE.cuotas)) + "</div>" : "";
    const btn = p.available !== false
      ? '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + esc(waLinkProduct(p)) + '">💬 Consultar</a>'
      : '<span class="btn btn-off">Sin stock</span>';

    return '<article class="card"><div class="card-img" style="background:linear-gradient(135deg,' + color + ',#0f172a)">' +
      off + star + visual + '</div><div class="card-body"><span class="cat">' + esc(p.category) + '</span><h3>' + esc(p.name) +
      '</h3><p class="desc">' + esc(p.description) + '</p><div class="price"><strong>' + money(p.price) + '</strong>' + old +
      '</div>' + cuotas + btn + '</div></article>';
  }

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
    })
    .catch(() => {
      $("grid").innerHTML = '<p class="empty">No se pudieron cargar los productos.</p>';
    });
})();
