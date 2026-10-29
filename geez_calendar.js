/**
 * Ge'ez RNN Cipher — Astrographic calendar (Ethiopian calendar)
 * The 364-day solar cycle as two equinoxes of 182 days, laid on the Ethiopian year:
 * 12 months of 30 days and ጳጉሜ of 5 or 6. Day 1 is መስከረም 1.
 * Each equinox runs through the 26 classes, one class per 7 days, and the class's
 * 7 orders fill those 7 days:
 *   k = 30(month − 1) + (day − 1)            (0–363; ጳጉሜ 5 and 6 fall outside)
 *   equinox = k < 182 ? 1 : 2,  class = ⌊(k mod 182) / 7⌋,  order = k mod 7
 * Because every month has 30 days, a month always holds 4 class weeks and 2 days,
 * so each month starts 2 orders further on, the same step the weekdays take.
 * Renders the equinox circle (#equinoxCircle) and the 13-month calendar (#astroCalendar).
 * Data: geez_dataset.js; dates: EthiopicTime from geez_astro.js.
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  const E = window.EthiopicTime;
  if (!D || !Array.isArray(D.ethiopianClasses) || !E) return;

  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D.ethiopianClasses.slice(0, 26);
  const ORDERS = D.orders || [];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WD_SHORT = ['ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ', 'እሁ'];     // Monday first, as on Ethiopian wall calendars
  const G_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ORDN = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

  const ethOf = (t) => E.jdnToEth(E.utcToJdn(t));
  const toUtc = (y, m, d) => E.jdnToUtc(E.ethToJdn(y, m, d));
  const todayUTC = () => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); };
  const fmtG = (t) => { const x = new Date(t); return `${x.getUTCDate()} ${G_MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };

  /** Where an Ethiopian date falls in the 364-day cycle, or null for ጳጉሜ 5 and 6. */
  function locateEth(m, d) {
    const k = 30 * (m - 1) + (d - 1);
    if (k > 363) return null;
    const j = k % 182;
    return { k, half: k < 182 ? 1 : 2, c: Math.floor(j / 7), o: j % 7 };
  }
  const locate = (t) => { const [, m, d] = ethOf(t); return locateEth(m, d); };
  const glyph = (c, o) => CLASSES[c][FORMS[o]];

  const $ = (id) => document.getElementById(id);
  window.GeezCalendar = {
    locate,
    letterOn: (t) => { const l = locate(t); return l ? { glyph: glyph(l.c, l.o), base: CLASSES[l.c].geez } : null; }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const cal = $('astroCalendar');
    const circle = $('equinoxCircle');
    if (!cal) return;

    const t0 = todayUTC();
    let picked = t0;
    let year = ethOf(t0)[0];

    // ---------- Equinox circle ----------
    function drawCircle() {
      if (!circle) return;
      const cx = 220, cy = 220, r = 150, R = 176;
      const here = locate(picked);
      let s = `<circle class="eq-ring" cx="${cx}" cy="${cy}" r="${r}"/>`;
      s += `<line class="eq-axis" x1="${cx - r}" y1="${cy}" x2="${cx - 92}" y2="${cy}"/><line class="eq-axis" x1="${cx + 92}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>`;
      s += `<text class="eq-big" x="${cx}" y="${cy - 44}" text-anchor="middle">EQUINOX 1 = 182</text>`;
      s += `<text class="eq-mid" x="${cx}" y="${cy + 5}" text-anchor="middle">1 + 2 = 364 DAYS</text>`;
      s += `<text class="eq-big" x="${cx}" y="${cy + 58}" text-anchor="middle">EQUINOX 2 = 182</text>`;
      s += `<text class="eq-small" x="${cx}" y="${cy - 20}" text-anchor="middle">መስከረም 1 → መጋቢት 2 · ሀ → ፐ</text>`;
      s += `<text class="eq-small" x="${cx}" y="${cy + 80}" text-anchor="middle">መጋቢት 3 → ጳጉሜ 4 · ሀ → ፐ again</text>`;
      // 26 classes around each half: Equinox 1 over the top, left to right; Equinox 2 under the bottom, right to left
      for (let half = 1; half <= 2; half++) {
        for (let i = 0; i < 26; i++) {
          const a = half === 1 ? Math.PI - (i + 0.5) * Math.PI / 26 : -(i + 0.5) * Math.PI / 26;
          const x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
          const tx = cx + r * Math.cos(a), ty = cy - r * Math.sin(a);
          const ux = cx + (r + 8) * Math.cos(a), uy = cy - (r + 8) * Math.sin(a);
          const on = here && here.half === half && here.c === i;
          s += `<line class="eq-tick" x1="${tx.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${ux.toFixed(1)}" y2="${uy.toFixed(1)}"/>`;
          if (on) s += `<circle class="eq-on" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12"/>`;
          s += `<text class="eq-letter${on ? ' on' : ''}" x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${CLASSES[i].geez}</text>`;
        }
      }
      s += `<text class="eq-small" x="${cx - r + 8}" y="${cy + 17}" text-anchor="start">day 1</text>`;
      s += `<text class="eq-small" x="${cx + r - 8}" y="${cy + 17}" text-anchor="end">day 183</text>`;
      circle.innerHTML = s;
    }

    // ---------- Calendar ----------
    function info(t) {
      const [y, m, d] = ethOf(t);
      const wd = E.weekday(E.utcToJdn(t));
      const loc = locateEth(m, d);
      const dateText = `<span class="ge">${E.MONTHS[m - 1]} ${d}, ${y}</span>`;
      const greg = `<span class="hint">${WEEKDAYS[wd]}, ${fmtG(t)}</span>`;
      const box = $('astroInfo');
      if (!loc) {
        box.innerHTML = `<span><b>${dateText}</b> is outside the 364-day cycle. The year has 365 or 366 days, so ጳጉሜ 5, and ጳጉሜ 6 in a leap year, close the year before the alphabet starts again on መስከረም 1. ${greg}</span>`;
        return;
      }
      const ord = ORDERS[loc.o] || {};
      box.innerHTML =
        `<span class="ge astro-info-glyph">${glyph(loc.c, loc.o)}</span>` +
        `<span><b>${dateText}</b> is day ${loc.k + 1} of 364: Equinox ${loc.half}, week ${Math.floor((loc.k % 182) / 7) + 1}. ` +
        `Class ${CLASSES[loc.c].geez} (${CLASSES[loc.c].name}), ${ORDN[loc.o]} order${ord.name ? ' ' + ord.name : ''}. ${greg} <button type="button" class="lp-link" data-letter="${loc.c},${loc.o}">Letter profile</button></span>`;
    }

    function render() {
      $('astroRange').innerHTML = `${year} <span class="ge">${E.geezNumber(year)}</span> · ${fmtG(toUtc(year, 1, 1))} – ${fmtG(toUtc(year, 13, E.isLeap(year) ? 6 : 5))}`;
      let html = '';
      for (let m = 1; m <= 13; m++) {
        const len = m < 13 ? 30 : (E.isLeap(year) ? 6 : 5);
        const first = toUtc(year, m, 1);
        const lead = (E.weekday(E.utcToJdn(first)) + 6) % 7;     // Monday = 0
        let cells = '';
        for (let i = 0; i < lead; i++) cells += '<span class="ac-pad"></span>';
        for (let d = 1; d <= len; d++) {
          const t = toUtc(year, m, d);
          const loc = locateEth(m, d);
          const cls = ['ac-day'];
          if (!loc) cls.push('gap');
          else {
            cls.push('h' + loc.half);
            if (loc.o === 0) cls.push('wk');
            if (loc.k === 0 || loc.k === 182) cls.push('eqx');
          }
          if (t === t0) cls.push('today');
          if (t === picked) cls.push('picked');
          cells += `<button type="button" class="${cls.join(' ')}" data-t="${t}" aria-label="${E.MONTHS[m - 1]} ${d}${loc ? ', ' + glyph(loc.c, loc.o) : ''}">` +
            `<span class="ac-n">${d}</span>${loc ? `<span class="ac-g ge">${glyph(loc.c, loc.o)}</span>` : '<span class="ac-g">·</span>'}</button>`;
        }
        const last = toUtc(year, m, len);
        html += `<div class="ac-month${m === 13 ? ' pagume' : ''}"><div class="ac-head"><span class="ge">${E.MONTHS[m - 1]}</span> <span class="ac-greg">${fmtG(first).replace(/ \d{4}$/, '')} – ${fmtG(last).replace(/ \d{4}$/, '')}</span></div>` +
          `<div class="ac-grid">${WD_SHORT.map((w) => `<span class="ac-wd ge">${w}</span>`).join('')}${cells}</div></div>`;
      }
      cal.innerHTML = html;
      info(picked);
      drawCircle();
      announce();
    }
    const announce = () => document.dispatchEvent(new CustomEvent('fidel-date', { detail: { t: picked } }));

    cal.addEventListener('click', (e) => {
      const b = e.target.closest('.ac-day');
      if (!b) return;
      picked = Number(b.dataset.t);
      cal.querySelectorAll('.ac-day.picked').forEach((x) => x.classList.remove('picked'));
      b.classList.add('picked');
      info(picked);
      drawCircle();
      announce();
    });
    // The twelve stars and the calendar dial can move the picked date
    window.GeezCalendar.pick = (t) => { picked = t; year = ethOf(t)[0]; render(); };
    $('astroPrev').addEventListener('click', () => { year--; picked = toUtc(year, 1, 1); render(); });
    $('astroNext').addEventListener('click', () => { year++; picked = toUtc(year, 1, 1); render(); });
    $('astroToday').addEventListener('click', () => { picked = t0; year = ethOf(t0)[0]; render(); });

    render();
  });
})();
