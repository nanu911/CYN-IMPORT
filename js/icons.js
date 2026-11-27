/* =========================================================
   CYN IMPORT - icons.js
   Reemplaza los emojis por íconos de Font Awesome en toda la
   página, incluidos los que genera app.js (categorías, hero,
   beneficios, productos sin foto, botones, etc.).
   Cargar DESPUÉS de app.js.
   ========================================================= */
(function () {
  'use strict';

  var S = 'fa-solid ', B = 'fa-brands ';

  // emoji -> clases de Font Awesome (podés agregar los tuyos acá)
  var MAP = {
    '🚚': S + 'fa-truck-fast', '🚛': S + 'fa-truck', '📦': S + 'fa-box',
    '🏠': S + 'fa-house', '🏡': S + 'fa-house',
    '💵': S + 'fa-money-bill-wave', '💰': S + 'fa-money-bill-wave', '💲': S + 'fa-dollar-sign', '💳': S + 'fa-credit-card',
    '🔍': S + 'fa-magnifying-glass', '🔎': S + 'fa-magnifying-glass',
    '💬': B + 'fa-whatsapp', '📱': S + 'fa-mobile-screen', '📞': S + 'fa-phone', '☎': S + 'fa-phone',
    '✉': S + 'fa-envelope', '📧': S + 'fa-envelope', '📍': S + 'fa-location-dot',
    '🕒': S + 'fa-clock', '🕐': S + 'fa-clock', '⏰': S + 'fa-clock', '⏱': S + 'fa-stopwatch', '⌚': S + 'fa-stopwatch',
    '⭐': S + 'fa-star', '🌟': S + 'fa-star', '🔥': S + 'fa-fire', '🎁': S + 'fa-gift', '🏷': S + 'fa-tag',
    '🛒': S + 'fa-cart-shopping', '✅': S + 'fa-circle-check', '✔': S + 'fa-check',
    '🎧': S + 'fa-headphones', '🔊': S + 'fa-volume-high', '🔈': S + 'fa-volume-high', '🔉': S + 'fa-volume-high',
    '🕶': S + 'fa-glasses', '👓': S + 'fa-glasses', '👜': S + 'fa-bag-shopping', '👝': S + 'fa-bag-shopping', '🎒': S + 'fa-bag-shopping',
    '🥽': S + 'fa-vr-cardboard', '🤖': S + 'fa-vr-cardboard',
    '📷': S + 'fa-camera', '📸': S + 'fa-camera', '💻': S + 'fa-laptop', '🖥': S + 'fa-desktop', '⌨': S + 'fa-keyboard',
    '🖱': S + 'fa-computer-mouse', '🔌': S + 'fa-plug', '🔋': S + 'fa-battery-full', '💡': S + 'fa-lightbulb',
    '⛺': S + 'fa-campground', '🏕': S + 'fa-campground', '🧰': S + 'fa-toolbox', '🔧': S + 'fa-wrench',
    '🍳': S + 'fa-utensils', '🍽': S + 'fa-utensils', '🛋': S + 'fa-couch', '🛏': S + 'fa-bed',
    '👟': S + 'fa-shoe-prints', '👕': S + 'fa-shirt', '🚗': S + 'fa-car', '🎮': S + 'fa-gamepad',
    '🛡': S + 'fa-shield-halved', '🌍': S + 'fa-earth-americas', '🌎': S + 'fa-earth-americas', '🚀': S + 'fa-rocket',
    '❤': S + 'fa-heart', '☰': S + 'fa-bars', '✕': S + 'fa-xmark', '✖': S + 'fa-xmark'
  };

  // En estos contenedores, cualquier emoji sin ícono propio pasa a una caja genérica
  var FALLBACK_SEL = '.c-ico, .ico, .emoji, .hero-art span';
  var FALLBACK_ICON = S + 'fa-box-open';

  var RE_G = /(?:\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)|[☰✕✖]/gu;
  var RE_T = /\p{Extended_Pictographic}|[☰✕✖]/u;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, OPTION: 1, TITLE: 1 };

  function iconFor(ch, useFallback) {
    var key = ch.replace(/\uFE0F/g, '');
    var cls = MAP[key] || MAP[Array.from(key)[0]];
    if (!cls && useFallback) cls = FALLBACK_ICON;
    return cls || null;
  }

  function makeIcon(cls) {
    var i = document.createElement('i');
    i.className = cls + ' ic';
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  function convertTextNode(node) {
    var text = node.nodeValue;
    if (!text || !RE_T.test(text)) return;
    var parent = node.parentElement;
    if (!parent || SKIP[parent.tagName]) return;
    var useFallback = !!(parent.closest && parent.closest(FALLBACK_SEL));

    var frag = document.createDocumentFragment();
    var last = 0, changed = false, m;
    RE_G.lastIndex = 0;
    while ((m = RE_G.exec(text)) !== null) {
      var cls = iconFor(m[0], useFallback);
      if (!cls) continue;                       // ©, ®, ™, etc. se dejan como están
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      frag.appendChild(makeIcon(cls));
      last = m.index + m[0].length;
      changed = true;
    }
    if (!changed) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    parent.replaceChild(frag, node);
  }

  function walk(root) {
    if (root.nodeType === 3) { convertTextNode(root); return; }
    if (root.nodeType !== 1 || SKIP[root.tagName]) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(convertTextNode);
  }

  function run() {
    walk(document.body);

    var obs = new MutationObserver(function (muts) {
      muts.forEach(function (mu) {
        if (mu.type === 'characterData') convertTextNode(mu.target);
        else mu.addedNodes.forEach(walk);
      });
      obs.takeRecords(); // ignora los cambios que hicimos nosotros
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
