/**
 * Ge'ez RNN Cipher — Pictographic property: from picture to letter
 * After Bekerie (1997). Each letter starts as a picture of a thing. The sign stands for the
 * first sound of the thing's name (acrophony): Bet, "house", gives b. The picture is simplified
 * into the Proto-Ethiopic (Musnad) sign and then the classical Ge'ez letter, and Ge'ez adds
 * vowels by marking that letter, giving its seven orders.
 * Drawings are cut from Bekerie's tables (img/picto) and drawn in the page's ink colour.
 * Data: geez_dataset.js (ethiopianClasses).
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;
  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D.ethiopianClasses;

  const SCRIPTS = { egy: 'Egyptian', mer: 'Meroitic', sin: 'Sinaitic', cre: 'Cretan linear', merl: 'Meroitic linear' };
  // c = class index; thing = what the picture shows; sound = first sound of its name; osa = Unicode Musnad sign where certain
  const LETTERS = [
    { key: 'hoi', c: 0, name: 'Hoi', tr: 'hä', thing: 'a long-horned bull', sound: 'h', osa: '𐩠', pic: 'hoi-pic', proto: 'hoi-proto', eth: 'hoi-eth', note: 'The first graph of the alphabet.' },
    { key: 'yaman', c: 17, name: 'Yäman', tr: 'yä', thing: 'a fisted right hand', sound: 'y', osa: '𐩺', pic: 'yaman-pic', proto: 'yaman-proto', eth: 'yaman-eth' },
    { key: 'ayin', c: 15, name: 'Ayin', tr: 'ʿä', thing: 'an eye', sound: 'ʿ', osa: '𐩲', pic: 'ayin1-pic', proto: 'ayin1-proto', eth: 'ayin1-eth',
      trail: ['ayin-egy', 'ayin-mer', 'ayin-sin', 'ayin-cre'] },
    { key: 'bet', c: 8, name: 'Bét', tr: 'bä', thing: 'a house or temple', sound: 'b', osa: '𐩨', pic: 'bet-pic', proto: 'bet-proto', eth: 'bet-eth' },
    { key: 'gamal', c: 19, name: 'Gämal', tr: 'gä', thing: 'a camel', sound: 'g', osa: '𐩴', pic: 'gamal-pic', proto: 'gamal-proto', eth: 'gamal-eth' },
    { key: 'mai', c: 3, name: 'Mai', tr: 'mä', thing: 'water', sound: 'm', osa: '𐩣', pic: 'mai-pic', proto: 'mai-proto', eth: 'mai-eth' },
    { key: 'rees', c: 5, name: "Re'es", tr: 'rä', thing: 'a head', sound: 'r', osa: '𐩧', pic: 'rees-egy', proto: 'rees-proto', eth: 'rees-eth',
      trail: ['rees-sin', 'rees-cre'] },
    { key: 'taw', c: 9, name: 'Taw', tr: 'tä', thing: 'a crossed mark', sound: 't', osa: '𐩩', pic: 'taw-egy', proto: 'taw-proto', eth: 'taw-eth',
      trail: ['taw-sin', 'taw-cre'] },
    { key: 'saut', c: 4, name: 'Śawt', tr: 'śä', thing: 'a sign of plants or rays', sound: 'ś', osa: '', pic: 'saut-egy', proto: 'saut-proto', eth: 'saut-eth',
      trail: ['saut-mer', 'saut-sin', 'saut-merl'] }
  ];
  const ORDER_MARKS = [
    ['ግዕዝ', 'ä', 'the base form'],
    ['ካዕብ', 'u', 'a short stroke at the middle of the right side'],
    ['ሣልስ', 'i', 'a short stroke at the foot of the right leg'],
    ['ራብዕ', 'a', 'the right leg lengthened, or the left leg shortened'],
    ['ኃምስ', 'e', 'a small ring at the foot of the right leg'],
    ['ሳድስ', 'ə', 'a bend, break or ring; it varies most'],
    ['ሳብዕ', 'o', 'the left leg lengthened, or a ring on top']
  ];

  const ink = (name, cls = '') => `<span class="ink ${cls}" style="--src:url(img/picto/${name}.png)" aria-hidden="true"></span>`;
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('pictoChips')) return;
    let cur = 0, step = 0, timer = null;

    function stagesOf(L) {
      const cls = CLASSES[L.c];
      const st = [{ kind: 'pic', label: 'Picture', img: L.pic,
        text: `A picture of ${L.thing}. Its name, <b>${L.name}</b>, begins with the sound <b class="mono">${L.sound}</b>, so the picture stands for that sound.${L.note ? ' ' + L.note : ''}` }];
      (L.trail || []).forEach((t) => {
        const s = t.split('-')[1];
        st.push({ kind: 'trail', label: SCRIPTS[s], img: t, text: `The same sign as written in ${SCRIPTS[s]}, from the comparative table.` });
      });
      st.push({ kind: 'proto', label: 'Proto-Ethiopic', img: L.proto,
        text: `Simplified to a few strokes in the Proto-Ethiopic (Musnad) script${L.osa ? `: <span class="osa">${L.osa}</span>` : ''}. The picture is gone; the shape keeps its outline.` });
      st.push({ kind: 'eth', label: 'Geʿez letter', img: L.eth,
        text: `The classical Ge'ez letter <span class="ge">${cls.geez}</span> <span class="mono">${L.tr}</span>, the 1st order of the class ${cls.name}.` });
      st.push({ kind: 'orders', label: 'Seven orders',
        text: `Ge'ez writes the vowel by marking the letter, so one picture becomes seven syllables.` });
      return st;
    }

    function render() {
      const L = LETTERS[cur], cls = CLASSES[L.c], st = stagesOf(L);
      step = Math.min(step, st.length - 1);
      $('pictoChips').querySelectorAll('button').forEach((b, i) => {
        b.classList.toggle('active', i === cur);
        b.setAttribute('aria-pressed', String(i === cur));
      });
      $('pictoStrip').innerHTML = st.map((s, i) =>
        (i ? '<span class="picto-arrow" aria-hidden="true">→</span>' : '') +
        `<button type="button" class="picto-stage${i === step ? ' active' : ''}${i < step ? ' done' : ''}" data-i="${i}">` +
        `<span class="picto-thumb">${s.kind === 'orders' ? `<span class="ge">${FORMS.slice(0, 3).map((f) => cls[f]).join('')}…</span>` : ink(s.img)}</span>` +
        `<span class="picto-lbl">${s.label}</span></button>`).join('');
      const s = st[step];
      let big;
      if (s.kind === 'orders') {
        big = `<div class="picto-orders">${FORMS.map((f, o) =>
          `<div class="picto-order"><span class="ge">${cls[f]}</span><span class="mono">${ORDER_MARKS[o][1]}</span><span class="sub">${o + 1} · <span class="ge">${ORDER_MARKS[o][0]}</span></span></div>`).join('')}</div>` +
          `<ul class="picto-marks">${ORDER_MARKS.slice(1).map((m, o) => `<li><b>${o + 2}</b> <span class="ge">${m[0]}</span> (${m[1]}): ${m[2]}</li>`).join('')}</ul>` +
          `<p class="hint">The marks are the usual pattern; some letters bend them to fit their shape.</p>`;
      } else {
        big = `<div class="picto-big">${ink(s.img, 'big')}${s.kind === 'eth' ? `<span class="ge picto-font">${cls.geez}</span>` : ''}${s.kind === 'proto' && L.osa ? `<span class="osa picto-font">${L.osa}</span>` : ''}</div>`;
      }
      $('pictoView').innerHTML =
        `<div class="picto-view-head"><span class="badge rubric">${step + 1} / ${st.length} · ${s.label}</span>` +
        `<span class="picto-name"><span class="ge">${cls.geez}</span> ${L.name} <span class="hint">· ${cls.meaning || ''}</span></span></div>` +
        big + `<p class="picto-text">${s.text}</p>`;
      $('pictoPlay').textContent = timer ? 'Pause' : 'Play';
      // Keep the active stage in view on narrow screens without moving the page
      const wrap = $('pictoStrip').parentElement, act = $('pictoStrip').querySelector('.picto-stage.active');
      if (act && wrap.scrollWidth > wrap.clientWidth) {
        wrap.scrollTo({ left: Math.max(0, act.offsetLeft - (wrap.clientWidth - act.offsetWidth) / 2), behavior: 'smooth' });
      }
    }

    $('pictoChips').innerHTML = LETTERS.map((L) =>
      `<button type="button" aria-pressed="false"><span class="ge">${CLASSES[L.c].geez}</span>${L.name}</button>`).join('');
    $('pictoChips').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      cur = [...$('pictoChips').children].indexOf(b);
      step = 0;
      render();
    });
    $('pictoStrip').addEventListener('click', (e) => {
      const b = e.target.closest('.picto-stage');
      if (b) { stop(); step = Number(b.dataset.i); render(); }
    });
    function stop() { clearInterval(timer); timer = null; }
    $('pictoPrev').addEventListener('click', () => { stop(); step = Math.max(0, step - 1); render(); });
    $('pictoNext').addEventListener('click', () => { stop(); step = Math.min(stagesOf(LETTERS[cur]).length - 1, step + 1); render(); });
    $('pictoPlay').addEventListener('click', () => {
      if (timer) { stop(); render(); return; }
      if (step >= stagesOf(LETTERS[cur]).length - 1) step = 0;
      timer = setInterval(() => {
        if (step >= stagesOf(LETTERS[cur]).length - 1) { stop(); render(); return; }
        step++; render();
      }, 1800);
      render();
    });

    // Across scripts: the comparative rows rebuilt from the cut drawings
    const rows = [['ayin', 'ዐ', 'O'], ['rees', 'ረ', 'R'], ['taw', 'ተ', 'T'], ['saut', 'ሠ', 'S']];
    const have = new Set(['ayin-egy', 'ayin-mer', 'ayin-sin', 'ayin-cre', 'ayin-proto', 'ayin-eth', 'rees-egy', 'rees-sin', 'rees-cre', 'rees-proto', 'rees-eth',
      'taw-egy', 'taw-sin', 'taw-cre', 'taw-proto', 'taw-eth', 'saut-egy', 'saut-mer', 'saut-sin', 'saut-merl', 'saut-proto', 'saut-eth']);
    const cols = ['egy', 'mer', 'sin', 'cre', 'merl', 'proto', 'eth'];
    $('pictoTrail').innerHTML = rows.map(([k, g, s]) =>
      `<tr><th scope="row"><span class="ge">${g}</span> <span class="mono">${s}</span></th>${cols.map((c) =>
        `<td>${have.has(k + '-' + c) ? ink(k + '-' + c, 'cell') : '<span class="hint">–</span>'}</td>`).join('')}</tr>`).join('');

    render();
  });
})();
