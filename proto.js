// Player de protótipo navegável: telas exportadas do Figma + áreas clicáveis.
// Cada .proto tem um <script type="application/json"> com { w, h, base, start, screens: { id: { label, hot: [[x, y, w, h, alvo, rótulo]] } } }
(function () {
  document.querySelectorAll('.proto').forEach(function (root) {
    var data = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
    var stage = root.querySelector('.proto-stage');
    var label = root.querySelector('.proto-screen');
    var restart = root.querySelector('.proto-restart');
    var imgs = {};
    var current = null;

    stage.style.aspectRatio = data.w + ' / ' + data.h;
    stage.innerHTML = '';

    Object.keys(data.screens).forEach(function (id) {
      var img = new Image();
      img.src = data.base + id + '.webp';
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
      if (current) imgs[current].classList.remove('on');
      imgs[id].classList.add('on');
      current = id;
      label.textContent = s.label;
      layer.innerHTML = '';
      (s.hot || []).forEach(function (h) {
        var b = document.createElement('button');
        b.type = 'button';
        b.style.left = pct(h[0], data.w);
        b.style.top = pct(h[1], data.h);
        b.style.width = pct(h[2], data.w);
        b.style.height = pct(h[3], data.h);
        b.setAttribute('aria-label', h[5]);
        b.title = h[5];
        if (h[6]) b.classList.add('lead');
        b.addEventListener('click', function (e) { e.stopPropagation(); go(h[4]); });
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
})();
