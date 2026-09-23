/* Tony IT — animations.js — entrada do hero, scroll reveals e contadores (GSAP) */

/* ============================================================
   TEXT SCRAMBLE — hero name only
   ============================================================ */
function scramble(el, cb) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  var orig = el.textContent;
  var iter = 0;
  var id = setInterval(function() {
    el.textContent = orig.split('').map(function(c, i) {
      return i < iter ? c : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iter >= orig.length + 4) { clearInterval(id); el.textContent = orig; if(cb) cb(); }
    iter += .4;
  }, 38);
}

/* ============================================================
   GSAP — HERO ENTRANCE
   ============================================================ */
window.addEventListener('load', function() {
  if (!window.gsap) return;

  gsap.set(['#hs','#hn','#hr','#hd','#hb','#hscr'], { opacity: 0, y: 18 });

  var tl = gsap.timeline({ delay: .25 });
  tl.to('#hs',   { opacity:1, y:0, duration:.45, ease:'power2.out' })
    .to('#hn',   { opacity:1, y:0, duration:.55, ease:'power2.out' }, '-=.15')
    .to('#hr',   { opacity:1, y:0, duration:.45, ease:'power2.out' }, '-=.25')
    .to('#hd',   { opacity:1, y:0, duration:.45, ease:'power2.out' }, '-=.25')
    .to('#hb',   { opacity:1, y:0, duration:.45, ease:'power2.out' }, '-=.25')
    .to('#hscr', { opacity:1, y:0, duration:.4,  ease:'power2.out' }, '-=.2');

  tl.add(function() { scramble(document.getElementById('scr')); }, .3);
});

/* ============================================================
   GSAP + ScrollTrigger — SCROLL REVEALS
   ============================================================ */
window.addEventListener('load', function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.rv').forEach(function(el) {
    gsap.fromTo(el,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: .65, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });
});

/* ============================================================
   COUNTER ANIMATION (vanilla IntersectionObserver)
   ============================================================ */
;(function initCounters() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      var el = entry.target;
      var target = parseInt(el.dataset.to, 10);
      var start = performance.now();
      var dur = 1350;
      function frame(now) {
        var p = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + 'h';
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }, { threshold: .6 });

  document.querySelectorAll('.counter').forEach(function(el) { obs.observe(el); });
})();
