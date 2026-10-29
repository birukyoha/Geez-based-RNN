/**
 * Ge'ez RNN Cipher — Fidel Cube (sample)
 * A 26 × 7 × 5 model of the classical fidel:
 *   x = class (26), y = order (7), z = property layer (5).
 * Front to back the layers are Syllographic, Numeric, Astrographic, Ideographic, Pictographic,
 * from the letter as written today back to its origin. Every letter is a column through all five.
 * Ideographic and Pictographic belong to the whole class, so on those layers a class is one bar.
 *
 * The walkthrough is a fixed sample: one message, one key, one rotor start.
 * It shows how a cube cipher would move letters; it is not an encryption tool.
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

  // Old South Arabian (Musnad) ancestor of each class, in class order.
  // ጰ and ፐ were added in Ge'ez and have no Musnad ancestor.
  const MUSNAD = [
    ['𐩠', 'h'], ['𐩡', 'l'], ['𐩢', 'ḥ'], ['𐩣', 'm'], ['𐩦', 's²'], ['𐩧', 'r'], ['𐩯', 's³'],
    ['𐩤', 'q'], ['𐩨', 'b'], ['𐩩', 't'], ['𐩭', 'ḫ'], ['𐩬', 'n'], ['𐩱', 'ʾ'], ['𐩫', 'k'],
    ['𐩥', 'w'], ['𐩲', 'ʿ'], ['𐩸', 'z'], ['𐩺', 'y'], ['𐩵', 'd'], ['𐩴', 'g'], ['𐩷', 'ṭ'],
    [null, ''], ['𐩮', 'ṣ'], ['𐩳', 'ḍ'], ['𐩰', 'f'], [null, '']
  ];

  const LAYERS = [
    { key: 'syl', name: 'Syllographic' },
    { key: 'num', name: 'Numeric' },
    { key: 'ast', name: 'Astrographic' },
    { key: 'ide', name: 'Ideographic' },
    { key: 'pic', name: 'Pictographic' }
  ];

  const glyph = (c, o) => CLASSES[c][FORMS[o]];
  const value = (c, o) => CLASSES[c].baseValue * (o + 1);
  const day = (c, o) => c * 7 + o + 1;
  const idea = (c) => (CLASSES[c].meaning || '').split('/')[0].trim();
  const LOOK = new Map();
  CLASSES.forEach((cls, c) => FORMS.forEach((f, o) => LOOK.set(cls[f], [c, o])));
  const cellOfDay = (d) => [Math.floor((d - 1) / 7) % 26, (d - 1) % 7];

  // ---------- The sample ----------
  // Each letter moves by the cell of the key letter plus the cell of the rotor day:
  //   class' = (class + keyClass + rotorClass) mod 26,  order' = (order + keyOrder + rotorOrder) mod 7
  // The rotor advances one day of the 182-day cycle per letter. Decryption subtracts the same moves.
  const SAMPLE = { plain: 'ሰላም ለዓለም', key: 'ቃል', start: 37 };

  function walk(text, key, start, decrypt) {
    const keyCells = [...key].map((k) => LOOK.get(k)).filter(Boolean);
    const steps = [];
    let out = '', i = 0, seal = 0;
    for (const ch of text) {
      const hit = LOOK.get(ch);
      if (!hit) { out += ch; continue; }
      const [c, o] = hit;
      const [kc, ko] = keyCells[i % keyCells.length];
      const d = ((start - 1 + i) % 182) + 1;
      const [rc, ro] = cellOfDay(d);
      const sign = decrypt ? -1 : 1;
      const C = (((c + sign * (kc + rc)) % 26) + 26) % 26;
      const O = (((o + sign * (ko + ro)) % 7) + 7) % 7;
      out += glyph(C, O);
      seal += decrypt ? value(C, O) : value(c, o);
      steps.push({ n: i + 1, c, o, kc, ko, key: glyph(kc, ko), d, rc, ro, C, O });
      i++;
    }
    return { text: out, steps, seal };
  }

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const solid = $('cubeSolid');
    if (!solid) return;

    // ---------- Build five layers ----------
    const layerEls = [];
    const cells = LAYERS.map(() => ({}));   // cells[z]['c,o'] -> element
    LAYERS.forEach((L, z) => {
      const el = document.createElement('div');
      el.className = `cube-layer layer-${L.key}`;
      el.dataset.z = z;
      const tag = document.createElement('div');
      tag.className = 'cube-layer-tag';
      tag.innerHTML = `<span class="mono">${z + 1}</span> ${L.name}`;
      el.appendChild(tag);
      const perClass = L.key === 'ide' || L.key === 'pic';
      for (let c = 0; c < 26; c++) {
        if (perClass) {
          const t = tile(c, 0, z);
          t.classList.add('bar');
          t.style.gridColumn = c + 1;
          t.style.gridRow = '1 / span 7';
          if (L.key === 'ide') {
            t.innerHTML = `<span class="cube-word">${idea(c)}</span>`;
            t.setAttribute('aria-label', `${CLASSES[c].geez} class idea: ${CLASSES[c].meaning}`);
          } else {
            const [g] = MUSNAD[c];
            t.innerHTML = g
              ? `<span class="cube-osa">${g}</span><span class="cube-base ge">${CLASSES[c].geez}</span>`
              : `<span class="cube-osa none">·</span><span class="cube-base ge">${CLASSES[c].geez}</span>`;
            t.setAttribute('aria-label', `${CLASSES[c].geez} origin: ${g ? 'Musnad ' + g : 'Geʿez addition'}`);
          }
          el.appendChild(t);
          for (let o = 0; o < 7; o++) cells[z][c + ',' + o] = t;
        } else {
          for (let o = 0; o < 7; o++) {
            const t = tile(c, o, z);
            t.style.gridColumn = c + 1;
            t.style.gridRow = o + 1;
            if (L.key === 'syl') t.innerHTML = `<span class="ge">${glyph(c, o)}</span>`;
            if (L.key === 'num') t.innerHTML = `<span class="mono">${value(c, o)}</span>`;
            if (L.key === 'ast') t.innerHTML = `<span class="mono">${day(c, o)}</span>`;
            t.setAttribute('aria-label', `${glyph(c, o)} ${L.name}: ` +
              (L.key === 'syl' ? `class ${c + 1}, order ${o + 1}` : L.key === 'num' ? `value ${value(c, o)}` : `day ${day(c, o)} of 182`));
            el.appendChild(t);
            cells[z][c + ',' + o] = t;
          }
        }
      }
      solid.appendChild(el);
      layerEls.push(el);
    });
    function tile(c, o, z) {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'cube-tile';
      t.addEventListener('click', () => select(c, z >= 3 ? selectedOrderFor(c) : o));
      return t;
    }
    let sel = [0, 0];
    const selectedOrderFor = (c) => (sel[0] === c ? sel[1] : 0);

    // ---------- View: rotate, explode, solo a layer, fit ----------
    let exploded = true, rotX = -22, rotY = -32, solo = -1;
    const scene = $('cubeScene');
    const fitBox = $('cubeFit');
    const T = () => parseFloat(getComputedStyle(solid).getPropertyValue('--cube-t')) || 34;
    function place() {
      const gap = exploded ? 84 : T();
      layerEls.forEach((el, z) => {
        // A single shown layer moves to the middle plane so it reads at full size
        const zPos = solo >= 0 ? (z === solo ? 0 : (2 - z) * gap) : (2 - z) * gap;
        el.style.transform = `translateZ(${zPos}px)`;
        el.classList.toggle('dim', solo >= 0 && solo !== z);
      });
      solid.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    function fit() {
      const w = scene.clientWidth;
      if (!w) return;
      // Leave room for the layer labels and for the depth of five layers when turned
      fitBox.style.transform = `scale(${Math.min(0.92, (w - 16) / (T() * 26 + 520))})`;
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
    $('cubeIso').addEventListener('click', () => { rotX = -22; rotY = -32; place(); });

    // Layer chips: show all, or bring one property forward
    const chips = $('cubeLayerChips');
    chips.innerHTML = `<button type="button" class="active" data-z="-1">All five</button>` +
      LAYERS.map((L, z) => `<button type="button" data-z="${z}">${L.name}</button>`).join('');
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      solo = Number(b.dataset.z);
      chips.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
      if (solo >= 0) { rotX = 0; rotY = 0; }
      place();
    });
    window.addEventListener('resize', fit);

    // ---------- Inspector: the five properties of one letter ----------
    function mark(cls, c, o) {
      cells.forEach((layer) => layer[c + ',' + o].classList.add(cls));
    }
    function clear(...names) {
      names.forEach((n) => solid.querySelectorAll('.cube-tile.' + n).forEach((t) => t.classList.remove(n)));
    }
    function select(c, o) {
      sel = [c, o];
      clear('sel');
      mark('sel', c, o);
      const cls = CLASSES[c], ord = ORDERS[o] || {};
      const [g, tr] = MUSNAD[c];
      $('cubeGlyph').textContent = glyph(c, o);
      $('cubeName').textContent = cls.name;
      $('cubeSub').textContent = `Class ${c + 1} · ${ORDN[o]} order${ord.name ? ' · ' + ord.name : ''}`;
      $('cubeSyl').innerHTML = `<span class="ge">${cls.geez}</span> + vowel <span class="mono">${ord.vowel || ''}</span>`;
      $('cubeNum').innerHTML =
        `<span class="mono">${cls.baseValue} × ${o + 1} = <b>${value(c, o)}</b></span>` +
        `<div class="cube-orders">${FORMS.map((f, k) =>
          `<span class="${k === o ? 'cur' : ''}"><span class="ge">${cls[f]}</span> ${value(c, k)}</span>`).join('')}</div>`;
      $('cubeAst').innerHTML = `Day <b>${day(c, o)}</b> of 182${ord.day ? ' · ' + ord.day : ''} <span class="sub">Class covers days ${c * 7 + 1}–${c * 7 + 7}</span>`;
      $('cubeIde').innerHTML = `${cls.meaning || '–'} <span class="sub">Shared by all 7 orders of ${cls.geez}</span>`;
      $('cubePic').innerHTML = g
        ? `<span class="cube-osa-inline">${g}</span> Musnad <span class="mono">${tr}</span> · ${cls.pictoOrigin || ''}`
        : `Ge'ez addition, no Musnad ancestor · ${cls.pictoOrigin || ''}`;
      $('cubePos').textContent = `x ${c} · y ${o} · z 0–4`;
    }

    // ---------- Guided sample ----------
    const enc = walk(SAMPLE.plain, SAMPLE.key, SAMPLE.start, false);
    const dec = walk(enc.text, SAMPLE.key, SAMPLE.start, true);
    const N = enc.steps.length;            // letters
    const LAST = N + 1;                    // 0 = overview, 1..N letters, N+1 = result
    let step = 0, timer = null;

    // Static sample table
    const tb = $('cubeSteps');
    tb.innerHTML = enc.steps.map((s) =>
      `<tr data-step="${s.n}" tabindex="0">` +
      `<td>${s.n}</td><td class="glyph-cell">${glyph(s.c, s.o)}</td><td>${s.c}·${s.o}</td>` +
      `<td><span class="ge">${s.key}</span> +${s.kc} +${s.ko}</td>` +
      `<td>day ${s.d} → +${s.rc} +${s.ro}</td>` +
      `<td class="glyph-cell out">${glyph(s.C, s.O)}</td><td>${s.C}·${s.O}</td></tr>`).join('');
    tb.addEventListener('click', (e) => { const r = e.target.closest('tr'); if (r) go(Number(r.dataset.step)); });
    tb.addEventListener('keydown', (e) => {
      const r = e.target.closest('tr');
      if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(Number(r.dataset.step)); }
    });

    const dots = $('cubeDots');
    dots.innerHTML = Array.from({ length: LAST + 1 }, (_, i) =>
      `<button type="button" class="step-dot" data-step="${i}" aria-label="Go to step ${i}">${i === 0 ? '◇' : i === LAST ? '✓' : i}</button>`).join('');
    dots.addEventListener('click', (e) => { const d = e.target.closest('.step-dot'); if (d) go(Number(d.dataset.step)); });

    const row = (label, a, b) => `<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`;
    function propsTable(c, o, C, O) {
      const pic = (k) => MUSNAD[k][0] ? `<span class="cube-osa-inline">${MUSNAD[k][0]}</span>` : '·';
      return `<div class="table-wrap"><table class="cube-compare"><thead><tr><th>Layer</th><th>Plain</th><th>Cipher</th></tr></thead><tbody>` +
        row('Syllographic', `<span class="ge big">${glyph(c, o)}</span>`, `<span class="ge big">${glyph(C, O)}</span>`) +
        row('Numeric', value(c, o), value(C, O)) +
        row('Astrographic', `day ${day(c, o)}`, `day ${day(C, O)}`) +
        row('Ideographic', idea(c), idea(C)) +
        row('Pictographic', pic(c), pic(C)) +
        `</tbody></table></div>`;
    }

    function render() {
      clear('src', 'dst');
      tb.querySelectorAll('tr').forEach((r) => r.classList.toggle('active-step', Number(r.dataset.step) === step));
      dots.querySelectorAll('.step-dot').forEach((d) => {
        const k = Number(d.dataset.step);
        d.classList.toggle('active', k === step);
        d.classList.toggle('done', k < step);
      });
      const shown = enc.steps.slice(0, Math.min(step, N)).map((s) => glyph(s.C, s.O)).join('');
      $('cubeSoFar').innerHTML = shown ? `<span class="ge">${shown}</span>` : '<span class="hint">nothing yet</span>';
      $('cubeStepLabel').textContent = step === 0 ? 'Overview' : step === LAST ? 'Result' : `Letter ${step} of ${N}`;
      const card = $('cubeStepCard');

      if (step === 0) {
        card.innerHTML =
          `<h4>Sample: <span class="ge">${SAMPLE.plain}</span></h4>` +
          `<p>The message is <span class="ge">${SAMPLE.plain}</span>, the key is <span class="ge">${SAMPLE.key}</span> and the rotor starts on day ${SAMPLE.start} of the 182-day cycle.</p>` +
          `<p>Each letter moves to a new cell by the sum of two cells: the key letter's position and the rotor day's position. Classes wrap around 26 and orders wrap around 7. The rotor steps one day per letter, so the same letter lands somewhere different each time.</p>` +
          `<p class="hint">Press Next, or Play, to follow each letter through the five layers.</p>`;
        select(enc.steps[0].c, enc.steps[0].o);
        return;
      }
      if (step === LAST) {
        const ok = dec.text === SAMPLE.plain && dec.seal === enc.seal;
        card.innerHTML =
          `<h4>Result</h4>` +
          `<div class="cube-result"><span class="ge">${SAMPLE.plain}</span><span class="cube-arrow">→</span><span class="ge">${enc.text}</span></div>` +
          `<p>To read it back, the receiver subtracts the same key and rotor moves in the same order. In this sample that returns <span class="ge">${dec.text}</span>.</p>` +
          `<p>The numeric layer gives a check: the plain letters' values add up to <b class="mono">${enc.seal.toLocaleString()}</b>, and the letters recovered by reversing add up to <b class="mono">${dec.seal.toLocaleString()}</b>.</p>` +
          `<span class="status ${ok ? 'ok' : 'err'}">${ok ? 'The reverse returns the original message exactly.' : 'The reverse does not match.'}</span>`;
        enc.steps.forEach((s) => { mark('src', s.c, s.o); mark('dst', s.C, s.O); });
        return;
      }
      const s = enc.steps[step - 1];
      const sumC = s.c + s.kc + s.rc, sumO = s.o + s.ko + s.ro;
      card.innerHTML =
        `<h4><span class="ge">${glyph(s.c, s.o)}</span> → <span class="ge">${glyph(s.C, s.O)}</span></h4>` +
        `<dl class="cube-calc">` +
        `<div><dt>Plain letter</dt><dd><span class="ge">${glyph(s.c, s.o)}</span> is class ${s.c}, order ${s.o}</dd></div>` +
        `<div><dt>Key letter</dt><dd><span class="ge">${s.key}</span> adds +${s.kc} classes, +${s.ko} orders</dd></div>` +
        `<div><dt>Rotor</dt><dd>Day ${s.d} is the cell of <span class="ge">${glyph(s.rc, s.ro)}</span>: +${s.rc} classes, +${s.ro} orders</dd></div>` +
        `<div><dt>Sum</dt><dd class="mono">class ${sumC} mod 26 = ${s.C} · order ${sumO} mod 7 = ${s.O}</dd></div>` +
        `</dl>` + propsTable(s.c, s.o, s.C, s.O);
      mark('src', s.c, s.o);
      mark('dst', s.C, s.O);
      select(s.c, s.o);
    }
    function go(k) { step = Math.max(0, Math.min(LAST, k)); render(); }
    function stop() { clearInterval(timer); timer = null; $('cubePlay').textContent = 'Play'; }
    $('cubePrev').addEventListener('click', () => { stop(); go(step - 1); });
    $('cubeNext').addEventListener('click', () => { stop(); go(step + 1); });
    $('cubeRestart').addEventListener('click', () => { stop(); go(0); });
    $('cubePlay').addEventListener('click', () => {
      if (timer) { stop(); return; }
      if (step === LAST) go(0);
      $('cubePlay').textContent = 'Pause';
      timer = setInterval(() => { if (step >= LAST) stop(); else go(step + 1); }, 2200);
    });

    // Called by app.js when the Cube tab opens (sizes are 0 while the tab is hidden)
    window.renderGeezCube = () => { fit(); place(); };

    place();
    render();
  });

  window.GeezCube = { walk, glyph, value, day, SAMPLE };
})();
