/**
 * Ge'ez RNN Cipher — Ethiopian time: the twelve stars and the perpetual calendar dial
 *
 * EthiopicTime: conversions between Ethiopian dates, Julian day numbers and UTC dates.
 *
 * Twelve stars (after Ayele Bekerie's drawing, 2001): each Ethiopian month carries one star
 * (ኮከብ) and one nature (ባሕርይ). The wheel starts at ① መጋቢት / ሐመል and runs to ⑫ የካቲት / ሑት.
 *
 * Perpetual calendar dial (Ethiopian calendar card, 1922–1977 E.C.):
 *   every month has 30 days, so each month starts 2 weekdays after the one before:
 *     weekday(month m, day d) = (new-year weekday + 2(m − 1) + (d − 1)) mod 7
 *   months 7 apart start on the same weekday, which is why the card pairs them on one fan.
 *   The new-year weekday follows Bahire Hasab: (ዓመተ ዓለም + ⌊ዓመተ ዓለም ÷ 4⌋) mod 7, counted from Monday.
 *   The card names each year by a key letter (መፍቻ ፊደል), one for each possible new-year weekday.
 */
(function () {
  'use strict';

  // ---------- Ethiopian date arithmetic ----------
  const EPOCH = 1723856;
  const ethToJdn = (y, m, d) => EPOCH + 365 + 365 * (y - 1) + Math.floor(y / 4) + 30 * m + d - 31;
  function jdnToEth(j) {
    const r = (j - EPOCH) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    return [4 * Math.floor((j - EPOCH) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460), Math.floor(n / 30) + 1, (n % 30) + 1];
  }
  const utcToJdn = (t) => Math.floor(t / 864e5) + 2440588;
  const jdnToUtc = (j) => (j - 2440588) * 864e5;
  const weekday = (j) => (j + 1) % 7;                 // 0 = Sunday
  const isLeap = (y) => y % 4 === 3;                  // year of Luke: ጳጉሜ has 6 days
  const monthLength = (y, m) => (m < 13 ? 30 : (isLeap(y) ? 6 : 5));

  const ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
  /** Integer to Ge'ez numerals, e.g. 2019 → ፳፻፲፱ */
  function geezNumber(n) {
    if (!(n > 0)) return '';
    const pairs = [];
    for (let x = n; x > 0; x = Math.floor(x / 100)) pairs.unshift(x % 100);
    return pairs.map((v, i) => {
      const pos = pairs.length - 1 - i;              // 0 = units, 1 = hundreds, 2 = ten-thousands …
      let s = TENS[Math.floor(v / 10)] + ONES[v % 10];
      if (pos > 0 && v === 1) s = '';                 // ፻ and ፼ stand alone for one
      if (pos > 0 && v === 0) return '';
      return s + (pos === 0 ? '' : pos % 2 ? '፻' : '፼');
    }).join('');
  }

  const MONTHS = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];
  const MONTHS_LATIN = ['Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'];
  const WD_AM = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
  const WD_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const G_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const EVANGELISTS = [['ዮሐንስ', 'John'], ['ማቴዎስ', 'Matthew'], ['ማርቆስ', 'Mark'], ['ሉቃስ', 'Luke']];   // index = year mod 4
  // Key letters (መፍቻ ፊደል) as printed on the card, by new-year weekday (0 = Sunday)
  const KEY_LETTERS = ['ገ', 'ሡ', 'ቶ', 'ን', 'ጉ', 'ሠ', 'ኔ'];

  const fmtG = (t) => { const x = new Date(t); return `${x.getUTCDate()} ${G_MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
  const ethOf = (t) => jdnToEth(utcToJdn(t));
  const ethText = (t) => { const [y, m, d] = ethOf(t); return `${MONTHS[m - 1]} ${d}, ${y}`; };

  window.EthiopicTime = { ethToJdn, jdnToEth, utcToJdn, jdnToUtc, weekday, isLeap, geezNumber, ethText, MONTHS, MONTHS_LATIN };

  // ---------- Twelve stars ----------
  // i = 0 … 11 from ① ሐመል; its month is መጋቢት + i (wrapping past ጳጉሜ to መስከረም)
  const STARS = [
    ['ሐመል', 'the Ram', '♈'], ['ሠውር', 'the Bull', '♉'], ['ገውዝ', 'the Twins', '♊'], ['ሸርጣን', 'the Crab', '♋'],
    ['አሰድ', 'the Lion', '♌'], ['ሰንቡላ', 'the Ear of Grain', '♍'], ['ሚዛን', 'the Balance', '♎'], ['ዐቅራብ', 'the Scorpion', '♏'],
    ['ቀውስ', 'the Archer', '♐'], ['ጀዲ', 'the Goat', '♑'], ['ደለው', 'the Water Bearer', '♒'], ['ሑት', 'the Fish', '♓']
  ];
  const NATURES = [['እሳት', 'fire'], ['መሬት', 'earth'], ['ነፋስ', 'air'], ['ማይ', 'water']];
  const starMonth = (i) => (6 + i) % 12 + 1;                 // 1-based Ethiopian month
  const starOfMonth = (m) => (m === 13 ? -1 : (m - 7 + 12) % 12);

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const wheel = $('starsWheel');
    const dial = $('dialMonths');
    if (!wheel || !dial) return;

    let picked = (() => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); })();
    let star = starOfMonth(ethOf(picked)[1]);
    let dialYear = ethOf(picked)[0];
    let dialMonth = ethOf(picked)[1];
    let dialDay = ethOf(picked)[2];

    // ---------- Wheel ----------
    function polar(r, deg) { const a = (deg - 90) * Math.PI / 180; return [230 + r * Math.cos(a), 230 + r * Math.sin(a)]; }
    function sector(r0, r1, a0, a1) {
      const [x0, y0] = polar(r1, a0), [x1, y1] = polar(r1, a1), [x2, y2] = polar(r0, a1), [x3, y3] = polar(r0, a0);
      return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r1},${r1} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} A${r0},${r0} 0 0 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z`;
    }
    function drawWheel() {
      const here = starOfMonth(ethOf(picked)[1]);
      let s = '';
      STARS.forEach(([name, , sym], i) => {
        const a0 = -30 + i * 30, a1 = a0 + 30, mid = a0 + 15;
        const on = i === star;
        s += `<g class="sw-sector${on ? ' on' : ''}${i === here ? ' here' : ''}" data-i="${i}" tabindex="0" role="button" aria-label="${i + 1}: ${MONTHS[starMonth(i) - 1]}, ${name}, ${NATURES[i % 4][1]}">`;
        s += `<path class="sw-outer" d="${sector(158, 222, a0, a1)}"/>`;
        s += `<path class="sw-sign" d="${sector(112, 158, a0, a1)}"/>`;
        s += `<path class="sw-num" d="${sector(82, 112, a0, a1)}"/>`;
        // Month, star and nature stacked at one point of the outer ring, like the three numbered rings of the drawing
        const [ox, oy] = polar(190, mid);
        s += `<text class="sw-month" x="${ox.toFixed(1)}" y="${(oy - 10).toFixed(1)}" text-anchor="middle">${MONTHS[starMonth(i) - 1]}</text>`;
        s += `<text class="sw-name" x="${ox.toFixed(1)}" y="${(oy + 5).toFixed(1)}" text-anchor="middle">${name}</text>`;
        s += `<text class="sw-nature" x="${ox.toFixed(1)}" y="${(oy + 19).toFixed(1)}" text-anchor="middle">${NATURES[i % 4][0]}</text>`;
        const [sx, sy] = polar(135, mid), [qx, qy] = polar(97, mid);
        s += `<text class="sw-sym" x="${sx.toFixed(1)}" y="${(sy + 8).toFixed(1)}" text-anchor="middle">${sym}︎</text>`;
        s += `<text class="sw-n" x="${qx.toFixed(1)}" y="${(qy + 5).toFixed(1)}" text-anchor="middle">${geezNumber(i + 1)}</text>`;
        s += `</g>`;
      });
      s += `<circle class="sw-sun" cx="230" cy="230" r="80"/>`;
      for (let k = 0; k < 16; k++) {
        const [x0, y0] = polar(46, k * 22.5), [x1, y1] = polar(k % 2 ? 60 : 70, k * 22.5);
        s += `<line class="sw-ray" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
      }
      s += `<circle class="sw-core" cx="230" cy="230" r="42"/><text class="sw-sun-t" x="230" y="236" text-anchor="middle">ፀሐይ</text>`;
      wheel.innerHTML = s;
      starInfo();
    }
    function starInfo() {
      const i = star, m = starMonth(i);
      const [name, en, sym] = STARS[i];
      const [nat, natEn] = NATURES[i % 4];
      const y = ethOf(picked)[0];
      const start = jdnToUtc(ethToJdn(y, m, 1)), end = jdnToUtc(ethToJdn(y, m, 30));
      // Fidel classes that fall in this month in the calendar above
      let classes = '';
      const C = window.GeezCalendar;
      if (C && C.letterOn) {
        const seen = [];
        for (let t = start; t <= end; t += 864e5) {
          const g = C.letterOn(t);
          if (g && !seen.includes(g.base)) seen.push(g.base);
        }
        classes = seen.length
          ? `<div><dt>Fidel classes</dt><dd><span class="ge sw-classes">${seen.join(' ')}</span> <span class="sub">The class weeks of the fidel calendar that fall in this month</span></dd></div>`
          : '';
      }
      $('starsInfo').innerHTML =
        `<div class="sw-head"><span class="sw-big">${sym}︎</span><div><h4><span class="ge">${name}</span> · ${en}</h4><span class="sub">Star ${geezNumber(i + 1)} (${i + 1}) of 12</span></div></div>` +
        `<dl class="cube-props">` +
        `<div><dt>Month · ወር</dt><dd><span class="ge">${MONTHS[m - 1]}</span> (${MONTHS_LATIN[m - 1]}) <span class="sub">In ${y} E.C.: ${fmtG(start)} – ${fmtG(end)}</span></dd></div>` +
        `<div><dt>Star · ኮከብ</dt><dd><span class="ge">${name}</span>, ${en}</dd></div>` +
        `<div><dt>Nature · ባሕርይ</dt><dd><span class="ge">${nat}</span>, ${natEn} <span class="sub">The natures repeat in the order fire, earth, air, water</span></dd></div>` +
        classes + `</dl>`;
    }
    wheel.addEventListener('click', (e) => {
      const g = e.target.closest('.sw-sector');
      if (g) { star = Number(g.dataset.i); drawWheel(); }
    });
    wheel.addEventListener('keydown', (e) => {
      const g = e.target.closest('.sw-sector');
      if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); star = Number(g.dataset.i); drawWheel(); wheel.querySelector(`[data-i="${star}"]`).focus(); }
    });

    // ---------- Dial ----------
    // Columns of the card's month fan: column k holds the months whose first day is k weekdays after the new year
    const COLS = Array.from({ length: 7 }, (_, k) => [...Array(13)].map((_, i) => i + 1).filter((m) => (2 * (m - 1)) % 7 === k));
    const disc = $('dialDisc');
    disc.innerHTML = Array.from({ length: 14 }, (_, i) => `<span class="dial-wd"><span class="ge">${WD_AM[i % 7]}</span><span class="sub">${WD_EN[i % 7].slice(0, 3)}</span></span>`).join('');
    $('dialKeys').innerHTML = KEY_LETTERS.map((L, w) => `<span data-w="${w}"><b class="ge">${L}</b>${WD_EN[w].slice(0, 3)}</span>`).join('');

    function drawDial() {
      const y = dialYear;
      const ny = weekday(ethToJdn(y, 1, 1));
      const aa = 5500 + y, q = Math.floor(aa / 4), r = (aa + q) % 7;
      $('dialYear').innerHTML = `${y} <span class="ge">${geezNumber(y)}</span>`;
      $('dialFacts').innerHTML =
        `<div><dt>New year</dt><dd>${WD_EN[ny]} <span class="ge">${WD_AM[ny]}</span>, <span class="ge">መስከረም</span> 1 = ${fmtG(jdnToUtc(ethToJdn(y, 1, 1)))}</dd></div>` +
        `<div><dt>Key letter</dt><dd><span class="ge dial-key">${KEY_LETTERS[ny]}</span></dd></div>` +
        `<div><dt>Evangelist</dt><dd><span class="ge">${EVANGELISTS[y % 4][0]}</span> (${EVANGELISTS[y % 4][1]}) · <span class="ge">ጳጉሜ</span> has ${monthLength(y, 13)} days${isLeap(y) ? ' (leap year, ✱ on the card)' : ''}</dd></div>` +
        `<div><dt>Bahire Hasab</dt><dd class="mono">ዓመተ ዓለም 5500 + ${y} = ${aa}; ${aa} + ${q} = ${aa + q}; mod 7 = ${r} → ${WD_EN[(r + 1) % 7]}</dd></div>`;
      $('dialKeys').querySelectorAll('span').forEach((s) => s.classList.toggle('on', Number(s.dataset.w) === ny));
      $('dialWindow').textContent = KEY_LETTERS[ny];
      // Turn the disc: shift the weekday strip so column 0 shows the new-year weekday
      disc.style.setProperty('--turn', ny);
      dial.innerHTML = COLS.map((ms, k) => `<div class="dial-col">${ms.map((m) =>
        `<button type="button" class="dial-month${m === dialMonth ? ' on' : ''}" data-m="${m}"><span class="ge">${MONTHS[m - 1]}</span></button>`).join('')}</div>`).join('');
      drawDates();
    }
    function drawDates() {
      const y = dialYear, m = dialMonth;
      const first = weekday(ethToJdn(y, m, 1));
      const len = monthLength(y, m);
      $('dialMonthTitle').innerHTML = `<span class="ge">${MONTHS[m - 1]}</span> ${y} begins on ${WD_EN[first]}`;
      let h = Array.from({ length: 7 }, (_, j) => `<span class="dial-dh"><span class="ge">${WD_AM[(first + j) % 7]}</span></span>`).join('');
      for (let d = 1; d <= len; d++) {
        const t = jdnToUtc(ethToJdn(y, m, d));
        const g = window.GeezCalendar && window.GeezCalendar.letterOn ? window.GeezCalendar.letterOn(t) : null;
        h += `<button type="button" class="dial-date${d === dialDay ? ' on' : ''}${t === picked ? ' picked' : ''}" data-d="${d}"><span class="dial-dn">${d}</span>${g ? `<span class="ge">${g.glyph}</span>` : ''}</button>`;
      }
      $('dialDates').innerHTML = h;
      const t = jdnToUtc(ethToJdn(y, m, Math.min(dialDay, len)));
      const wd = weekday(ethToJdn(y, m, Math.min(dialDay, len)));
      $('dialRead').innerHTML =
        `<span class="ge">${MONTHS[m - 1]}</span> ${Math.min(dialDay, len)}, ${y} is a <b>${WD_EN[wd]}</b> (${fmtG(t)}). ` +
        `<span class="mono">(${weekday(ethToJdn(y, 1, 1))} + 2×${m - 1} + ${Math.min(dialDay, len) - 1}) mod 7 = ${wd}</span>`;
    }
    dial.addEventListener('click', (e) => {
      const b = e.target.closest('.dial-month');
      if (!b) return;
      dialMonth = Number(b.dataset.m);
      dialDay = Math.min(dialDay, monthLength(dialYear, dialMonth));
      dial.querySelectorAll('.dial-month').forEach((x) => x.classList.toggle('on', x === b));
      drawDates();
    });
    $('dialDates').addEventListener('click', (e) => {
      const b = e.target.closest('.dial-date');
      if (!b) return;
      dialDay = Number(b.dataset.d);
      const t = jdnToUtc(ethToJdn(dialYear, dialMonth, dialDay));
      if (window.GeezCalendar && window.GeezCalendar.pick) window.GeezCalendar.pick(t);   // moves the fidel calendar too
      else drawDates();
    });
    $('dialPrev').addEventListener('click', () => { dialYear--; dialDay = Math.min(dialDay, monthLength(dialYear, dialMonth)); drawDial(); });
    $('dialNext').addEventListener('click', () => { dialYear++; dialDay = Math.min(dialDay, monthLength(dialYear, dialMonth)); drawDial(); });

    // Follow the date picked in the fidel calendar
    document.addEventListener('fidel-date', (e) => {
      picked = e.detail.t;
      const [y, m, d] = ethOf(picked);
      const s = starOfMonth(m);
      if (s >= 0) star = s;
      dialYear = y; dialMonth = m; dialDay = d;
      drawWheel();
      drawDial();
    });

    drawWheel();
    drawDial();
  });
})();
