/**
 * Ge'ez RNN Cipher — Astrographic calendar
 * The 364-day solar cycle as two equinoxes of 182 days. Each equinox runs through the
 * 26 classes, one class per week, and the class's 7 orders fill the 7 days of that week:
 *   day k (0–363): equinox = k < 182 ? 1 : 2,  class = floor((k mod 182) / 7),  order = k mod 7
 * Renders the equinox circle (#equinoxCircle) and a month-by-month calendar (#astroCalendar).
 * Data: geez_dataset.js (ethiopianClasses, orders).
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;

  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D.ethiopianClasses.slice(0, 26);
  const ORDERS = D.orders || [];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const ORDN = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
  const DAY = 864e5;

  // Dates are handled at UTC midnight so daylight-saving changes never shift a day
  const utc = (y, m, d) => Date.UTC(y, m, d);
  const parts = (t) => { const x = new Date(t); return [x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate(), x.getUTCDay()]; };
  const todayUTC = () => { const n = new Date(); return utc(n.getFullYear(), n.getMonth(), n.getDate()); };

  /** Start of the cycle that begins in `year`. */
  function cycleStart(year, mode) {
    if (mode === 'sunday') {
      // First Sunday on or after 20 March (the March equinox), so order 1 falls on Sunday
      const eq = utc(year, 2, 20);
      const wd = new Date(eq).getUTCDay();
      return eq + ((7 - wd) % 7) * DAY;
    }
    return utc(year, 3, 1);   // 1 April, as in the thesis
  }
  /** Where a date falls: day index 0–363, or null for days outside the 364-day cycle. */
  function locate(t, year, mode) {
    const k = Math.round((t - cycleStart(year, mode)) / DAY);
    if (k < 0 || k > 363) return null;
    const j = k % 182;
    return { k, half: k < 182 ? 1 : 2, c: Math.floor(j / 7), o: j % 7 };
  }
  const glyph = (c, o) => CLASSES[c][FORMS[o]];

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const cal = $('astroCalendar');
    const circle = $('equinoxCircle');
    if (!cal) return;

    const t0 = todayUTC();
    let mode = 'april';
    let year = parts(t0)[0];
    if (t0 < cycleStart(year, mode)) year -= 1;
    let picked = t0;

    // ---------- Equinox circle ----------
    function drawCircle() {
      if (!circle) return;
      const cx = 220, cy = 220, r = 150, R = 176;
      const here = locate(picked, year, mode);
      let s = `<circle class="eq-ring" cx="${cx}" cy="${cy}" r="${r}"/>`;
      s += `<line class="eq-axis" x1="${cx - r}" y1="${cy}" x2="${cx - 92}" y2="${cy}"/><line class="eq-axis" x1="${cx + 92}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>`;
      s += `<text class="eq-big" x="${cx}" y="${cy - 44}" text-anchor="middle">EQUINOX 1 = 182</text>`;
      s += `<text class="eq-mid" x="${cx}" y="${cy + 5}" text-anchor="middle">1 + 2 = 364 DAYS</text>`;
      s += `<text class="eq-big" x="${cx}" y="${cy + 58}" text-anchor="middle">EQUINOX 2 = 182</text>`;
      s += `<text class="eq-small" x="${cx}" y="${cy - 20}" text-anchor="middle">weeks 1–26 · ሀ → ፐ</text>`;
      s += `<text class="eq-small" x="${cx}" y="${cy + 80}" text-anchor="middle">weeks 27–52 · ሀ → ፐ again</text>`;
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
      const [y, m, d, wd] = parts(t);
      const loc = locate(t, year, mode);
      const dateText = `${WEEKDAYS[wd]} ${d} ${MONTHS[m]} ${y}`;
      const box = $('astroInfo');
      if (!loc) {
        box.innerHTML = `<b>${dateText}</b> is outside this 364-day cycle. The solar year has 365 or 366 days, so one or two days fall between cycles.`;
        return;
      }
      const ord = ORDERS[loc.o] || {};
      const match = ord.day === WEEKDAYS[wd];
      box.innerHTML =
        `<span class="ge astro-info-glyph">${glyph(loc.c, loc.o)}</span>` +
        `<span><b>${dateText}</b> is day ${loc.k + 1} of 364: Equinox ${loc.half}, week ${Math.floor((loc.k % 182) / 7) + 1}. ` +
        `Class ${CLASSES[loc.c].geez} (${CLASSES[loc.c].name}), ${ORDN[loc.o]} order${ord.name ? ' ' + ord.name : ''}.` +
        (ord.day ? ` <span class="hint">The ${ORDN[loc.o]} order belongs to ${ord.day}${match ? ', and this date is a ' + ord.day + '.' : '; this date is a ' + WEEKDAYS[wd] + '.'}</span>` : '') +
        `</span>`;
    }

    function render() {
      const start = cycleStart(year, mode);
      const next = cycleStart(year + 1, mode);
      const [sy, sm] = parts(start);
      const [ey, em] = parts(next - DAY);
      $('astroRange').textContent = `${fmt(start)} – ${fmt(start + 363 * DAY)}`;
      let html = '';
      for (let yy = sy, mm = sm; yy < ey || (yy === ey && mm <= em); mm === 11 ? (yy++, mm = 0) : mm++) {
        const first = utc(yy, mm, 1);
        const days = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate();
        const lead = new Date(first).getUTCDay();
        let cells = '';
        for (let i = 0; i < lead; i++) cells += '<span class="ac-pad"></span>';
        for (let d = 1; d <= days; d++) {
          const t = utc(yy, mm, d);
          const inRange = t >= start && t < next;
          const loc = inRange ? locate(t, year, mode) : null;
          const cls = ['ac-day'];
          if (!inRange) cls.push('off');
          else if (!loc) cls.push('gap');
          else {
            cls.push('h' + loc.half);
            if (loc.o === 0) cls.push('wk');
            if (loc.k === 0 || loc.k === 182) cls.push('eqx');
          }
          if (t === t0) cls.push('today');
          if (t === picked) cls.push('picked');
          cells += `<button type="button" class="${cls.join(' ')}" data-t="${t}"${inRange ? '' : ' tabindex="-1"'} aria-label="${d} ${MONTHS[mm]}${loc ? ', ' + glyph(loc.c, loc.o) : ''}">` +
            `<span class="ac-n">${d}</span>${loc ? `<span class="ac-g ge">${glyph(loc.c, loc.o)}</span>` : (inRange ? '<span class="ac-g">·</span>' : '')}</button>`;
        }
        html += `<div class="ac-month"><div class="ac-head">${MONTHS[mm]} <span>${yy}</span></div>` +
          `<div class="ac-grid">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w) => `<span class="ac-wd">${w}</span>`).join('')}${cells}</div></div>`;
      }
      cal.innerHTML = html;
      info(picked);
      drawCircle();
    }
    const fmt = (t) => { const [y, m, d] = parts(t); return `${d} ${MONTHS[m].slice(0, 3)} ${y}`; };

    cal.addEventListener('click', (e) => {
      const b = e.target.closest('.ac-day');
      if (!b || b.classList.contains('off')) return;
      picked = Number(b.dataset.t);
      cal.querySelectorAll('.ac-day.picked').forEach((x) => x.classList.remove('picked'));
      b.classList.add('picked');
      info(picked);
      drawCircle();
    });
    $('astroPrev').addEventListener('click', () => { year--; picked = cycleStart(year, mode); render(); });
    $('astroNext').addEventListener('click', () => { year++; picked = cycleStart(year, mode); render(); });
    $('astroToday').addEventListener('click', () => {
      year = parts(t0)[0];
      if (t0 < cycleStart(year, mode)) year -= 1;
      picked = t0;
      render();
    });
    document.querySelectorAll('[data-astro-mode]').forEach((b) => b.addEventListener('click', () => {
      mode = b.dataset.astroMode;
      document.querySelectorAll('[data-astro-mode]').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      if (!locate(picked, year, mode)) picked = cycleStart(year, mode);
      render();
    }));

    render();
  });

  window.GeezCalendar = { cycleStart, locate };
})();
