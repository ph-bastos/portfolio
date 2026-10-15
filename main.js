// Tema (escuro por padrão), idioma, cabeçalho e cópia de e-mail
(function () {
  var root = document.documentElement;

  var theme = document.getElementById('theme');
  function syncTheme() {
    if (theme) theme.setAttribute('aria-checked', root.classList.contains('light') ? 'true' : 'false');
  }
  syncTheme();
  if (theme) theme.addEventListener('click', function () {
    root.classList.toggle('light');
    try { localStorage.setItem('pb-theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (e) {}
    syncTheme();
  });

  document.querySelectorAll('.lang a').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('pb-lang', a.getAttribute('hreflang')); } catch (e) {}
    });
  });

  var top = document.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var copy = document.getElementById('copy');
  if (copy) copy.addEventListener('click', function () {
    var label = copy.textContent;
    var done = function () {
      copy.textContent = copy.dataset.done;
      setTimeout(function () { copy.textContent = label; }, 2500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText('phbomoreira@gmail.com').then(done).catch(function () {});
  });

  // Luz orgânica que segue o mouse na primeira dobra
  var hero = document.querySelector('.hero, .case-hero');
  var light = hero && hero.querySelector('.light');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && light && !still && finePointer) {
    var tx = 0.7, ty = 0.4, x = tx, y0 = ty, raf = null;
    var tick = function () {
      x += (tx - x) * 0.06;
      y0 += (ty - y0) * 0.06;
      hero.style.setProperty('--mx', (x * 100).toFixed(2) + '%');
      hero.style.setProperty('--my', (y0 * 100).toFixed(2) + '%');
      hero.style.setProperty('--px', ((x - 0.5) * 2).toFixed(3));
      hero.style.setProperty('--py', ((y0 - 0.5) * 2).toFixed(3));
      raf = (Math.abs(tx - x) + Math.abs(ty - y0) > 0.0005) ? requestAnimationFrame(tick) : null;
    };
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      light.classList.add('on');
      if (!raf) raf = requestAnimationFrame(tick);
    });
    hero.addEventListener('pointerleave', function () { light.classList.remove('on'); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
