/**
 * Ge'ez RNN Cipher — Fidel Cube
 * The 182 classical syllographs (26 classes × 7 orders) folded into a 13 × 7 × 2 cube:
 *   x = consonant row within its layer (0–12), y = vowel order (0–6), z = layer (0 = ሀ–ኀ, 1 = ነ–ፐ).
 * Every cell is also a day of the 182-day equinox cycle (class × 7 + order + 1).
 * The cube cipher shifts each letter along x (mod 13), y (mod 7) and z (xor 1),
 * driven by a key stream plus a rotor that steps one day per letter.
 * Data: geez_dataset.js (ethiopianClasses, orders).
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;

  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D.ethiopianClasses.slice(0, 26);
  const ORDERS = D.orders || [];
  const ORDN = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

  const glyph = (c, o) => CLASSES[c][FORMS[o]];
  const value = (c, o) => CLASSES[c].baseValue * (o + 1);
  const LOOK = new Map();
  CLASSES.forEach((cls, c) => FORMS.forEach((f, o) => LOOK.set(cls[f], [c, o])));

  // ---------- Key stream (stand-in for the RNN) ----------
  // A keyed generator so the demo runs on its own. The RNN would supply Δx, Δy, Δz here.
  function hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (const ch of str) {
      const k = ch.codePointAt(0);
      h1 = Math.imul(h1 ^ k, 2654435761);
      h2 = Math.imul(h2 ^ k, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    return h1 >>> 0;
  }
  function keyStream(key) {
    let s = hash(key);
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return (t ^ (t >>> 14)) >>> 0;
    };
  }

  /** Encrypt or decrypt text. Non-Ge'ez characters pass through. Returns { text, steps, seal }. */
  function cubeCipher(text, key, startDay, decrypt) {
    const R = keyStream(key);
    const steps = [];
    let out = '', i = 0, seal = 0;
    for (const ch of text) {
      const hit = LOOK.get(ch);
      if (!hit) { out += ch; steps.push({ pass: true, ch }); continue; }
      const [c, o] = hit;
      const kx = R() % 13, ky = R() % 7, kz = R() % 2;
      const off = (startDay - 1 + i) % 182;            // rotor position, 0–181
      const rx = Math.floor(off / 7) % 13, ry = off % 7, rz = Math.floor(off / 91);
      const x = c % 13, y = o, z = Math.floor(c / 13);
      let X, Y;
      if (!decrypt) { X = (x + kx + rx) % 13; Y = (y + ky + ry) % 7; }
      else { X = ((x - kx - rx) % 13 + 26) % 13; Y = ((y - ky - ry) % 7 + 14) % 7; }
      const Z = z ^ kz ^ rz;
      const C = Z * 13 + X;
      out += glyph(C, Y);
      seal += decrypt ? value(C, Y) : value(c, o);
      steps.push({ n: i + 1, ch, c, o, x, y, z, kx, ky, kz, day: off + 1, C, Y, X, Z });
      i++;
    }
    return { text: out, steps, seal };
  }

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const cube = $('cubeSolid');
    if (!cube) return;

    // Build the two layers
    const tiles = {};
    const layers = [0, 1].map((z) => {
      const L = document.createElement('div');
      L.className = 'cube-layer' + (z ? ' back' : '');
      cube.appendChild(L);
      return L;
    });
    for (let z = 0; z < 2; z++) {
      for (let o = 0; o < 7; o++) {
        for (let r = 0; r < 13; r++) {
          const c = z * 13 + r;
          const t = document.createElement('button');
          t.type = 'button';
          t.className = 'cube-tile';
          t.innerHTML = `<span class="ge">${glyph(c, o)}</span><small>${value(c, o)}</small>`;
          t.setAttribute('aria-label', `${glyph(c, o)}, ${CLASSES[c].name}, order ${o + 1}, value ${value(c, o)}`);
          t.style.gridColumn = r + 1;
          t.style.gridRow = o + 1;
          t.addEventListener('click', () => select(c, o));
          layers[z].appendChild(t);
          tiles[c + ',' + o] = t;
        }
      }
    }

    // ---------- View: rotate, explode, fit ----------
    let exploded = true, rotX = -24, rotY = -28;
    const scene = $('cubeScene');
    const fitBox = $('cubeFit');
    function tileSize() {
      return parseFloat(getComputedStyle(cube).getPropertyValue('--cube-t')) || 38;
    }
    function place() {
      const gap = exploded ? 150 : tileSize();
      layers[0].style.transform = `translateZ(${gap / 2}px)`;
      layers[1].style.transform = `translateZ(${-gap / 2}px)`;
      cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    function fit() {
      const w = scene.clientWidth;
      if (!w) return;
      const need = tileSize() * 13 + 170;
      fitBox.style.transform = `scale(${Math.min(1, (w - 24) / need)})`;
    }
    let drag = null;
    scene.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.cube-tile')) return;
      drag = { x: e.clientX, y: e.clientY, rotX, rotY };
      scene.setPointerCapture(e.pointerId);
    });
    scene.addEventListener('pointermove', (e) => {
      if (!drag) return;
      rotY = drag.rotY + (e.clientX - drag.x) * 0.4;
      rotX = Math.max(-80, Math.min(80, drag.rotX - (e.clientY - drag.y) * 0.4));
      place();
    });
    const endDrag = () => { drag = null; };
    scene.addEventListener('pointerup', endDrag);
    scene.addEventListener('pointercancel', endDrag);
    const bEx = $('cubeExplode');
    bEx.addEventListener('click', () => {
      exploded = !exploded;
      bEx.classList.toggle('active', exploded);
      bEx.setAttribute('aria-pressed', String(exploded));
      place();
    });
    $('cubeFront').addEventListener('click', () => { rotX = 0; rotY = 0; place(); });
    $('cubeIso').addEventListener('click', () => { rotX = -24; rotY = -28; place(); });
    window.addEventListener('resize', fit);

    // ---------- Inspector ----------
    function select(c, o) {
      document.querySelectorAll('.cube-tile.sel').forEach((t) => t.classList.remove('sel'));
      tiles[c + ',' + o].classList.add('sel');
      const cls = CLASSES[c], ord = ORDERS[o] || {};
      const x = c % 13, z = Math.floor(c / 13), day = c * 7 + o + 1;
      $('cubeGlyph').textContent = glyph(c, o);
      $('cubeName').textContent = cls.name;
      $('cubeSub').textContent = `Class ${c + 1} · ${ORDN[o]} order${ord.name ? ' (' + ord.name + ')' : ''}`;
      $('cubeSyl').innerHTML = `<span class="ge">${cls.geez}</span> + vowel <span class="mono">${ord.vowel || ''}</span>`;
      $('cubeNum').innerHTML =
        `<span class="mono">${cls.baseValue} × ${o + 1} = <b>${value(c, o)}</b></span>` +
        `<div class="cube-orders">${FORMS.map((f, k) =>
          `<span class="${k === o ? 'cur' : ''}"><span class="ge">${cls[f]}</span> ${value(c, k)}</span>`).join('')}</div>`;
      $('cubeAst').innerHTML = `Day <b>${day}</b> of 182 <span class="hint">· class covers days ${c * 7 + 1}–${c * 7 + 7}${ord.day ? ' · ' + ord.day : ''}</span>`;
      $('cubeIde').textContent = cls.meaning || '–';
      $('cubePic').textContent = cls.pictoOrigin || '–';
      $('cubePos').textContent = `x ${x} · y ${o} · z ${z}  (cell ${c * 7 + o} of 0–181)`;
    }

    // ---------- Cipher bench ----------
    let mode = 'enc', lastSeal = null;
    const inp = $('cubeInput'), out = $('cubeOutput');
    function startDay() {
      const d = parseInt($('cubeDay').value, 10);
      return Math.min(182, Math.max(1, Number.isFinite(d) ? d : 1));
    }
    function run() {
      const res = cubeCipher(inp.value, $('cubeKey').value, startDay(), mode === 'dec');
      out.textContent = res.text || '–';
      $('cubeSeal').textContent = res.seal.toLocaleString();
      const note = $('cubeSealNote');
      if (mode === 'enc') {
        lastSeal = res.seal;
        note.className = 'status';
        note.textContent = 'Sum of the plain letters’ numeric values. Decrypting should give the same number.';
      } else if (lastSeal == null) {
        note.className = 'status';
        note.textContent = 'Encrypt something first to get a seal to compare against.';
      } else if (res.seal === lastSeal) {
        note.className = 'status ok';
        note.textContent = 'Matches the seal from encryption: the round trip is exact.';
      } else {
        note.className = 'status err';
        note.textContent = 'Does not match the seal from encryption. Check the key and the rotor start day.';
      }
      const tb = $('cubeSteps');
      tb.innerHTML = '';
      let firstRow = null, firstStep = null;
      res.steps.forEach((s) => {
        const tr = document.createElement('tr');
        if (s.pass) {
          tr.className = 'future';
          tr.innerHTML = `<td>–</td><td class="glyph-cell">${s.ch === ' ' ? '␣' : s.ch}</td><td colspan="6">passes through unchanged</td>`;
        } else {
          tr.innerHTML =
            `<td>${s.n}</td><td class="glyph-cell">${s.ch}</td><td>${s.x}·${s.y}·${s.z}</td>` +
            `<td>+${s.kx} +${s.ky} ⊕${s.kz}</td><td>day ${s.day}</td>` +
            `<td class="glyph-cell out">${glyph(s.C, s.Y)}</td><td>${s.X}·${s.Y}·${s.Z}</td>` +
            `<td>${value(s.c, s.o)} → ${value(s.C, s.Y)}</td>`;
          tr.tabIndex = 0;
          tr.addEventListener('click', () => highlight(s, tr));
          tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); highlight(s, tr); } });
          if (!firstRow) { firstRow = tr; firstStep = s; }
        }
        tb.appendChild(tr);
      });
      if (firstRow) highlight(firstStep, firstRow);
    }
    function highlight(s, tr) {
      document.querySelectorAll('.cube-tile.src, .cube-tile.dst').forEach((t) => t.classList.remove('src', 'dst'));
      document.querySelectorAll('#cubeSteps tr.active-step').forEach((t) => t.classList.remove('active-step'));
      if (tr) tr.classList.add('active-step');
      tiles[s.c + ',' + s.o].classList.add('src');
      tiles[s.C + ',' + s.Y].classList.add('dst');
      select(s.c, s.o);
    }
    function setMode(m) {
      mode = m;
      $('cubeModeEnc').classList.toggle('active', m === 'enc');
      $('cubeModeDec').classList.toggle('active', m === 'dec');
      $('cubeModeEnc').setAttribute('aria-pressed', String(m === 'enc'));
      $('cubeModeDec').setAttribute('aria-pressed', String(m === 'dec'));
      $('cubeInLabel').textContent = m === 'enc' ? 'Plain text' : 'Cipher text';
      $('cubeOutLabel').textContent = m === 'enc' ? 'Cipher text' : 'Plain text';
      run();
    }
    $('cubeModeEnc').addEventListener('click', () => setMode('enc'));
    $('cubeModeDec').addEventListener('click', () => setMode('dec'));
    $('cubeSwap').addEventListener('click', () => {
      if (out.textContent === '–') return;
      inp.value = out.textContent;
      setMode(mode === 'enc' ? 'dec' : 'enc');
    });
    $('cubeToday').addEventListener('click', () => {
      // Days since the most recent equinox (approx. 20 March / 22 September), wrapped to 1–182
      const now = new Date(), y = now.getFullYear();
      const eq = [new Date(y - 1, 8, 22), new Date(y, 2, 20), new Date(y, 8, 22)].filter((d) => d <= now).pop();
      $('cubeDay').value = (Math.floor((now - eq) / 864e5) % 182) + 1;
      run();
    });
    ['cubeKey', 'cubeDay', 'cubeInput'].forEach((id) => $(id).addEventListener('input', run));

    // Called by app.js when the Cube tab opens (sizes are 0 while the tab is hidden)
    window.renderGeezCube = () => { fit(); place(); };

    place();
    run();
  });

  window.GeezCube = { cubeCipher, glyph, value };
})();
