/* =========================================================
   CYN IMPORT - theme.js
   Botón para elegir tema claro u oscuro.
   - Siempre arranca en claro; el cliente elige y se recuerda.
   ========================================================= */
(function () {
  'use strict';
  var KEY = 'cyn-theme';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var meta = document.querySelector('meta[name="theme-color"]');

  function isDark() { return root.getAttribute('data-theme') === 'dark'; }

  function paint() {
    var dark = isDark();
    if (meta) meta.setAttribute('content', dark ? '#060d19' : '#0b1b33');
    if (!btn) return;
    var icon = btn.querySelector('i');
    if (icon) icon.className = (dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon') + ' ic';
    var label = dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  function setTheme(dark) {
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
    paint();
  }

  if (btn) btn.addEventListener('click', function () { setTheme(!isDark()); });
  paint();
})();
