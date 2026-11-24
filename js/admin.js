(function () {
  const $ = id => document.getElementById(id);
  const DRAFT_KEY = "cyn_draft_products";
  const GH_KEY = "cyn_gh_settings";

  let products = [];
  let published = "[]";      // JSON del último estado publicado (para detectar cambios)
  let editingId = null;
  let currentImage = "";

  /* ---------- storage seguro ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
    del(k) { try { localStorage.removeItem(k); } catch (_) {} }
  };

  const ser = () => JSON.stringify(products, null, 2);

  function persist() {
    store.set(DRAFT_KEY, ser());
    updateStatus();
  }

  function updateStatus() {
    const dirty = JSON.stringify(products) !== published;
    const s = $("status");
    s.textContent = dirty ? "● Cambios sin publicar" : "✓ Todo publicado";
    s.classList.toggle("dirty", dirty);
  }

  /* ---------- carga inicial ---------- */
  fetch("products.json?v=" + Date.now())
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])
    .then(remote => {
      published = JSON.stringify(Array.isArray(remote) ? remote : []);
      let draft = null;
      try { draft = JSON.parse(store.get(DRAFT_KEY) || "null"); } catch (_) {}
      products = Array.isArray(draft) ? draft : (Array.isArray(remote) ? remote : []);
      renderList();
      updateStatus();
    });

  /* ---------- lista ---------- */
  function renderList() {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    $("cats").innerHTML = cats.map(c => '<option value="' + esc(c) + '">').join("");
    if (!products.length) {
      $("list").innerHTML = '<p class="empty">Todavía no hay productos. Agregá el primero.</p>';
      return;
    }
    $("list").innerHTML = products.map(p => {
      const img = safeImg(p.image);
      const thumb = img ? '<img src="' + esc(img) + '" alt="">' : esc(p.emoji || "📦");
      return '<div class="pitem" data-id="' + p.id + '">' +
        '<div class="thumb" style="background:' + safeColor(p.color) + '">' + thumb + "</div>" +
        '<div class="info"><strong>' + esc(p.name) + "</strong><small>" + esc(p.category) + " · " + money(p.price) +
        (p.featured ? " · ⭐" : "") + (p.available === false ? ' · <span class="tag-off">Sin stock</span>' : "") + "</small></div>" +
        '<div class="acts"><button class="btn btn-ghost btn-small" data-act="edit">Editar</button>' +
        '<button class="btn btn-danger btn-small" data-act="del">Borrar</button></div></div>';
    }).join("");
  }

  $("list").addEventListener("click", e => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const id = Number(b.closest(".pitem").dataset.id);
    const p = products.find(x => x.id === id);
    if (!p) return;
    if (b.dataset.act === "edit") startEdit(p);
    if (b.dataset.act === "del" && confirm('¿Borrar "' + p.name + '"?')) {
      products = products.filter(x => x.id !== id);
      if (editingId === id) resetForm();
      persist(); renderList();
    }
  });

  /* ---------- formulario ---------- */
  function updatePreview() {
    const pv = $("preview");
    pv.style.background = $("color").value;
    pv.innerHTML = currentImage ? '<img src="' + esc(currentImage) + '" alt="">' : esc($("emoji").value || "📦");
  }
  ["color", "emoji"].forEach(id => $(id).addEventListener("input", updatePreview));

  function resetForm() {
    editingId = null; currentImage = "";
    $("form").reset();
    $("emoji").value = "📦"; $("color").value = "#1e3a8a"; $("available").checked = true;
    $("form-title").textContent = "Agregar producto";
    $("save-btn").textContent = "Guardar producto";
    $("cancel-btn").style.display = "none";
    updatePreview();
  }

  function startEdit(p) {
    editingId = p.id;
    currentImage = safeImg(p.image);
    $("name").value = p.name; $("description").value = p.description || "";
    $("price").value = p.price; $("old_price").value = p.old_price || "";
    $("category").value = p.category; $("emoji").value = p.emoji || "📦";
    $("color").value = safeColor(p.color);
    $("available").checked = p.available !== false; $("featured").checked = !!p.featured;
    $("file").value = "";
    $("form-title").textContent = "Editar producto";
    $("save-btn").textContent = "Guardar cambios";
    $("cancel-btn").style.display = "";
    updatePreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("cancel-btn").addEventListener("click", resetForm);

  // Achica la foto a máx. 700px y la guarda como JPEG liviano
  $("file").addEventListener("change", () => {
    const f = $("file").files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const max = 700, k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      currentImage = c.toDataURL("image/jpeg", 0.75);
      URL.revokeObjectURL(url);
      updatePreview();
    };
    img.onerror = () => { URL.revokeObjectURL(url); alert("No se pudo leer esa imagen."); };
    img.src = url;
  });

  $("form").addEventListener("submit", e => {
    e.preventDefault();
    const num = v => (v === "" ? null : Math.max(0, Math.round(Number(v))));
    const data = {
      name: $("name").value.trim(),
      category: $("category").value.trim(),
      description: $("description").value.trim(),
      price: num($("price").value) ?? 0,
      old_price: num($("old_price").value),
      available: $("available").checked,
      emoji: $("emoji").value.trim() || "📦",
      color: $("color").value,
      image: currentImage,
      featured: $("featured").checked
    };
    if (!data.name || !data.category) return;
    if (editingId) {
      products = products.map(p => p.id === editingId ? { ...p, ...data } : p);
    } else {
      const id = products.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
      products.unshift({ id, ...data });
    }
    persist(); renderList(); resetForm();
  });

  /* ---------- exportar / importar ---------- */
  $("download-btn").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ser()], { type: "application/json" }));
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("import-btn").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", () => {
    const f = $("import-file").files[0];
    if (!f) return;
    f.text().then(t => {
      const d = JSON.parse(t);
      if (!Array.isArray(d)) throw new Error();
      products = d.filter(p => p && typeof p === "object").map((p, i) => ({ ...p, id: p.id || i + 1 }));
      persist(); renderList(); resetForm();
    }).catch(() => alert("El archivo no es un products.json válido."));
    $("import-file").value = "";
  });

  $("reset-btn").addEventListener("click", () => {
    if (!confirm("¿Descartar todos los cambios sin publicar?")) return;
    store.del(DRAFT_KEY);
    try { products = JSON.parse(published); } catch (_) { products = []; }
    renderList(); resetForm(); updateStatus();
  });

  /* ---------- publicar en GitHub ---------- */
  const dlg = $("dlg");
  const msg = (t, type) => { const m = $("gh-msg"); m.textContent = t; m.className = "msg " + (type || ""); };

  function guessRepo() {
    const h = location.hostname;
    if (h.endsWith(".github.io")) {
      return { owner: h.split(".")[0], repo: location.pathname.split("/")[1] || h };
    }
    return { owner: "", repo: "" };
  }

  $("publish-btn").addEventListener("click", () => {
    let s = {};
    try { s = JSON.parse(store.get(GH_KEY) || "{}"); } catch (_) {}
    const g = guessRepo();
    $("gh-owner").value = s.owner || g.owner;
    $("gh-repo").value = s.repo || g.repo;
    $("gh-branch").value = s.branch || "main";
    $("gh-token").value = s.token || "";
    $("gh-remember").checked = !!s.token;
    msg("");
    dlg.showModal();
  });
  $("gh-cancel").addEventListener("click", () => dlg.close());

  function toBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  $("gh-go").addEventListener("click", async () => {
    const owner = $("gh-owner").value.trim(), repo = $("gh-repo").value.trim();
    const branch = $("gh-branch").value.trim() || "main", token = $("gh-token").value.trim();
    if (!owner || !repo || !token) return msg("Completá usuario, repositorio y token.", "err");
    if ($("gh-remember").checked) store.set(GH_KEY, JSON.stringify({ owner, repo, branch, token }));
    else store.set(GH_KEY, JSON.stringify({ owner, repo, branch }));

    const url = "https://api.github.com/repos/" + encodeURIComponent(owner) + "/" + encodeURIComponent(repo) + "/contents/products.json";
    const headers = { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    $("gh-go").disabled = true;
    msg("Publicando…");
    try {
      let sha;
      const cur = await fetch(url + "?ref=" + encodeURIComponent(branch), { headers });
      if (cur.ok) sha = (await cur.json()).sha;
      else if (cur.status !== 404) throw new Error(cur.status === 401 ? "Token inválido o vencido." : "No se pudo leer el repositorio (" + cur.status + ").");

      const body = { message: "Actualizar productos desde el panel", content: toBase64(ser()), branch };
      if (sha) body.sha = sha;
      const put = await fetch(url, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!put.ok) {
        const t = await put.json().catch(() => ({}));
        throw new Error(put.status === 403 || put.status === 404
          ? "Sin permiso: revisá que el token tenga acceso de escritura (Contents) a este repo."
          : (t.message || "Error " + put.status));
      }
      published = JSON.stringify(products);
      store.set(DRAFT_KEY, ser());
      updateStatus();
      msg("✓ Publicado. La tienda se actualiza en ~1 minuto.", "ok");
    } catch (err) {
      msg(err.message || "Error al publicar.", "err");
    } finally {
      $("gh-go").disabled = false;
    }
  });

  updatePreview();
})();
