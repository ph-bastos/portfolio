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

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
