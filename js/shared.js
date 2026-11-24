// Utilidades compartidas entre la tienda y el panel
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function money(n) {
  return "$ " + Number(n || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

function waLink(text) {
  return "https://wa.me/" + window.SITE.whatsapp + "?text=" + encodeURIComponent(text);
}

function waLinkProduct(p) {
  const text = window.SITE.mensaje
    .replace("{producto}", p.name)
    .replace("{precio}", money(p.price));
  return waLink(text);
}

// Solo permite colores tipo #rrggbb para evitar inyectar CSS
function safeColor(c) {
  return /^#[0-9a-fA-F]{6}$/.test(c || "") ? c : "#1e3a8a";
}

// Solo permite imágenes por data: o http(s)/rutas relativas
function safeImg(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^(javascript|vbscript):/i.test(u)) return "";
  if (/^data:image\/(jpeg|png|webp|gif);base64,/i.test(u)) return u;
  if (/^(https?:\/\/|images\/|\.\/images\/)/i.test(u)) return u;
  return "";
}
