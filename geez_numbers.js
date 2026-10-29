/**
 * Ge'ez RNN Cipher — Ge'ez numerals (አኃዝ)
 * Twenty signs: nine units ፩–፱, nine tens ፲–፺, ፻ (hundred) and ፼ (ten thousand). There is no zero;
 * አልቦ, "nothing", is a word without a sign. Numbers are written in base 100: split the number into
 * pairs of digits, write each pair as tens + units, and close each pair with its multiplier.
 *   ፻ multiplies everything before it by 100:   ፲፱፻፳፪ = 19 × 100 + 22 = 1922
 * The Geez Family table writes ten thousand as ፻፻ (100 × 100); standard Unicode usage writes ፼.
 * In words, ወ ("and") joins the last part: 11 = ዐሠርቱ ወአሐዱ, 111 = ምእት ዐሠርቱ ወአሐዱ.
 */
(function () {
  'use strict';

  const ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
  const ONES_W = ['', 'አሐዱ', 'ክልኤቱ', 'ሠለስቱ', 'አርባዕቱ', 'ኃምስቱ', 'ስድስቱ', 'ሰብዓቱ', 'ሰመንቱ', 'ተስዓቱ'];
  const TENS_W = ['', 'ዐሠርቱ', 'ዕስራ', 'ሠላሳ', 'አርብዓ', 'ሃምሳ', 'ስሳ', 'ሰብዓ', 'ሰማንያ', 'ተስዓ'];
  const ONES_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const TENS_EN = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const pairGlyph = (v) => TENS[Math.floor(v / 10)] + ONES[v % 10];

  /** Number → Ge'ez numerals, standard form. Split into groups of four digits; each group is
   *  (hundreds pair)፻(units pair), and the k-th group from the right is followed by ፼ k times.
   *  ፩ is left out before ፻, and before ፼ at the start of a number: 100 = ፻, 10000 = ፼. */
  function toGeez(n, style = 'unicode') {
    if (!(n > 0) || !Number.isInteger(n)) return '';
    if (style === 'table') return toGeez(n).replace(/፼/g, '፻፻');
    const groups = [];
    for (let x = n; x > 0; x = Math.floor(x / 10000)) groups.unshift(x % 10000);
    return groups.map((g, i) => {
      const k = groups.length - 1 - i;
      if (g === 0) return '';
      const hi = Math.floor(g / 100), lo = g % 100;
      let s = '';
      if (hi) s += (hi === 1 ? '' : pairGlyph(hi)) + '፻';
      if (lo) s += (lo === 1 && !hi && k > 0 && i === 0 ? '' : pairGlyph(lo));   // ፩ kept inside a number so ፼ runs stay apart
      return s + '፼'.repeat(k);
    }).join('');
  }

  /** Ge'ez numerals → number. Reads the standard form; a string with ፻፻ and no ፼ is read as the
   *  table's ፻-only form, where each ፻ multiplies everything before it. ወ and spaces are skipped. */
  function fromGeez(str) {
    const s = [...str].filter((ch) => ch !== 'ወ' && !/\s/.test(ch));
    if (!s.length) return NaN;
    const tableForm = !s.includes('፼') && /፻፻/.test(s.join(''));
    let total = 0, group = 0, pair = 0;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i], u = ONES.indexOf(ch), t = TENS.indexOf(ch);
      if (u > 0) pair += u;
      else if (t > 0) pair += t * 10;
      else if (ch === '፻') {
        if (tableForm) { pair = ((group + pair) || 1) * 100; group = 0; }
        else { group += (pair || 1) * 100; pair = 0; }
      } else if (ch === '፼') {
        let k = 1;
        while (s[i + 1] === '፼') { k++; i++; }
        total += ((group + pair) || 1) * Math.pow(10000, k);
        group = 0; pair = 0;
      } else return NaN;
    }
    return total + group + pair;
  }

  // ---------- Words ----------
  function parts99(v) {           // 1–99 as a list of words
    const out = [];
    if (v >= 10) out.push(TENS_W[Math.floor(v / 10)]);
    if (v % 10) out.push(ONES_W[v % 10]);
    return out;
  }
  const join = (list) => list.map((w, i) => (i && i === list.length - 1 ? 'ወ' + w : w)).join(' ');
  /** Ge'ez words for 1 – 999,999, after the pattern of the Geez Family table. */
  function words(n) {
    if (n === 0) return 'አልቦ';
    if (!(n > 0) || n >= 1e6) return '';
    const e = Math.floor(n / 10000), h = Math.floor((n % 10000) / 100), r = n % 100;
    const list = [];
    if (e) list.push(e === 1 ? 'እልፍ' : `${join(parts99(e))} እልፍ`);
    if (h) list.push(h === 1 ? 'ምእት' : `${join(parts99(h))} ምእት`);
    list.push(...parts99(r));
    return join(list);
  }
  const en99 = (v) => [TENS_EN[Math.floor(v / 10)], ONES_EN[v % 10]].filter(Boolean).join('-');

  window.GeezNumbers = { toGeez, fromGeez, words };

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('numDigits')) return;

    // Sign cards: units, tens, multipliers
    const card = (g, v, w) => `<button type="button" class="num-card" data-g="${g}"><span class="num-g ge">${g}</span><span class="mono">${v.toLocaleString()}</span><span class="num-w ge">${w}</span></button>`;
    $('numDigits').innerHTML =
      `<div class="num-row"><span class="label">Units</span><div class="num-cards">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => card(ONES[i], i, ONES_W[i])).join('')}</div></div>` +
      `<div class="num-row"><span class="label">Tens</span><div class="num-cards">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => card(TENS[i], i * 10, TENS_W[i])).join('')}</div></div>` +
      `<div class="num-row"><span class="label">Multipliers</span><div class="num-cards">${card('፻', 100, 'ምእት')}${card('፼', 10000, 'እልፍ')}` +
      `<div class="num-card zero"><span class="num-g">–</span><span class="mono">0</span><span class="num-w ge">አልቦ</span></div></div></div>`;

    // Named powers
    const POWERS = [[100, 'ምእት', 'hundred'], [1000, 'ዐሠርቱ ምእት', 'thousand (ten hundreds)'], [1e4, 'እልፍ', 'ten thousand'],
      [1e5, 'ዐሠርቱ እልፍ', 'hundred thousand'], [1e6, 'አእላፋት', 'million'], [1e7, 'ትእልፊት', 'ten million'],
      [1e8, 'ትልፊታት', 'hundred million'], [1e9, 'ምእልፊት', 'billion']];
    $('numPowers').innerHTML = POWERS.map(([v, w, en]) =>
      `<tr><td class="mono">${v.toLocaleString()}</td><td class="glyph-cell">${toGeez(v, 'table')}</td><td class="glyph-cell">${toGeez(v)}</td><td><span class="ge">${w}</span> <span class="hint">${en}</span></td></tr>`).join('');

    // Converter
    const inNum = $('numIn'), inGeez = $('numGeezIn');
    function show(n, from) {
      const out = $('numOut');
      if (!(n > 0) || n > 999999999999) {
        out.innerHTML = `<p class="hint">${from === 'geez' ? 'Type Geʿez numerals, for example ፲፱፻፳፪, or tap the signs above.' : 'Type a whole number from 1 to 999,999,999,999.'}</p>`;
        return;
      }
      if (from !== 'num') inNum.value = n;
      if (from !== 'geez') inGeez.value = toGeez(n);
      const groups = [];
      for (let x = n; x > 0; x = Math.floor(x / 10000)) groups.unshift(x % 10000);
      const steps = groups.map((g, i) => {
        const k = groups.length - 1 - i;
        const place = Math.pow(10000, k);
        const label = String(g).padStart(i ? 4 : 1, '0');
        if (g === 0) return `<div class="num-step zero"><span class="mono">${label}</span><span class="ge">–</span><span class="hint">× ${place.toLocaleString()}: nothing to write, Ge\u02bfez has no zero</span></div>`;
        const hi = Math.floor(g / 100), lo = g % 100;
        const how = [hi ? `${hi === 1 ? 'one' : en99(hi)} hundred` : '', lo ? en99(lo) : ''].filter(Boolean).join(' and ');
        return `<div class="num-step"><span class="mono">${label}</span>` +
          `<span class="ge num-step-g">${toGeez(g)}<b>${'፼'.repeat(k)}</b></span>` +
          `<span class="hint">${how}${k ? ' × ' + place.toLocaleString() : ''}</span></div>`;
      }).join('');
      const table = toGeez(n, 'table');
      const tableOk = table !== toGeez(n) && fromGeez(table) === n;
      const w = words(n);
      out.innerHTML =
        `<div class="num-result"><span class="ge num-big">${toGeez(n)}</span><span class="mono num-val">${n.toLocaleString()}</span></div>` +
        (tableOk ? `<p class="hint">In the table's ፻-only form: <span class="ge num-alt">${table}</span></p>` : '') +
        `<div class="label">Groups of four digits, largest first</div><div class="num-steps">${steps}</div>` +
        (w ? `<p><span class="label">In words</span><br><span class="ge num-words">${w}</span></p>` : '<p class="hint">Words are shown up to 999,999.</p>');
    }
    inNum.addEventListener('input', () => show(parseInt(inNum.value.replace(/[^\d]/g, ''), 10), 'num'));
    inGeez.addEventListener('input', () => show(fromGeez(inGeez.value), 'geez'));
    $('numDigits').addEventListener('click', (e) => {
      const b = e.target.closest('.num-card[data-g]');
      if (!b) return;
      inGeez.value += b.dataset.g;
      show(fromGeez(inGeez.value), 'geez');
    });
    $('numClear').addEventListener('click', () => { inGeez.value = ''; inNum.value = ''; show(NaN, 'geez'); });
    document.querySelectorAll('[data-num-example]').forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.numExample), 'example')));

    // Counting table, generated by the same rules (kept folded)
    const vals = [];
    for (let i = 1; i <= 39; i++) vals.push(i);
    [40, 50, 60, 70, 80, 90].forEach((v) => vals.push(v));
    for (let i = 100; i <= 120; i++) vals.push(i);
    [130, 150, 199, 200, 201, 210, 211, 300, 500, 999, 1000, 1922, 2000, 2019, 5600, 9999, 10000, 20000, 100000].forEach((v) => vals.push(v));
    $('numTable').innerHTML = vals.map((v) => `<tr><td class="glyph-cell">${toGeez(v)}</td><td class="ge">${words(v)}</td><td class="mono">${v.toLocaleString()}</td></tr>`).join('');

    show(1922, 'example');
  });
})();
