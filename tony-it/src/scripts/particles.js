/* Tony IT — particles.js — fundo de rede em Three.js (com fallback se WebGL/CDN falhar) */

/* ============================================================
   FALLBACK — if CDNs fail, show content
   ============================================================ */
window.addEventListener('error', function(e) {
  if (e.target && (e.target.src || '').includes('cdnjs')) {
    document.querySelectorAll('.rv,.hero-status,#hn,#hr,#hd,#hb,#hscr,#hs').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }
}, true);

/* ============================================================
   THREE.JS — PARTICLE NETWORK (full-page fixed canvas)
   ============================================================ */
;(function initThree() {
  var canvas = document.getElementById('bg-canvas');
  if (!window.THREE) return;

  function revealFallback() {
    document.querySelectorAll('.rv,.hero-status,#hn,#hr,#hd,#hb,#hscr,#hs').forEach(function(el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (err) {
    revealFallback();
    return;
  }
  if (!renderer.getContext()) { revealFallback(); return; }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  cam.position.z = 9;

  /* nodes */
  var N = innerWidth < 640 ? 55 : 95;
  var nodes = [];
  for (var i = 0; i < N; i++) {
    nodes.push({
      x: (Math.random() - .5) * 24,
      y: (Math.random() - .5) * 14,
      z: (Math.random() - .5) * 3,
      vx: (Math.random() - .5) * .004,
      vy: (Math.random() - .5) * .004
    });
  }

  /* point cloud */
  var ptGeo = new THREE.BufferGeometry();
  var ptArr = new Float32Array(N * 3);
  nodes.forEach(function(n, i) { ptArr[i*3]=n.x; ptArr[i*3+1]=n.y; ptArr[i*3+2]=n.z; });
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptArr, 3));
  scene.add(new THREE.Points(ptGeo,
    new THREE.PointsMaterial({ color: 0x00C8FF, size: .045, transparent: true, opacity: .65 })));

  /* line segments (pre-allocated) */
  var MAX_SEGS = N * N;
  var lnArr = new Float32Array(MAX_SEGS * 6);
  var lnGeo = new THREE.BufferGeometry();
  lnGeo.setAttribute('position', new THREE.BufferAttribute(lnArr, 3));
  var lnMesh = new THREE.LineSegments(lnGeo,
    new THREE.LineBasicMaterial({ color: 0x0044CC, transparent: true, opacity: .1 }));
  scene.add(lnMesh);

  var MAX_D = 4.8;
  var mx = 0, my = 0;
  document.addEventListener('mousemove', function(e) {
    mx = (e.clientX / innerWidth - .5) * 2;
    my = (e.clientY / innerHeight - .5) * 2;
  });

  var rafId = null;
  var running = false;

  function tick() {
    rafId = requestAnimationFrame(tick);

    /* move nodes */
    nodes.forEach(function(n, i) {
      n.x += n.vx; n.y += n.vy;
      if (Math.abs(n.x) > 12) n.vx *= -1;
      if (Math.abs(n.y) > 7)  n.vy *= -1;
      ptArr[i*3] = n.x; ptArr[i*3+1] = n.y;
    });
    ptGeo.attributes.position.needsUpdate = true;

    /* rebuild lines */
    var lc = 0;
    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        if (dx*dx + dy*dy < MAX_D*MAX_D) {
          var b = lc * 6;
          lnArr[b]   = nodes[i].x; lnArr[b+1] = nodes[i].y; lnArr[b+2] = nodes[i].z;
          lnArr[b+3] = nodes[j].x; lnArr[b+4] = nodes[j].y; lnArr[b+5] = nodes[j].z;
          lc++;
        }
      }
    }
    lnGeo.attributes.position.needsUpdate = true;
    lnGeo.setDrawRange(0, lc * 2);

    /* camera drift */
    cam.position.x += (mx * .55 - cam.position.x) * .04;
    cam.position.y += (-my * .32 - cam.position.y) * .04;

    renderer.render(scene, cam);
  }

  function start() {
    if (running) return;
    running = true;
    tick();
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }
  start();

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) stop(); else start();
  });

  window.addEventListener('resize', function() {
    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
