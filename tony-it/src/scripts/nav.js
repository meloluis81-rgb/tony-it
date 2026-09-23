/* Tony IT — nav.js — menu mobile e estado da nav ao rolar a página */

/* ============================================================
   MOBILE MENU
   ============================================================ */
;(function() {
  var btn  = document.getElementById('burger');
  var menu = document.getElementById('mob-menu');
  function setOpen(isOpen) {
    btn.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  }
  btn.addEventListener('click', function() {
    setOpen(!menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { setOpen(false); });
  });
})();

/* ============================================================
   NAV SCROLL STATE
   ============================================================ */
window.addEventListener('scroll', function() {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 80);
}, { passive: true });
