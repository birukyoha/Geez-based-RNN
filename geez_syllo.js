/**
 * Ge'ez RNN Cipher — Syllographic property: the fidel as a living grid
 * 26 classes × 7 orders. Each cell is one consonant + one vowel. Two views add layers:
 *   Homophones: letters that sound alike in Amharic but were distinct sounds in Ge'ez,
 *               each with its own South Arabian ancestor (ሀ ሐ ኀ · ሰ ሠ · አ ዐ · ጸ ፀ).
 *   Amharic letters: the eight classes Amharic built from Ge'ez letters (ሸ from ሰ, …).
 * Data: geez_dataset.js (ethiopianClasses, amharicClasses, syllographicHomophones).
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;
  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D.ethiopianClasses.slice(0, 26);
  const AMH = D.amharicClasses || [];
  const PAIRS = D.syllographicHomophones || [];

  // Consonant of each class (Ge'ez values) and the seven vowels
  const CONS = ['h', 'l', 'ḥ', 'm', 'ś', 'r', 's', 'q', 'b', 't', 'ḫ', 'n', 'ʾ', 'k', 'w', 'ʿ', 'z', 'y', 'd', 'g', 'ṭ', 'p̣', 'ṣ', 'ṣ́', 'f', 'p'];
  const AMH_CONS = { 'ሸ': 'š', 'ቨ': 'v', 'ቸ': 'č', 'ኘ': 'ñ', 'ኸ': 'x', 'ዠ': 'ž', 'ጀ': 'ǧ', 'ጨ': 'č̣' };
  const VOWELS = ['ä', 'u', 'i', 'a', 'e', 'ə', 'o'];
  const ORDER_NAMES = ['ግዕዝ', 'ካዕብ', 'ሣልስ', 'ራብዕ', 'ኃምስ', 'ሳድስ', 'ሳብዕ'];
  const MARKS = ['the base form', 'a short stroke at the middle of the right side', 'a short stroke at the foot of the right leg',
    'the right leg lengthened, or the left leg shortened', 'a small ring at the foot of the right leg', 'a bend, break or ring; it varies most',
    'the left leg lengthened, or a ring on top'];
  const MUSNAD = { 0: '𐩠', 2: '𐩢', 10: '𐩭', 6: '𐩯', 4: '𐩦', 12: '𐩱', 15: '𐩲', 22: '𐩮', 23: '𐩳' };
  // Homophone groups: classes that merged in Amharic pronunciation
  const GROUPS = [
    { key: 'h', classes: [0, 2, 10], sound: 'h', was: ['h, as in "hat"', 'ḥ, a deep throat h', 'ḫ, like ch in "Bach"'] },
    { key: 's', classes: [6, 4], sound: 's', was: ['s', 'ś, a lateral s, close to Welsh ll'] },
    { key: 'a', classes: [12, 15], sound: 'glottal stop', was: ['ʾ, a glottal stop', 'ʿ, a voiced throat sound'] },
    { key: 'ts', classes: [22, 23], sound: 'ṣ', was: ['ṣ, an ejective s', 'ṣ́, an ejective lateral sound'] }
  ];
  const groupOf = (c) => GROUPS.find((g) => g.classes.includes(c));
  window.GeezSyllo = { CONS, VOWELS, ORDER_NAMES, MARKS, groupOf, MUSNAD };

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('syGrid')) return;
    let mode = 'all', sel = { amh: false, c: 0, o: 0 };

    function grid() {
      const head = `<div class="sy-corner"></div>${VOWELS.map((v, o) => `<div class="sy-colh"><span class="mono">${v}</span><span class="ge">${ORDER_NAMES[o]}</span></div>`).join('')}`;
      const rows = CLASSES.map((cls, c) => {
        const g = groupOf(c);
        return `<div class="sy-rowh"><span class="mono">${CONS[c]}</span></div>` + FORMS.map((f, o) =>
          `<button type="button" class="sy-cell${g ? ' grp-' + g.key : ''}" data-c="${c}" data-o="${o}" aria-label="${cls[f]}, ${CONS[c]}${o === 5 ? '' : VOWELS[o]}">${cls[f]}</button>`).join('');
      }).join('');
      const amh = AMH.map((a, i) => `<div class="sy-rowh amh"><span class="mono">${AMH_CONS[a.geez] || ''}</span></div>` + FORMS.map((f, o) =>
        `<button type="button" class="sy-cell amh" data-a="${i}" data-o="${o}" aria-label="${a[f]}">${a[f]}</button>`).join('')).join('');
      $('syGrid').innerHTML = head + rows + `<div class="sy-sep">Amharic letters</div>` + amh;
    }

    function render() {
      $('syGrid').dataset.mode = mode;
      document.querySelectorAll('[data-sy-mode]').forEach((b) => {
        b.classList.toggle('active', b.dataset.syMode === mode);
        b.setAttribute('aria-pressed', String(b.dataset.syMode === mode));
      });
      $('syGrid').querySelectorAll('.sy-cell').forEach((el) => el.classList.remove('sel', 'kin', 'base'));
      const o = sel.o;
      let html = '';
      if (sel.amh) {
        const a = AMH[sel.c];
        const base = CLASSES.findIndex((k) => k.geez === a.from);
        $('syGrid').querySelector(`.sy-cell[data-a="${sel.c}"][data-o="${o}"]`).classList.add('sel');
        if (base >= 0) $('syGrid').querySelector(`.sy-cell[data-c="${base}"][data-o="${o}"]`).classList.add('base');
        html = `<div class="sy-head"><span class="sy-big ge">${a[FORMS[o]]}</span><div><h4>${a.name} · ${ORDER_NAMES[o]}</h4><span class="sub">An Amharic letter, not one of the 26 Ge'ez classes</span></div></div>` +
          `<dl class="cube-props">` +
          `<div><dt>Sound</dt><dd><span class="mono">${AMH_CONS[a.geez] || ''}${o === 5 ? '' : VOWELS[o]}</span></dd></div>` +
          `<div><dt>Built from</dt><dd><span class="ge sy-from">${a.from}</span> → <span class="ge sy-from">${a.geez}</span> <span class="sub">The Amharic letter reuses the shape of a Ge'ez letter with a related sound and adds a small stroke.</span></dd></div>` +
          `<div><dt>Order mark</dt><dd>${MARKS[o]}</dd></div></dl>`;
      } else {
        const c = sel.c, cls = CLASSES[c], g = groupOf(c);
        $('syGrid').querySelector(`.sy-cell[data-c="${c}"][data-o="${o}"]`).classList.add('sel');
        if (g) g.classes.filter((k) => k !== c).forEach((k) => $('syGrid').querySelector(`.sy-cell[data-c="${k}"][data-o="${o}"]`).classList.add('kin'));
        AMH.forEach((a, i) => { if (a.from === cls.geez) $('syGrid').querySelector(`.sy-cell[data-a="${i}"][data-o="${o}"]`).classList.add('base'); });
        const sound = CONS[c] + (o === 5 ? '(ə)' : VOWELS[o]);
        let homo = '';
        if (g) {
          // Word pairs whose spellings differ only by letters of this group
          const formsOf = (k) => FORMS.map((f) => CLASSES[k][f]);
          const inPair = (p, k) => formsOf(k).some((ch) => p.pair.includes(ch));
          const pairs = [];
          PAIRS.filter((p) => g.classes.filter((k) => inPair(p, k)).length >= 2).forEach((w) => {
            const grp = pairs.find((x) => x[0].pair === w.pair);
            if (grp) grp.push(w); else pairs.push([w]);
          });
          homo = `<div class="sy-homo"><span class="label">Sounds the same in Amharic</span>` +
            `<div class="sy-group">${g.classes.map((k, i) => `<span class="${k === c ? 'on' : ''}"><b class="ge">${CLASSES[k][FORMS[o]]}</b><span class="osa">${MUSNAD[k] || ''}</span><span class="hint">${g.was[i]}</span></span>`).join('')}</div>` +
            `<p class="hint">In Ge'ez each was its own sound, inherited from a different South Arabian letter. Amharic speech merged them, but the spelling keeps them apart, and changing the letter changes the word:</p>` +
            (pairs.length ? `<ul class="sy-pairs">${pairs.slice(0, 3).map((p) => `<li>${p.map((w) => `<span class="ge">${w.geez}</span> ${w.english.toLowerCase()}`).join(' · ')}</li>`).join('')}</ul>` : '') + `</div>`;
        }
        const amhKids = AMH.filter((a) => a.from === cls.geez);
        html = `<div class="sy-head"><span class="sy-big ge">${cls[FORMS[o]]}</span><div><h4>${cls.name} · ${ORDER_NAMES[o]}</h4><span class="sub">Class ${c + 1}, order ${o + 1}</span></div></div>` +
          `<dl class="cube-props">` +
          `<div><dt>Syllable</dt><dd><span class="mono">${CONS[c]}</span> + <span class="mono">${VOWELS[o]}</span> = <b class="mono">${sound}</b>${o === 5 ? ' <span class="sub">The 6th order also writes a consonant with no vowel.</span>' : ''}</dd></div>` +
          `<div><dt>Order mark</dt><dd>${MARKS[o]}</dd></div>` +
          `<div><dt>All seven</dt><dd class="ge sy-row">${FORMS.map((f, k) => `<span class="${k === o ? 'on' : ''}">${cls[f]}</span>`).join('')}</dd></div>` +
          (amhKids.length ? `<div><dt>Amharic child</dt><dd><span class="ge sy-from">${amhKids.map((a) => a.geez).join(' ')}</span> <span class="sub">Built from this letter for a sound Ge'ez did not have</span></dd></div>` : '') +
          `</dl>` + homo + `<div class="btn-row"><button type="button" class="btn small lp-open-btn" data-letter="${c},${o}">Full letter profile</button></div>`;
      }
      $('syInfo').innerHTML = html;
    }

    grid();
    $('syGrid').addEventListener('click', (e) => {
      const b = e.target.closest('.sy-cell');
      if (!b) return;
      sel = b.dataset.a !== undefined ? { amh: true, c: Number(b.dataset.a), o: Number(b.dataset.o) } : { amh: false, c: Number(b.dataset.c), o: Number(b.dataset.o) };
      render();
    });
    document.querySelectorAll('[data-sy-mode]').forEach((b) => b.addEventListener('click', () => {
      mode = b.dataset.syMode;
      if (mode === 'homophones' && (sel.amh || !groupOf(sel.c))) sel = { amh: false, c: 6, o: 0 };
      if (mode === 'amharic' && !sel.amh) sel = { amh: true, c: 0, o: 0 };
      render();
    }));
    render();
  });
})();
