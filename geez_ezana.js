/**
 * Ge'ez RNN Cipher — The Ezana Stone (Home)
 * A 3D stele carved, on four faces, with the titles that open King Ezana's inscriptions:
 *   front  Ge'ez, vocalized (every letter carries its vowel: the fidel in full)
 *   right  Ge'ez, unvocalized (the same words, every letter in its base form, as before c. AD 350)
 *   left   Ge'ez in South Arabian (Musnad) letters, right to left, each letter mapped to its ancestor
 *   back   Greek
 * The three Ge'ez faces are generated from one text, so the model shows the abjad-to-abugida step
 * rather than picturing it. A raking light shows how epigraphers read worn stones, and the name chips
 * match the same name across scripts, the way a trilingual stone is read.
 * Three.js (vendor/three.min.js, r128) is loaded only when the panel scrolls into view.
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D ? D.ethiopianClasses.slice(0, 26) : [];
  const POS = {};                                   // glyph → [class, order]
  CLASSES.forEach((cls, c) => FORMS.forEach((f, o) => { POS[cls[f]] = [c, o]; }));
  const MUSNAD = ['𐩠', '𐩡', '𐩢', '𐩣', '𐩦', '𐩧', '𐩯', '𐩤', '𐩨', '𐩩', '𐩭', '𐩬', '𐩱', '𐩫',
    '𐩥', '𐩲', '𐩸', '𐩺', '𐩵', '𐩴', '𐩷', null, '𐩮', '𐩳', '𐩰', null];

  // The royal titles: Ge'ez word, English gloss, key shared with the Greek
  const GEEZ = [
    ['ዔዛና', 'Ezana', 'ezana'], ['ወልደ', 'son of', 'son'], ['ኤላ', 'Ella', 'ella'], ['ዓሜዳ', 'Amida', 'amida'],
    ['ብእሴ', 'man of', 'man'], ['ሐሌን', 'Halen', 'halen'], ['ንጉሠ', 'king of', 'king'], ['አክሱም', 'Aksum', 'aksum'],
    ['ወዘ', 'and of', 'and'], ['ሐሜር', 'Himyar', 'himyar'], ['ወዘ', 'and of', 'and'], ['ራይዳን', 'Raydan', 'raydan'],
    ['ወዘ', 'and of', 'and'], ['ሳባ', 'Saba', 'saba'], ['ወዘ', 'and of', 'and'], ['ሳልሔን', 'Salhen', 'salhen'],
    ['ወዘ', 'and of', 'and'], ['ጽያሞ', 'Siyamo', 'siyamo'], ['ወዘ', 'and of', 'and'], ['ቤጋ', 'Beja', 'beja'],
    ['ወዘ', 'and of', 'and'], ['ካሱ', 'Kasu', 'kasu'], ['ንጉሠ', 'king of', 'king'], ['ነገሥት', 'kings', 'kings'],
    ['ወልደ', 'son of', 'son'], ['ማሕረም', 'Mahrem', 'mahrem'], ['ዘኢይትመዋዕ', 'never defeated', 'never'], ['ለጸር', 'by the enemy', 'enemy']
  ];
  const GREEK = [
    ['ΑΕΙΖΑΝΑΣ', 'Ezana', 'ezana'], ['ΒΑΣΙΛΕΥΣ', 'king', 'king'], ['ΑΞΩΜΙΤΩΝ', 'of the Aksumites', 'aksum'],
    ['ΚΑΙ', 'and'], ['ΟΜΗΡΙΤΩΝ', 'of the Himyarites', 'himyar'], ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΡΕΕΙΔΑΝ', 'Raydan', 'raydan'],
    ['ΚΑΙ', 'and'], ['ΑΙΘΙΟΠΩΝ', 'of the Ethiopians'], ['ΚΑΙ', 'and'], ['ΣΑΒΑΕΙΤΩΝ', 'of the Sabaeans', 'saba'],
    ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΣΙΛΕΗ', 'Silee', 'salhen'], ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΤΙΑΜΩ', 'Tiamo', 'siyamo'],
    ['ΚΑΙ', 'and'], ['ΒΟΥΓΑΕΙΤΩΝ', 'of the Beja', 'beja'], ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΚΑΣΟΥ', 'Kasu', 'kasu'],
    ['ΒΑΣΙΛΕΥΣ', 'king', 'king'], ['ΒΑΣΙΛΕΩΝ', 'of kings', 'kings'], ['ΥΙΟΣ', 'son', 'son'], ['ΘΕΟΥ', 'of the god'],
    ['ΑΝΙΚΗΤΟΥ', 'unconquered', 'never'], ['ΑΡΕΩΣ', 'Ares', 'mahrem']
  ];
  const NAMES = [
    ['Ezana', ['ezana']], ['Aksum', ['aksum']], ['Himyar', ['himyar']], ['Raydan', ['raydan']], ['Saba', ['saba']],
    ['Beja', ['beja']], ['Kasu', ['kasu']], ['King of kings', ['king', 'kings']], ['Mahrem = Ares', ['mahrem']], ['Unconquered', ['never']]
  ];

  const base = (w) => [...w].map((ch) => POS[ch] ? CLASSES[POS[ch][0]].geez : ch).join('');
  const musnad = (w) => [...w].map((ch) => POS[ch] ? (MUSNAD[POS[ch][0]] || '') : '').join('');
  const ETH = '"Noto Serif Ethiopic", "Abyssinica SIL", "Nyala", serif';
  const OSA = '"Noto Sans Old South Arabian", "Segoe UI Historic", serif';
  const GRK = '"Times New Roman", Georgia, serif';

  // mat: BoxGeometry material slot (0 +x right, 1 −x left, 4 +z front, 5 −z back); angle: stone rotation that faces it to the viewer
  const FACES = [
    { id: 'voc', label: "Ge'ez, vocalized", mat: 4, angle: 0, font: ETH, dir: 'ltr', sep: '፡', geez: true,
      words: GEEZ.map(([t, en, k]) => ({ t, en, k })),
      text: "Every letter carries its vowel: ዔ is ዐ in its 5th order, ሱ is ሰ in its 2nd. This is the fidel in full. Ezana's inscriptions are the first known texts written this way." },
    { id: 'unv', label: "Ge'ez, unvocalized", mat: 0, angle: -Math.PI / 2, font: ETH, dir: 'ltr', sep: '፡', geez: true,
      words: GEEZ.map(([t, en, k]) => ({ t: base(t), en, k, from: t })),
      text: 'The same words with every letter in its base form. The reader supplied the vowels, as in Hebrew or Arabic without points. Ge\'ez was written like this until about AD 350.' },
    { id: 'osa', label: 'South Arabian letters', mat: 1, angle: Math.PI / 2, font: OSA, dir: 'rtl', sep: '|', geez: false,
      words: GEEZ.map(([t, en, k]) => ({ t: musnad(t), en, k, from: t })),
      text: "The same Ge'ez words in Musnad, the script of South Arabia, read right to left. Each Ge'ez letter is swapped for the Musnad letter it grew from. Scholars call this face pseudo-Sabaic: Ge'ez language in borrowed letters." },
    { id: 'grk', label: 'Greek', mat: 5, angle: Math.PI, font: GRK, dir: 'ltr', sep: '', geez: false,
      words: GREEK.map(([t, en, k]) => ({ t, en, k })),
      text: "Greek, the language of Red Sea trade. The titles run in the same order. Where the Ge'ez names Mahrem, the Greek names Ares, the god the Greeks matched with him." }
  ];

  const $ = (id) => document.getElementById(id);
  let face = 0, lit = new Set(), api = null;

  // ---------- Reading panel ----------
  function letterButtons(word, f) {
    if (!f.geez && f.id !== 'osa') return word.t;
    const src = f.id === 'osa' ? [...word.from] : [...word.t];
    const shown = f.id === 'osa' ? [...word.t] : src;
    return src.map((ch, i) => {
      const p = POS[ch];
      if (!p) return ch;
      const o = f.id === 'voc' ? p[1] : 0;
      return `<button type="button" class="ez-l" data-letter="${p[0]},${o}" aria-label="Letter profile ${CLASSES[p[0]][FORMS[o]]}">${shown[i] || ''}</button>`;
    }).join('');
  }
  function renderRead() {
    const f = FACES[face];
    document.querySelectorAll('#ezFaces button').forEach((b, i) => b.setAttribute('aria-selected', String(i === face)));
    $('ezRead').innerHTML =
      `<div class="ez-read-head"><b>${f.label}</b><span>${f.text}</span></div>` +
      `<div class="ez-line ${f.id === 'grk' ? 'grk' : f.id === 'osa' ? 'osa' : 'ge'}" dir="${f.dir}">` +
      f.words.map((w) => `<span class="ez-w${w.k && lit.has(w.k) ? ' hl' : ''}"><span class="ez-t">${letterButtons(w, f)}</span><span class="ez-en" dir="ltr">${w.en}</span></span>`).join('') +
      `</div>`;
  }

  // ---------- Stone surface (canvas textures) ----------
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function stoneCanvases(w, h, seed) {
    const r = rng(seed);
    const col = document.createElement('canvas'), bump = document.createElement('canvas');
    col.width = bump.width = w; col.height = bump.height = h;
    const a = col.getContext('2d'), b = bump.getContext('2d');
    a.fillStyle = '#8f897f'; a.fillRect(0, 0, w, h);
    b.fillStyle = '#d8d8d8'; b.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {                     // broad tonal patches
      const x = r() * w, y = r() * h, rad = (0.1 + r() * 0.35) * w;
      const g = a.createRadialGradient(x, y, 0, x, y, rad);
      const dark = r() < 0.55;
      g.addColorStop(0, dark ? 'rgba(60,52,44,0.16)' : 'rgba(205,196,180,0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      a.fillStyle = g; a.fillRect(0, 0, w, h);
    }
    const n = Math.floor(w * h / 30);
    for (let i = 0; i < n; i++) {                      // grain
      const x = r() * w, y = r() * h, s = 1 + r() * 1.6, v = r();
      a.fillStyle = v < 0.5 ? `rgba(40,36,30,${0.05 + r() * 0.16})` : `rgba(235,228,214,${0.04 + r() * 0.12})`;
      a.fillRect(x, y, s, s);
      b.fillStyle = `rgba(${v < 0.5 ? 0 : 255},${v < 0.5 ? 0 : 255},${v < 0.5 ? 0 : 255},${0.08 + r() * 0.12})`;
      b.fillRect(x, y, s, s);
    }
    return { col, bump, a, b, r };
  }

  const PX = 560, W = 1.0, H = 2.4, DEP = 0.5, TOP = 0.56, BOT = 0.16;
  function carveFace(f, idx) {
    const wu = (f.mat === 0 || f.mat === 1) ? DEP : W;
    const cw = Math.round(wu * PX), ch = Math.round(H * PX);
    const s = stoneCanvases(cw, ch, 101 + idx * 17);
    const { a, b } = s;
    const mx = cw * 0.09, top = TOP * PX, avail = (H - TOP - BOT) * PX, inner = cw - 2 * mx;
    const toks = [];
    f.words.forEach((w, i) => { toks.push({ t: w.t, k: w.k }); if (f.sep && i < f.words.length - 1) toks.push({ t: f.sep, sep: true }); });
    // Largest font size at which the words wrap inside the face
    let size = 72, lines;
    const layout = (sz) => {
      a.font = `600 ${sz}px ${f.font}`;
      const gap = sz * (f.sep ? 0.18 : 0.42);
      const out = [[]]; let x = 0;
      toks.forEach((t) => {
        const tw = a.measureText(t.t).width;
        if (x > 0 && x + tw > inner && !t.sep) { out.push([]); x = 0; }
        out[out.length - 1].push({ ...t, w: tw }); x += tw + gap;
      });
      return { out, gap };
    };
    for (; size > 12; size -= 2) {
      const L = layout(size);
      const tooWide = L.out.some((ln) => ln.some((t) => t.w > inner));
      if (!tooWide && L.out.length * size * 1.5 <= avail) { lines = L; break; }
    }
    if (!lines) lines = layout(size);
    const lh = size * 1.5;
    a.textBaseline = b.textBaseline = 'alphabetic';
    b.font = a.font;
    try { b.filter = `blur(${Math.max(0.6, size / 40)}px)`; } catch (e) { /* no canvas filter */ }
    lines.out.forEach((ln, li) => {
      const y = top + li * lh + size;
      let x = f.dir === 'rtl' ? cw - mx : mx;
      ln.forEach((t) => {
        const px = f.dir === 'rtl' ? x - t.w : x;
        const hl = t.k && lit.has(t.k);
        a.direction = b.direction = f.dir;
        a.textAlign = b.textAlign = 'left';
        a.fillStyle = 'rgba(250,244,230,0.10)'; a.fillText(t.t, px + size * 0.03, y + size * 0.03);  // lit lower lip of the groove
        a.fillStyle = hl ? 'rgba(168,58,28,0.92)' : 'rgba(70,62,54,0.22)'; a.fillText(t.t, px, y);
        b.fillStyle = '#000'; b.fillText(t.t, px, y);
        x += (f.dir === 'rtl' ? -1 : 1) * (t.w + lines.gap);
      });
    });
    try { b.filter = 'none'; } catch (e) { /* ignore */ }
    for (let i = 0; i < 14; i++) {                      // weathering: soft losses across the text
      const x = s.r() * cw, y = top + s.r() * avail, rad = (0.03 + s.r() * 0.07) * cw * (wu === W ? 1 : 2);
      const ga = a.createRadialGradient(x, y, 0, x, y, rad); ga.addColorStop(0, 'rgba(143,137,127,0.55)'); ga.addColorStop(1, 'rgba(143,137,127,0)');
      a.fillStyle = ga; a.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      const gb = b.createRadialGradient(x, y, 0, x, y, rad); gb.addColorStop(0, 'rgba(216,216,216,0.5)'); gb.addColorStop(1, 'rgba(216,216,216,0)');
      b.fillStyle = gb; b.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    return s;
  }

  // ---------- 3D ----------
  function loadThree() {
    if (window.THREE) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'vendor/three.min.js?v=r128'; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const all = Promise.all([
      document.fonts.load('600 48px "Noto Serif Ethiopic"', 'ዔዛና'),
      document.fonts.load('48px "Noto Sans Old South Arabian"', '𐩠𐩡')
    ]).catch(() => {});
    return Promise.race([all, new Promise((r) => setTimeout(r, 3500))]);
  }

  function build3D() {
    const T = window.THREE, stage = $('ezStage'), canvas = $('ezCanvas');
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(28, 1, 0.1, 50);
    camera.position.set(0, 0.35, 6.4); camera.lookAt(0, 0.05, 0);

    // Stele: a tapered slab with a worn, rounded top and an uneven surface
    const geo = new T.BoxGeometry(W, H, DEP, 28, 64, 14);
    const p = geo.attributes.position;
    const nz = (x, y, z) => Math.sin(x * 7.1 + y * 3.3) * 0.5 + Math.sin(y * 11.7 + z * 5.1 + 1.3) * 0.3 + Math.sin(z * 13.3 + x * 9.7 + y * 2.1) * 0.2;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = nz(x, y, z);
      const taper = 1 - 0.07 * (y / H + 0.5);
      const start = H / 2 - 0.5;
      if (y > start) {
        const ex = Math.abs(x) / (W / 2), ez = Math.abs(z) / (DEP / 2);
        const topY = H / 2 - 0.3 * Math.pow(ex, 2.2) - 0.06 * Math.pow(ez, 2) + 0.025 * nz(x * 2, 0, z * 2);
        y = start + (y - start) * (topY - start) / 0.5;
      }
      x = x * taper * (1 + 0.012 * n);
      z = z * taper * (1 + 0.03 * nz(z, x, y));
      p.setXYZ(i, x, y - 0.06, z);
    }
    geo.computeVertexNormals();

    const aniso = renderer.capabilities.getMaxAnisotropy();
    const plain = stoneCanvases(256, 256, 7);
    const mk = (s) => {
      const map = new T.CanvasTexture(s.col); map.encoding = T.sRGBEncoding; map.anisotropy = aniso;
      const bump = new T.CanvasTexture(s.bump); bump.anisotropy = aniso;
      return new T.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 0.04, roughness: 0.93, metalness: 0 });
    };
    const mats = [0, 1, 2, 3, 4, 5].map(() => mk(plain));
    const carveAll = () => FACES.forEach((f, i) => {
      const s = carveFace(f, i), m = mats[f.mat];
      m.map.image = s.col; m.bumpMap.image = s.bump;
      m.map.needsUpdate = m.bumpMap.needsUpdate = true;
    });
    // the face materials need their own textures, not the shared plain one
    FACES.forEach((f) => { mats[f.mat] = mk(stoneCanvases(8, 8, 1)); });
    carveAll();
    const stone = new T.Mesh(geo, mats);
    scene.add(stone);

    // Ground shadow
    const sh = document.createElement('canvas'); sh.width = sh.height = 128;
    const sg = sh.getContext('2d'), gr = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 128, 128);
    const ground = new T.Mesh(new T.PlaneGeometry(2.4, 1.4), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sh), transparent: true, depthWrite: false }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -H / 2 - 0.06; scene.add(ground);

    scene.add(new T.AmbientLight(0xffffff, 0.22));
    scene.add(new T.HemisphereLight(0xdfe6ef, 0x3a3128, 0.28));
    const key = new T.DirectionalLight(0xfff1dc, 1.35); scene.add(key);
    const setLight = (deg) => {
      const r = deg * Math.PI / 180;
      key.position.set(Math.sin(r) * 6, 2.2, Math.cos(r) * 6);
      need();
    };

    let rot = 0, target = 0, raf = 0, drag = null;
    function need() { if (!raf) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      if (!drag) rot += (target - rot) * 0.14;
      stone.rotation.y = rot;
      renderer.render(scene, camera);
      const nearest = nearestFace(rot);
      if (nearest !== face) { face = nearest; renderRead(); }
      if (!drag && Math.abs(target - rot) > 0.0005) need();
    }
    function nearestFace(r) {
      let best = 0, bd = 9;
      FACES.forEach((f, i) => {
        let d = ((r - f.angle) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        d = Math.abs(d); if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function turnTo(i) {
      const a = FACES[i].angle;
      let d = ((a - target) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;   // shortest way round
      target += d; need();
    }
    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h < 0.8 ? 34 : 28;
      camera.updateProjectionMatrix(); need();
    }
    canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, r: rot }; canvas.setPointerCapture(e.pointerId); stage.classList.add('dragging'); });
    canvas.addEventListener('pointermove', (e) => { if (!drag) return; rot = target = drag.r + (e.clientX - drag.x) * 0.012; stone.rotation.y = rot; need(); });
    const end = () => { if (!drag) return; drag = null; stage.classList.remove('dragging'); turnTo(nearestFace(rot)); };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); target -= Math.PI / 2; need(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); target += Math.PI / 2; need(); }
    });
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
    resize();
    setLight(Number($('ezLight').value));
    return { turnTo, setLight, recarve: () => { carveAll(); need(); } };
  }

  // ---------- Wiring ----------
  document.addEventListener('DOMContentLoaded', () => {
    const panel = $('ezana');
    if (!panel || !D) return;
    $('ezFaces').innerHTML = FACES.map((f, i) => `<button type="button" role="tab" data-f="${i}">${f.label}</button>`).join('');
    $('ezNames').insertAdjacentHTML('beforeend', NAMES.map(([l, ks], i) => `<button type="button" data-n="${i}" aria-pressed="false">${l}</button>`).join(''));
    renderRead();

    $('ezFaces').addEventListener('click', (e) => {
      const b = e.target.closest('[data-f]'); if (!b) return;
      face = Number(b.dataset.f); renderRead();
      if (api) api.turnTo(face);
    });
    $('ezNames').addEventListener('click', (e) => {
      const b = e.target.closest('[data-n]'); if (!b) return;
      const ks = NAMES[Number(b.dataset.n)][1], on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      ks.forEach((k) => (on ? lit.add(k) : lit.delete(k)));
      renderRead();
      if (api) api.recarve();
    });
    $('ezLight').addEventListener('input', (e) => { if (api) api.setLight(Number(e.target.value)); });

    let started = false;
    const start = () => {
      if (started) return; started = true;
      Promise.all([loadThree(), fontsReady()]).then(() => {
        api = build3D();
        $('ezLoading').hidden = true;
        if (document.fonts) document.fonts.addEventListener('loadingdone', () => api && api.recarve());
      }).catch(() => {
        $('ezLoading').textContent = 'The 3D stone needs WebGL. The four faces can still be read below.';
      });
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: '300px' });
      io.observe(panel);
    } else start();
  });
})();
