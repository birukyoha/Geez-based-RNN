/**
 * Ge'ez RNN Cipher — The Ezana Stone (Home)
 * A 3D model of the stele in Aksum, shaped after photographs: a tall granite slab with a flat top,
 * Ge'ez on one broad face, Greek on the other, more lines down one narrow side, the other side rough.
 *   Ge'ez face   the royal titles as carved, consonants only (each letter in its base form);
 *                "Add the vowels" re-carves them as Ge'ez is read today, so the abjad → abugida step is
 *                generated, not pictured
 *   Greek face   the Greek titles in scriptio continua with the rounded letters seen on the stone (Ϲ Є ω)
 *   narrow side  the same Ge'ez words in South Arabian (Musnad) letters, right to left, each letter
 *                swapped for the one it grew from
 * The rest of each face is shown as worn rows. A raking light, name matching across faces and a close
 * look make it readable. Two coins show the change at his baptism: crescent and disc, then the cross.
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

  // The royal titles, in the order of the stone's Ge'ez: as read today, English gloss, key shared with the Greek
  const GEEZ = [
    ['ዔዛና', 'Ezana', 'ezana'], ['ንጉሠ', 'king of', 'king'], ['አክሱም', 'Aksum', 'aksum'],
    ['ወዘሐሜር', 'and of Himyar', 'himyar'], ['ወዘራይዳን', 'and of Raydan', 'raydan'], ['ወዘሳባ', 'and of Saba', 'saba'],
    ['ወዘሳልሕ', 'and of Salhen', 'salhen'], ['ወዘጽያሞ', 'and of Siyamo', 'siyamo'], ['ወዘቤጋ', 'and of Beja', 'beja'],
    ['ወዘካሱ', 'and of Kasu', 'kasu'], ['ንጉሠ', 'king of', 'king'], ['ነገሥት', 'kings', 'kings'],
    ['ወልደ', 'son of', 'son'], ['ኤላ', 'Ella', 'ella'], ['አሚዳ', 'Amida', 'amida'],
    ['በኃይለ', 'by the power of', 'power'], ['እግዚአ', 'the Lord of', 'god'], ['ሰማይ', 'Heaven', 'god']
  ];
  const GREEK = [
    ['ΑΕΙΖΑΝΑΣ', 'Ezana', 'ezana'], ['ΒΑΣΙΛΕΥΣ', 'king', 'king'], ['ΑΞΩΜΙΤΩΝ', 'of the Aksumites', 'aksum'],
    ['ΚΑΙ', 'and'], ['ΟΜΗΡΙΤΩΝ', 'of the Himyarites', 'himyar'], ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΡΑΕΙΔΑΝ', 'Raydan', 'raydan'],
    ['ΚΑΙ', 'and'], ['ΑΙΘΙΟΠΩΝ', 'of the Ethiopians'], ['ΚΑΙ', 'and'], ['ΣΑΒΑΕΙΤΩΝ', 'of the Sabaeans', 'saba'],
    ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΣΙΛΕΗ', 'Silee', 'salhen'], ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΤΙΑΜΩ', 'Tiamo', 'siyamo'],
    ['ΚΑΙ', 'and'], ['ΒΟΥΓΑΕΙΤΩΝ', 'of the Beja', 'beja'], ['ΚΑΙ', 'and'], ['ΤΟΥ', 'of'], ['ΚΑΣΟΥ', 'Kasu', 'kasu'],
    ['ΒΑΣΙΛΕΥΣ', 'king', 'king'], ['ΒΑΣΙΛΕΩΝ', 'of kings', 'kings'], ['ΥΙΟΣ', 'son', 'son'], ['ΘΕΟΥ', 'of the god', 'god'],
    ['ΑΝΙΚΗΤΟΥ', 'unconquered'], ['ΑΡΕΩΣ', 'Ares', 'god']
  ];
  const NAMES = [
    ['Ezana', ['ezana']], ['Aksum', ['aksum']], ['Himyar', ['himyar']], ['Raydan', ['raydan']], ['Saba', ['saba']],
    ['Siyamo', ['siyamo']], ['Beja', ['beja']], ['Kasu', ['kasu']], ['King of kings', ['king', 'kings']], ['Son of', ['son']],
    ['The god: Ares / Lord of Heaven', ['god']]
  ];

  const base = (w) => [...w].map((ch) => POS[ch] ? CLASSES[POS[ch][0]].geez : ch).join('');
  const musnad = (w) => [...w].map((ch) => POS[ch] ? (MUSNAD[POS[ch][0]] || '') : '').join('');
  const uncial = (w) => w.replace(/Σ/g, 'Ϲ').replace(/Ε/g, 'Є').replace(/Ω/g, 'ω');
  const ETH = '"Noto Serif Ethiopic", "Abyssinica SIL", "Nyala", serif';
  const OSA = '"Noto Sans Old South Arabian", "Segoe UI Historic", serif';
  const GRK = '"Times New Roman", Georgia, serif';

  // mat: BoxGeometry material slot (0 +x right, 1 −x left, 4 +z front, 5 −z back); angle: stone rotation that brings it to the viewer
  const FACES = [
    { id: 'ge', label: "Ge'ez face", mat: 4, angle: 0, font: ETH, dir: 'ltr', sep: '፡', cpl: 15, sample: 'ሀ' },
    { id: 'grk', label: 'Greek face', mat: 5, angle: Math.PI, font: GRK, dir: 'ltr', sep: '', cpl: 22, sample: 'Α', stream: true },
    { id: 'osa', label: 'Narrow side', mat: 0, angle: -Math.PI / 2, font: OSA, dir: 'rtl', sep: '|', cpl: 7, sample: '𐩠' },
    { id: 'rough', label: 'Rough side', mat: 1, angle: Math.PI / 2 }
  ];
  const $ = (id) => document.getElementById(id);
  let face = 0, vocal = false, lit = new Set(), api = null;

  function wordsOf(f) {
    if (f.id === 'ge') return GEEZ.map(([t, en, k]) => ({ t: vocal ? t : base(t), en, k, from: t }));
    if (f.id === 'osa') return GEEZ.map(([t, en, k]) => ({ t: musnad(t), en, k, from: t }));
    if (f.id === 'grk') return GREEK.map(([t, en, k]) => ({ t, en, k }));
    return [];
  }
  const TEXT = {
    ge: () => vocal
      ? "Now with the vowels, as Ge'ez is read today: ዔ is ዐ in its 5th order, ሱ is ሰ in its 2nd. Writing every vowel became the rule in Ezana's own time; his later inscriptions are the first known texts written this way."
      : 'As carved: consonants only, every letter in its base form, divided by ፡. The reader supplied the vowels, as in Hebrew or Arabic without points. Tap "Add the vowels" to re-carve the face the modern way.',
    grk: () => 'Greek, the language of Red Sea trade, in the same order of titles. On the stone the letters run on with no spaces, in the rounded forms Ϲ Є ω; here the words are spaced to read. Where the Ge\'ez says "by the power of the Lord of Heaven", the Greek calls him son of the unconquered god Ares.',
    osa: () => "The same Ge'ez words in Musnad, the script of South Arabia, read right to left. Each Ge'ez letter is swapped for the Musnad letter it grew from. Scholars call this version pseudo-Sabaic: Ge'ez language in borrowed letters.",
    rough: () => 'One narrow side is left rough and pitted, as in the photographs of the stone in its shelter.'
  };

  // ---------- Reading panel ----------
  function letterButtons(word, f) {
    if (f.id === 'grk') return word.t;
    const src = [...word.from], shown = f.id === 'osa' ? [...word.t] : [...word.t];
    return src.map((ch, i) => {
      const p = POS[ch];
      if (!p) return shown[i] || '';
      const o = f.id === 'ge' && vocal ? p[1] : 0;
      return `<button type="button" class="ez-l" data-letter="${p[0]},${o}" aria-label="Letter profile ${CLASSES[p[0]][FORMS[o]]}">${shown[i] || ''}</button>`;
    }).join('');
  }
  function renderRead() {
    const f = FACES[face];
    document.querySelectorAll('#ezFaces button').forEach((b, i) => b.setAttribute('aria-selected', String(i === face)));
    $('ezVowels').hidden = f.id !== 'ge';
    $('ezVowels').setAttribute('aria-pressed', String(vocal));
    $('ezVowels').textContent = vocal ? 'Show as carved' : 'Add the vowels';
    const ws = wordsOf(f);
    $('ezRead').innerHTML =
      `<div class="ez-read-head"><b>${f.id === 'osa' ? 'Narrow side: South Arabian letters' : f.label}</b><span>${TEXT[f.id]()}</span></div>` +
      (ws.length ? `<div class="ez-line ${f.id === 'grk' ? 'grk' : f.id === 'osa' ? 'osa' : 'ge'}" dir="${f.dir}">` +
        ws.map((w) => `<span class="ez-w${w.k && lit.has(w.k) ? ' hl' : ''}"><span class="ez-t">${letterButtons(w, f)}</span><span class="ez-en" dir="ltr">${w.en}</span></span>`).join('') +
        `</div>` : '');
  }

  // ---------- Stone surface (canvas textures) ----------
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function granite(w, h, seed, rough) {
    const r = rng(seed);
    const col = document.createElement('canvas'), bump = document.createElement('canvas');
    col.width = bump.width = w; col.height = bump.height = h;
    const a = col.getContext('2d'), b = bump.getContext('2d');
    a.fillStyle = '#86847f'; a.fillRect(0, 0, w, h);
    b.fillStyle = '#d6d6d6'; b.fillRect(0, 0, w, h);
    for (let i = 0; i < 22; i++) {                     // broad tonal patches
      const x = r() * w, y = r() * h, rad = (0.15 + r() * 0.4) * Math.max(w, h * 0.3);
      const g = a.createRadialGradient(x, y, 0, x, y, rad), dark = r() < 0.5;
      g.addColorStop(0, dark ? 'rgba(52,50,46,0.15)' : 'rgba(196,192,184,0.13)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      a.fillStyle = g; a.fillRect(0, 0, w, h);
    }
    const n = Math.floor(w * h / 22);                  // granite speckle: black mica, white feldspar
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h, s = 0.8 + r() * 1.8, v = r();
      a.fillStyle = v < 0.45 ? `rgba(24,23,22,${0.10 + r() * 0.3})` : v < 0.85 ? `rgba(236,233,226,${0.06 + r() * 0.2})` : `rgba(150,128,104,${0.1 + r() * 0.15})`;
      a.fillRect(x, y, s, s);
      b.fillStyle = v < 0.5 ? `rgba(0,0,0,${0.06 + r() * 0.12})` : `rgba(255,255,255,${0.06 + r() * 0.12})`;
      b.fillRect(x, y, s, s);
    }
    if (rough) {                                       // pitted, unworked surface
      for (let i = 0; i < w * h / 160; i++) {
        const x = r() * w, y = r() * h, rad = 1.5 + r() * 5;
        b.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.35})`; b.beginPath(); b.arc(x, y, rad, 0, 7); b.fill();
        a.fillStyle = `rgba(30,28,26,${0.08 + r() * 0.12})`; a.beginPath(); a.arc(x, y, rad, 0, 7); a.fill();
      }
    }
    return { col, bump, a, b, r };
  }

  const PX = 520, W = 1.0, H = 2.9, DEP = 0.42, TOP = 0.2, BOT = 0.14;
  function carveFace(f, idx) {
    const wu = (f.mat === 0 || f.mat === 1) ? DEP : W;
    const cw = Math.round(wu * PX), ch = Math.round(H * PX);
    const s = granite(cw, ch, 101 + idx * 17, f.id === 'rough');
    if (f.id === 'rough') return s;
    const { a, b, r } = s;
    const mx = cw * 0.07, top = TOP * PX, bottom = ch - BOT * PX, inner = cw - 2 * mx;
    // Letter size from the stone's density: about f.cpl letters to a line
    a.font = `600 100px ${f.font}`;
    const size = Math.max(10, Math.floor(inner / f.cpl / (a.measureText(f.sample).width / 100)));
    a.font = b.font = `600 ${size}px ${f.font}`;
    const toks = [];
    const ws = wordsOf(f);
    if (f.stream) ws.forEach((w) => [...uncial(w.t)].forEach((c) => toks.push({ t: c, k: w.k })));          // scriptio continua
    else ws.forEach((w, i) => { toks.push({ t: w.t, k: w.k }); if (i < ws.length - 1) toks.push({ t: f.sep, sep: true }); });
    const gap = f.stream ? size * 0.04 : size * 0.12;
    const lines = [[]]; let x = 0;
    toks.forEach((t) => {
      t.w = a.measureText(t.t).width;
      if (x > 0 && x + t.w > inner && !t.sep) { lines.push([]); x = 0; }
      lines[lines.length - 1].push(t); x += t.w + gap;
    });
    const lh = size * 1.36;
    a.textBaseline = b.textBaseline = 'alphabetic'; a.textAlign = b.textAlign = 'left';
    try { b.filter = `blur(${Math.max(0.6, size / 34)}px)`; } catch (e) { /* no canvas filter */ }
    let y = top + size;
    lines.forEach((ln) => {
      let cx = f.dir === 'rtl' ? cw - mx : mx;
      ln.forEach((t) => {
        const px = f.dir === 'rtl' ? cx - t.w : cx, hl = t.k && lit.has(t.k);
        a.direction = b.direction = f.dir;
        a.fillStyle = 'rgba(250,246,236,0.10)'; a.fillText(t.t, px + size * 0.03, y + size * 0.03);
        a.fillStyle = hl ? 'rgba(176,60,28,0.95)' : 'rgba(44,42,38,0.24)'; a.fillText(t.t, px, y);
        b.fillStyle = '#000'; b.fillText(t.t, px, y);
        cx += (f.dir === 'rtl' ? -1 : 1) * (t.w + gap);
      });
      y += lh;
    });
    // The rest of the face: the long account of his campaigns, shown worn rather than invented
    for (; y < bottom; y += lh) {
      for (let px = mx; px < cw - mx; px += size * (0.5 + r() * 0.5)) {
        if (r() < 0.45) continue;
        const rx = size * (0.08 + r() * 0.18), ry = size * (0.15 + r() * 0.3), cy = y - size * (0.2 + r() * 0.5);
        b.fillStyle = `rgba(0,0,0,${0.18 + r() * 0.3})`; b.beginPath(); b.ellipse(px, cy, rx, ry, r() * 3, 0, 7); b.fill();
        a.fillStyle = `rgba(40,38,34,${0.06 + r() * 0.08})`; a.beginPath(); a.ellipse(px, cy, rx, ry, r() * 3, 0, 7); a.fill();
      }
    }
    try { b.filter = 'none'; } catch (e) { /* ignore */ }
    for (let i = 0; i < 10; i++) {                      // weathering: soft losses
      const wx = r() * cw, wy = top + r() * (bottom - top), rad = (0.05 + r() * 0.1) * cw * (wu === W ? 1 : 2);
      const ga = a.createRadialGradient(wx, wy, 0, wx, wy, rad); ga.addColorStop(0, 'rgba(134,132,127,0.5)'); ga.addColorStop(1, 'rgba(134,132,127,0)');
      a.fillStyle = ga; a.fillRect(wx - rad, wy - rad, rad * 2, rad * 2);
      const gb = b.createRadialGradient(wx, wy, 0, wx, wy, rad); gb.addColorStop(0, 'rgba(214,214,214,0.45)'); gb.addColorStop(1, 'rgba(214,214,214,0)');
      b.fillStyle = gb; b.fillRect(wx - rad, wy - rad, rad * 2, rad * 2);
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

    // Stele: a tall slab, slightly tapered, flat top with a worn shoulder, uneven faces
    const geo = new T.BoxGeometry(W, H, DEP, 28, 72, 12);
    const p = geo.attributes.position;
    const nz = (x, y, z) => Math.sin(x * 7.1 + y * 3.3) * 0.5 + Math.sin(y * 11.7 + z * 5.1 + 1.3) * 0.3 + Math.sin(z * 13.3 + x * 9.7 + y * 2.1) * 0.2;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = nz(x, y, z), taper = 1 - 0.05 * (y / H + 0.5), start = H / 2 - 0.22;
      if (y > start) {
        const ex = x / (W / 2), ez = Math.abs(z) / (DEP / 2);
        const shoulder = Math.pow(Math.max(0, ex - 0.55) / 0.45, 2) * 0.16;   // the rounded upper corner
        const topY = H / 2 - 0.03 * Math.pow(Math.abs(ex), 3) - shoulder - 0.025 * ez * ez + 0.012 * nz(x * 3, 0, z * 3);
        y = start + (y - start) * (topY - start) / 0.22;
      }
      x = x * taper * (1 + 0.01 * n);
      z = z * taper * (1 + 0.025 * nz(z, x, y));
      p.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();

    const aniso = renderer.capabilities.getMaxAnisotropy();
    const mk = (s) => {
      const map = new T.CanvasTexture(s.col); map.encoding = T.sRGBEncoding; map.anisotropy = aniso;
      const bump = new T.CanvasTexture(s.bump); bump.anisotropy = aniso;
      return new T.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 0.035, roughness: 0.9, metalness: 0 });
    };
    const mats = [0, 1, 2, 3, 4, 5].map((i) => mk(granite(256, i === 2 || i === 3 ? 128 : 256, 7 + i, false)));
    const carveAll = () => FACES.forEach((f, i) => {
      const s = carveFace(f, i), m = mats[f.mat];
      m.map.image = s.col; m.bumpMap.image = s.bump;
      m.map.needsUpdate = m.bumpMap.needsUpdate = true;
    });
    carveAll();
    const stone = new T.Mesh(geo, mats);
    scene.add(stone);

    // Ground shadow
    const sh = document.createElement('canvas'); sh.width = sh.height = 128;
    const sg = sh.getContext('2d'), gr = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 128, 128);
    const ground = new T.Mesh(new T.PlaneGeometry(2.2, 1.3), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sh), transparent: true, depthWrite: false }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -H / 2; scene.add(ground);

    scene.add(new T.AmbientLight(0xffffff, 0.2));
    scene.add(new T.HemisphereLight(0xdfe6ef, 0x3a3128, 0.3));
    const key = new T.DirectionalLight(0xfff1dc, 1.4); scene.add(key);
    const setLight = (deg) => {
      const r = deg * Math.PI / 180;
      key.position.set(Math.sin(r) * 6, 2.4, Math.cos(r) * 6);
      need();
    };

    // Camera: whole stone, or a close look at the top of the facing side
    const FAR = { y: 0.15, z: 7.2, ly: 0 }, NEAR = { y: H / 2 - 0.42, z: 2.3, ly: H / 2 - 0.5 };
    let cam = { ...FAR }, camT = FAR, close = false;
    let rot = 0, target = 0, raf = 0, drag = null;
    function need() { if (!raf) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      if (!drag) rot += (target - rot) * 0.14;
      ['y', 'z', 'ly'].forEach((k) => { cam[k] += (camT[k] - cam[k]) * 0.14; });
      camera.position.set(0, cam.y, cam.z); camera.lookAt(0, cam.ly, 0);
      stone.rotation.y = rot;
      renderer.render(scene, camera);
      const nearest = nearestFace(rot);
      if (nearest !== face) { face = nearest; renderRead(); }
      const moving = Math.abs(target - rot) > 0.0005 || Math.abs(camT.z - cam.z) > 0.002;
      if (!drag && moving) need();
    }
    function nearestFace(r) {
      let best = 0, bd = 9;
      FACES.forEach((f, i) => {
        const d = Math.abs(((r - f.angle) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function turnTo(i) {
      const d = ((FACES[i].angle - target) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;   // shortest way round
      target += d; need();
    }
    function zoom(on) { close = on; camT = on ? NEAR : FAR; need(); }
    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h < 0.8 ? 32 : 26;
      camera.updateProjectionMatrix(); need();
    }
    canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, r: rot }; canvas.setPointerCapture(e.pointerId); stage.classList.add('dragging'); });
    canvas.addEventListener('pointermove', (e) => { if (!drag) return; rot = target = drag.r + (e.clientX - drag.x) * 0.012; need(); });
    const end = () => { if (!drag) return; drag = null; stage.classList.remove('dragging'); turnTo(nearestFace(rot)); };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); target -= Math.PI / 2; need(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); target += Math.PI / 2; need(); }
    });
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
    resize();
    setLight(Number($('ezLight').value));
    return { turnTo, setLight, zoom, isClose: () => close, recarve: () => { carveAll(); need(); } };
  }

  // ---------- Coins: before and after baptism ----------
  function coin(christian) {
    const id = christian ? 'au' : 'ag';
    const metal = christian ? ['#fbe8a6', '#e2b552', '#a8771f', '#6e4c12'] : ['#f4f5f6', '#c9ccd0', '#8e939a', '#555a60'];
    const beads = Array.from({ length: 64 }, (_, i) => { const a = i / 64 * Math.PI * 2; return `<circle cx="${(100 + 91 * Math.cos(a)).toFixed(1)}" cy="${(100 + 91 * Math.sin(a)).toFixed(1)}" r="1.6"/>`; }).join('');
    const legend = christian ? 'ΗΖΑΝΑϹ + ΒΑϹΙΛΕΥϹ +' : 'ΗΖΑΝΑϹ · ΒΑϹΙΛΕΥϹ ·';
    const wheat = (side) => Array.from({ length: 9 }, (_, i) => {
      const t = i / 8, x = 100 + side * (40 - 6 * Math.sin(t * Math.PI)), y = 136 - t * 72;
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.2" ry="3.4" transform="rotate(${side * 20} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join('');
    const symbol = christian
      ? `<g class="coin-sym"><path d="M96 33h8v6h6v8h-6v6h-8v-6h-6v-8h6z"/></g>`
      : `<g class="coin-sym"><path d="M86 38a14 14 0 0 0 28 0a12 10 0 0 1-28 0z"/><circle cx="100" cy="34" r="4.5"/></g>`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${christian ? 'Gold coin of Ezana after his baptism, with a cross' : 'Coin of Ezana before his baptism, with crescent and disc'}">
      <defs><radialGradient id="g-${id}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${metal[0]}"/><stop offset=".55" stop-color="${metal[1]}"/><stop offset="1" stop-color="${metal[2]}"/></radialGradient>
        <path id="p-${id}" d="M100 23a77 77 0 1 1 0 154a77 77 0 1 1 0-154"/></defs>
      <circle cx="100" cy="100" r="97" fill="url(#g-${id})" stroke="${metal[3]}" stroke-width="2"/>
      <g fill="${metal[3]}" opacity=".55">${beads}</g>
      <circle cx="100" cy="100" r="64" fill="none" stroke="${metal[3]}" stroke-width="2.4" opacity=".75"/>
      <text font-family="Times New Roman, Georgia, serif" font-weight="700" font-size="17" letter-spacing="3" fill="${metal[3]}"><textPath href="#p-${id}" startOffset="5%" textLength="430" lengthAdjust="spacing">${legend}</textPath></text>
      <g fill="${metal[3]}" opacity=".85">
        ${christian ? `<g opacity=".8">${wheat(-1)}${wheat(1)}</g>` : ''}
        <path d="M62 154c2-18 16-28 30-30h16c16 4 28 14 30 30z"/>
        <path d="M92 66c12-4 24 2 26 14 1 5 0 8 3 12l3 5c-2 2-5 2-5 4 1 3-1 5-2 7 0 4-3 8-9 9l-2 7H92c-2-6-8-12-9-20-3-8-3-30 9-38z"/>
        <path d="M86 112l-9 18M90 114l-5 19" stroke="${metal[3]}" stroke-width="2.4" fill="none"/>
        ${christian ? '<path d="M88 72V58h5v9h5V54h5v13h5v-9h5v14z"/><circle cx="90.5" cy="54" r="2.6"/><circle cx="100.5" cy="50" r="2.6"/><circle cx="110.5" cy="54" r="2.6"/>' : '<path d="M83 92c-2-16 8-28 23-27 6 1 10 5 12 11-12-3-25 2-35 16z" opacity=".75"/>'}
      </g>
      ${symbol}
    </svg>`;
  }
  function buildCoins() {
    const box = $('ezCoins'); if (!box) return;
    box.innerHTML = [false, true].map((c) => `<figure class="ez-coin${c ? ' au' : ''}"><div class="ez-coin-disc" tabindex="0">${coin(c)}</div>` +
      `<figcaption><b>${c ? 'After his baptism' : 'Before his baptism'}</b><span>${c ? 'The cross takes the place of the old symbol, and crosses divide the words.' : 'Crescent and disc, the symbol of Aksum\'s old sky gods, crown the king.'}</span></figcaption></figure>`).join('');
    box.querySelectorAll('.ez-coin-disc').forEach((d) => {
      const tilt = (e) => {
        const r = d.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        d.style.setProperty('--rx', `${(-y * 24).toFixed(1)}deg`); d.style.setProperty('--ry', `${(x * 24).toFixed(1)}deg`);
        d.style.setProperty('--sx', `${(x * 100 + 50).toFixed(0)}%`); d.style.setProperty('--sy', `${(y * 100 + 50).toFixed(0)}%`);
      };
      d.addEventListener('pointermove', tilt);
      d.addEventListener('pointerdown', tilt);
      d.addEventListener('pointerleave', () => { d.style.setProperty('--rx', '0deg'); d.style.setProperty('--ry', '0deg'); });
    });
    $('ezSpot').addEventListener('click', () => {
      box.classList.remove('spot'); void box.offsetWidth; box.classList.add('spot');
    });
  }

  // ---------- Wiring ----------
  document.addEventListener('DOMContentLoaded', () => {
    const panel = $('ezana');
    if (!panel || !D) return;
    $('ezFaces').innerHTML = FACES.map((f, i) => `<button type="button" role="tab" data-f="${i}">${f.label}</button>`).join('');
    $('ezNames').insertAdjacentHTML('beforeend', NAMES.map(([l], i) => `<button type="button" data-n="${i}" aria-pressed="false">${l}</button>`).join(''));
    renderRead();
    buildCoins();

    $('ezFaces').addEventListener('click', (e) => {
      const b = e.target.closest('[data-f]'); if (!b) return;
      face = Number(b.dataset.f); renderRead();
      if (api) api.turnTo(face);
    });
    $('ezVowels').addEventListener('click', () => { vocal = !vocal; renderRead(); if (api) api.recarve(); });
    $('ezZoom').addEventListener('click', () => {
      if (!api) return;
      api.zoom(!api.isClose());
      $('ezZoom').textContent = api.isClose() ? 'See the whole stone' : 'Look closer';
      $('ezZoom').setAttribute('aria-pressed', String(api.isClose()));
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
        $('ezLoading').textContent = 'The 3D stone needs WebGL. The faces can still be read below.';
      });
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: '300px' });
      io.observe(panel);
    } else start();
  });
})();
