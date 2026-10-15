// Tema (escuro por padrão) e cópia de e-mail
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme');
  function sync() { if (btn) btn.textContent = root.classList.contains('light') ? 'Escuro' : 'Claro'; }
  sync();
  if (btn) btn.addEventListener('click', function () {
    root.classList.toggle('light');
    try { localStorage.setItem('pb-theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (e) {}
    sync();
  });

  var copy = document.getElementById('copy');
  if (copy) copy.addEventListener('click', function () {
    var email = 'phbomoreira@gmail.com';
    var done = function () {
      copy.textContent = 'E-mail copiado';
      setTimeout(function () { copy.textContent = 'Copiar e-mail'; }, 2500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(done).catch(function () {});
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
