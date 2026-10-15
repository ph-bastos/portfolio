// Cases confidenciais: o conteúdo só existe criptografado (AES-GCM, chave derivada da senha com PBKDF2).
// Sem a senha certa não há texto nem imagem para ler, nem no código da página nem no repositório.
(function () {
  var form = document.getElementById('unlock');
  if (!form || !window.crypto || !crypto.subtle) return;
  var vault = document.getElementById('vault');
  var err = form.querySelector('.lock-error');
  var btn = form.querySelector('button');
  var input = form.querySelector('input');

  function b64(s) { var bin = atob(s.trim()), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }

  async function decrypt(pw, blob) {
    var raw = b64(blob), salt = raw.slice(0, 16), iv = raw.slice(16, 28), ct = raw.slice(28);
    var base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 310000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ct));
  }

  async function open(pw) {
    var page = JSON.parse(await decrypt(pw, vault.textContent));
    var res = await fetch(form.dataset.assets);
    var assets = JSON.parse(await decrypt(pw, await res.text()));
    window.__vault = assets;
    document.getElementById('vault-hero').innerHTML = page.hero;
    document.getElementById('conteudo').innerHTML = page.body;
    document.querySelectorAll('img[data-v]').forEach(function (img) {
      var a = assets[img.dataset.v];
      if (a) img.src = 'data:image/webp;base64,' + a;
    });
    if (window.initProtos) window.initProtos(document.getElementById('conteudo'));
    document.body.classList.add('unlocked');
    try { sessionStorage.setItem('pb-vault', pw); } catch (e) {}
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    err.hidden = true;
    btn.disabled = true;
    try { await open(input.value); }
    catch (x) { err.hidden = false; input.select(); }
    btn.disabled = false;
  });

  var saved = null;
  try { saved = sessionStorage.getItem('pb-vault'); } catch (e) {}
  if (saved) open(saved).catch(function () {});
})();
