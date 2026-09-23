/* Tony IT — cursor.js — cursor customizado (apenas dispositivos com ponteiro fino) */

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
;(function initCursor() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  var dot  = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  var rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function lag() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(lag);
  })();

  document.querySelectorAll('a,button,.svc-row').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('chover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('chover'); });
  });
})();
