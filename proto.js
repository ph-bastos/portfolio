// Player de protótipo navegável: telas exportadas do Figma + áreas clicáveis.
// Cada .proto tem um <script type="application/json"> com
// { w, h, base | vault, start, screens: { id: { label, w?, h?, hot: [[x, y, w, h, alvo, rótulo, destaque?]] } } }
// Com "vault": true, as imagens vêm do conteúdo descriptografado (window.__vault), e não de arquivos.
(function () {
  function init(scope) {
    (scope || document).querySelectorAll('.proto:not([data-ready])').forEach(function (root) {
      root.setAttribute('data-ready', '');
      var data = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
      var stage = root.querySelector('.proto-stage');
      var label = root.querySelector('.proto-screen');
      var restart = root.querySelector('.proto-restart');
      var imgs = {};
      var current = null;

      stage.innerHTML = '';
      Object.keys(data.screens).forEach(function (id) {
        var img = new Image();
        img.src = data.vault ? 'data:image/webp;base64,' + (window.__vault || {})[id] : data.base + id + '.webp';
        img.alt = data.screens[id].label;
        img.decoding = 'async';
        img.draggable = false;
        stage.appendChild(img);
        imgs[id] = img;
      });

      var layer = document.createElement('div');
      layer.className = 'proto-hot';
      stage.appendChild(layer);

      function pct(v, total) { return (v / total * 100).toFixed(3) + '%'; }

      function go(id) {
        var s = data.screens[id];
        if (!s) return;
        var w = s.w || data.w, h = s.h || data.h;
        stage.style.aspectRatio = w + ' / ' + h;
        if (current) imgs[current].classList.remove('on');
        imgs[id].classList.add('on');
        current = id;
        label.textContent = s.label;
        layer.innerHTML = '';
        (s.hot || []).forEach(function (hs) {
          var b = document.createElement('button');
          b.type = 'button';
          b.style.left = pct(hs[0], w);
          b.style.top = pct(hs[1], h);
          b.style.width = pct(hs[2], w);
          b.style.height = pct(hs[3], h);
          b.setAttribute('aria-label', hs[5]);
          b.title = hs[5];
          if (hs[6]) b.classList.add('lead');
          b.addEventListener('click', function (e) { e.stopPropagation(); go(hs[4]); });
          layer.appendChild(b);
        });
      }

      // Clicar fora de uma área mostra onde dá pra clicar
      stage.addEventListener('click', function () {
        root.classList.remove('hint');
        void root.offsetWidth;
        root.classList.add('hint');
      });
      restart.addEventListener('click', function () { go(data.start); });

      go(data.start);
    });
  }
  window.initProtos = init;
  init();
})();
