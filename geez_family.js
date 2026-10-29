/**
 * Ge'ez RNN Cipher — Pictographic: every letter's family, and from abjad to abugida
 *
 * Family: for each of the 26 classes, the line the history of the alphabet gives:
 *   Egyptian hieroglyph (Gardiner code) → Proto-Sinaitic name and picture → Phoenician letter
 *   → Ancient South Arabian (Musnad) letter → Ge'ez letter, with its Greek and Latin relatives.
 * Sources: Wikipedia, "History of the alphabet" (Proto-Sinaitic names, pictures, Gardiner codes,
 * Phoenician, Greek and Latin) and "Ancient South Arabian script" (Musnad ↔ Ge'ez ↔ Phoenician);
 * Ge'ez letter names from "Geʽez script". Bekerie's readings come from geez_dataset.js.
 * Hieroglyphs are Unicode characters looked up by Gardiner code.
 *
 * Timeline: one word, ንጉሠ (nəguśä, "king of"), through the stages of the script.
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;
  const CLASSES = D.ethiopianClasses;

  // [Ge'ez name, sound, Musnad, Musnad transliteration, Phoenician, Phoenician name,
  //  Proto-Sinaitic name, picture, hieroglyph, Gardiner code, Greek, Latin, note]
  const F = [
    ['Hoy', 'h', '𐩠', 'h', '𐤄', 'hē', 'haw', 'a window, or a figure rejoicing', '𓀠', 'A28', 'Ε', 'E'],
    ['Läwe', 'l', '𐩡', 'l', '𐤋', 'lāmed', 'lamd', 'an ox goad', '𓋿', 'S39', 'Λ', 'L'],
    ['Ḥäwt', 'ḥ', '𐩢', 'ḥ', '𐤇', 'ḥēt', 'ḥet', 'a courtyard or fence', '𓉗', 'O6', 'Η', 'H'],
    ['May', 'm', '𐩣', 'm', '𐤌', 'mēm', 'mem', 'water', '𓈖', 'N35', 'Μ', 'M'],
    ['Śäwt', 'ś', '𐩦', 's²', '', '', '', '', '', '', '', '', 'A South Arabian sound with no Phoenician letter, so the line starts in Arabia.'],
    ['Rəʾs', 'r', '𐩧', 'r', '𐤓', 'rēš', 'raʾs', 'a head', '𓁶', 'D1', 'Ρ', 'R'],
    ['Sat', 's', '𐩯', 's³', '𐤎', 'sāmek', 'samekh', 'a support or pillar', '𓊽', 'R11', 'Ξ', 'X'],
    ['Ḳaf', 'q', '𐩤', 'q', '𐤒', 'qōp', 'qup', 'a monkey, or a cord of wool', '𓎗', 'V24', 'Ϙ', 'Q'],
    ['Bet', 'b', '𐩨', 'b', '𐤁', 'bēt', 'bet', 'a house', '𓉐', 'O1', 'Β', 'B'],
    ['Täwe', 't', '𐩩', 't', '𐤕', 'tāw', 'taw', 'a mark or signature', '𓏴', 'Z9', 'Τ', 'T'],
    ['Ḫarm', 'ḫ', '𐩭', 'ḫ', '', '', '', '', '', '', '', '', 'A South Arabian sound with no Phoenician letter, so the line starts in Arabia.'],
    ['Nähas', 'n', '𐩬', 'n', '𐤍', 'nun', 'nun', 'a large fish or snake', '𓆓', 'I10', 'Ν', 'N'],
    ['ʾÄlf', 'ʾ', '𐩱', 'ʾ', '𐤀', 'ʾālep', 'ʾalp', 'an ox', '𓃾', 'F1', 'Α', 'A'],
    ['Kaf', 'k', '𐩫', 'k', '𐤊', 'kap', 'kap', 'a palm or hand', '𓂧', 'D46', 'Κ', 'K'],
    ['Wäwe', 'w', '𐩥', 'w', '𐤅', 'wāw', 'waw', 'a hook', '𓌉', 'T3', 'Υ', 'U V W Y'],
    ['ʿÄyn', 'ʿ', '𐩲', 'ʿ', '𐤏', 'ʿayin', 'ʿen', 'an eye', '𓁹', 'D4', 'Ο', 'O'],
    ['Zäy', 'z', '𐩸', 'z', '𐤆', 'zayin', 'zen', 'a handcuff', '𓏭', 'Z4', 'Ζ', 'Z'],
    ['Yämän', 'y', '𐩺', 'y', '𐤉', 'yōd', 'yad', 'an arm', '𓂣', 'D42', 'Ι', 'I J'],
    ['Dänt', 'd', '𐩵', 'd', '𐤃', 'dālet', 'digg', 'a fish, or a door', '𓉿', 'O31', 'Δ', 'D'],
    ['Gäml', 'g', '𐩴', 'g', '𐤂', 'gīmel', 'gaml', 'a thrown hunting club', '𓌙', 'T14', 'Γ', 'C G'],
    ['Ṭäyt', 'ṭ', '𐩷', 'ṭ', '𐤈', 'ṭēt', 'ṭēt', 'a wheel', '𓄤', 'F35', 'Θ', ''],
    ['P̣äyt', 'p̣', '', '', '', '', '', '', '', '', '', '', 'Added in Geʿez, with ፐ, mostly for words borrowed from Greek. It has no South Arabian letter.'],
    ['Ṣädäy', 'ṣ', '𐩮', 'ṣ', '𐤑', 'ṣādē', 'ṣad', 'a plant', '𓇑', 'M22', 'Ϻ', ''],
    ['Ṣ́äppä', 'ṣ́', '𐩳', 'ḍ', '', '', '', '', '', '', '', '', 'A South Arabian sound with no Phoenician letter, so the line starts in Arabia.'],
    ['ʾÄf', 'f', '𐩰', 'f', '𐤐', 'pē', 'piʾt', 'a bend, or a mouth', '𓂋', 'D21', 'Π', 'P'],
    ['Psa', 'p', '', '', '', '', '', '', '', '', '', '', 'Added in Geʿez, with ጰ, mostly for words borrowed from Greek. It has no South Arabian letter.']
  ];
  const fam = F.map((r, c) => ({
    c, name: r[0], sound: r[1], osa: r[2], osaTr: r[3], phn: r[4], phnName: r[5], ps: r[6], pic: r[7],
    egy: r[8], code: r[9], greek: r[10], latin: r[11], note: r[12] || '',
    geez: CLASSES[c].geez, bekerie: CLASSES[c].meaning || ''
  }));

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('famGrid')) return;
    let cur = 8;   // በ Bet: the textbook example

    $('famGrid').innerHTML = fam.map((f) =>
      `<button type="button" class="fam-tile${f.egy ? '' : ' short'}" data-c="${f.c}" aria-pressed="false">` +
      `<span class="ge">${f.geez}</span><span class="fam-tile-n">${f.name}</span></button>`).join('');

    function render() {
      const f = fam[cur];
      $('famGrid').querySelectorAll('.fam-tile').forEach((b) => {
        const on = Number(b.dataset.c) === cur;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const card = (cls, label, glyph, line1, line2) =>
        `<div class="fam-card ${cls}${glyph ? '' : ' empty'}"><span class="fam-lbl">${label}</span>` +
        `<span class="fam-glyph">${glyph || '–'}</span><span class="fam-l1">${line1 || ''}</span><span class="fam-l2">${line2 || ''}</span></div>`;
      const arrow = '<span class="fam-arrow" aria-hidden="true">→</span>';
      const chain = [
        card('egy', 'Egyptian', f.egy, f.code ? `Gardiner ${f.code}` : '', ''),
        card('ps', 'Proto-Sinaitic', f.ps ? `<span class="fam-word">${f.ps}</span>` : '', f.pic, f.ps ? `sound ${f.sound}` : ''),
        card('phn', 'Phoenician', f.phn, f.phnName, ''),
        card('osa', 'South Arabian', f.osa, f.osaTr ? `<span class="mono">${f.osaTr}</span>` : '', ''),
        card('eth', 'Geʿez', `<span class="ge">${f.geez}</span>`, f.name, `sound <span class="mono">${f.sound}</span>`)
      ].join(arrow);
      const cousins = f.greek || f.latin
        ? `<div class="fam-cousins"><span class="label">Relatives today</span><span class="fam-cousin-g">${f.greek ? `<span title="Greek">${f.greek}</span>` : ''}${f.latin ? f.latin.split(' ').map((l) => `<span title="Latin">${l}</span>`).join('') : ''}</span>` +
          `<span class="hint">Greek and Latin letters from the same Phoenician ancestor</span></div>` : '';
      const names = f.ps
        ? `<p class="fam-names">Ge'ez <b>${f.name}</b> · Phoenician <b>${f.phnName}</b> · Proto-Sinaitic <b>${f.ps}</b>. The names are the same word, carried from language to language with the letter.</p>`
        : '';
      $('famDetail').innerHTML =
        `<div class="fam-chain" key="${cur}">${chain}</div>` +
        (f.note ? `<p class="fam-note">${f.note}</p>` : '') + names +
        `<div class="fam-readings">` +
        `<div><span class="label">Alphabet history</span><p>${f.pic ? `The Proto-Sinaitic sign showed ${f.pic}. Its name began with <b class="mono">${f.sound}</b>, so it stood for that sound.` : 'No Proto-Sinaitic sign is known for this letter.'}</p></div>` +
        `<div><span class="label">Bekerie's reading</span><p>${f.bekerie ? `<span class="ge">${f.geez}</span> ${f.name}: ${f.bekerie}.` : '–'}</p></div>` +
        `</div>` + cousins;
    }
    $('famGrid').addEventListener('click', (e) => {
      const b = e.target.closest('.fam-tile');
      if (b) { cur = Number(b.dataset.c); render(); }
    });
    window.GeezFamily = {
      select(c, scroll) {
        cur = c; render();
        if (scroll) requestAnimationFrame(() => $('famGrid').scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }
    };
    render();

    // ---------- From abjad to abugida ----------
    // Letters keep their identity (k) across stages so they can glide to new places.
    const STAGES = [
      { when: '9th century BCE', title: 'South Arabian letters in Eritrea', dir: 'rtl', cls: 'osa',
        chars: ['𐩬', '𐩴', '𐩦'], text: 'The earliest inscriptions in Eritrea use the South Arabian script: consonants only, n-g-ś, read from right to left.' },
      { when: 'First centuries CE', title: 'Old Ethiopic, consonants only', dir: 'rtl', cls: 'ge',
        chars: ['ነ', 'ገ', 'ሠ'], text: 'The letters take their Ethiopic shapes. Still consonants only, and the early inscriptions run right to left like their South Arabian models.' },
      { when: 'Aksumite period', title: 'Left to right', dir: 'ltr', cls: 'ge',
        chars: ['ነ', 'ገ', 'ሠ'], text: 'The script settles on left to right, the direction Geʿez is written today. The reader still has to supply the vowels.' },
      { when: 'About 30 years before Ezana', title: 'The first vowel mark', dir: 'ltr', cls: 'ge', marks: [0],
        chars: ['ን', 'ገ', 'ሠ'], text: 'A coin of King Wazeba carries a letter with a vowel mark, the earliest known.' },
      { when: '4th century CE', title: 'Fully vocalized under King Ezana', dir: 'ltr', cls: 'ge', marks: [0, 1],
        chars: ['ን', 'ጉ', 'ሠ'], text: 'King Ezana’s inscriptions mark every vowel. ንጉሠ, nəguśä, "king of", is now read exactly as written: the abjad has become an abugida.' }
    ];
    let st = 0, playTimer = null;
    const word = $('abWord');
    word.innerHTML = [0, 1, 2].map((k) => `<span class="ab-ch" data-k="${k}"></span>`).join('');
    $('abSteps').innerHTML = STAGES.map((s, i) => `<button type="button" class="ab-step" data-i="${i}"><span class="mono">${i + 1}</span><span>${s.title}</span><span class="hint">${s.when}</span></button>`).join('');

    function drawStage(animate) {
      const s = STAGES[st];
      const chs = [...word.children];
      const before = chs.map((el) => el.getBoundingClientRect());
      word.dataset.dir = s.dir;
      chs.forEach((el, k) => {
        const changed = el.textContent !== s.chars[k] || !el.classList.contains(s.cls);
        el.className = 'ab-ch ' + s.cls + ((s.marks || []).includes(k) ? ' marked' : '');
        el.textContent = s.chars[k];
        if (animate && changed && el.animate) el.animate([{ opacity: 0, transform: 'translateY(-10px) scale(0.9)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'ease-out' });
      });
      // Glide letters to their new places (right to left ↔ left to right)
      if (animate) chs.forEach((el, k) => {
        const after = el.getBoundingClientRect();
        const dx = before[k].left - after.left;
        if (Math.abs(dx) > 1 && el.animate) el.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
      });
      $('abDir').textContent = s.dir === 'rtl' ? '← read from right to left' : 'read from left to right →';
      $('abWhen').textContent = s.when;
      $('abTitle').textContent = s.title;
      $('abText').textContent = s.text;
      $('abSteps').querySelectorAll('.ab-step').forEach((b, i) => { b.classList.toggle('active', i === st); b.classList.toggle('done', i < st); });
      $('abPlay').textContent = playTimer ? 'Pause' : 'Play';
    }
    const stop = () => { clearInterval(playTimer); playTimer = null; };
    $('abSteps').addEventListener('click', (e) => { const b = e.target.closest('.ab-step'); if (b) { stop(); st = Number(b.dataset.i); drawStage(true); } });
    $('abPrev').addEventListener('click', () => { stop(); st = Math.max(0, st - 1); drawStage(true); });
    $('abNext').addEventListener('click', () => { stop(); st = Math.min(STAGES.length - 1, st + 1); drawStage(true); });
    $('abPlay').addEventListener('click', () => {
      if (playTimer) { stop(); drawStage(false); return; }
      if (st === STAGES.length - 1) st = 0;
      playTimer = setInterval(() => { if (st >= STAGES.length - 1) { stop(); drawStage(false); return; } st++; drawStage(true); }, 2600);
      drawStage(true);
    });
    drawStage(false);
  });
})();
