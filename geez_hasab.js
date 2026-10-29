/**
 * Ge'ez RNN Cipher — Bahire Hasab (ባሕረ ሐሳብ), the Ethiopian computus
 * The method behind wheels like the one in British Library Or. 816: from the year, find the moon's
 * place in its 19-year cycle, then the day of the Nineveh fast, and from it every moveable feast.
 *   ዓመተ ዓለም  AA = 5500 + year
 *   ወንበር     = (AA − 1) mod 19                the year's place in the 19-year moon cycle
 *   አበቅቴ     = ወንበር × 11 mod 30              the epact: the moon's age when the year begins
 *   መጥቅዕ     = ወንበር × 19 mod 30              and አበቅቴ + መጥቅዕ = 30 (0 is counted as 30)
 *   በዓለ መጥቅዕ = መስከረም መጥቅዕ if it is over 14, otherwise ጥቅምት መጥቅዕ
 *   ተውሳክ     = by the weekday of በዓለ መጥቅዕ: Sun 7, Mon 6, Tue 5, Wed 4, Thu 3, Fri 2, Sat 8
 *   መባጃ ሐመር  = መጥቅዕ + ተውሳክ                  the day of ጾመ ነነዌ in ጥር (or the next month past 30)
 * The feasts follow at fixed distances from ጾመ ነነዌ. Checked against the Julian computus for
 * every year from 1800 to 2100 E.C.: ፋሲካ agrees in all of them.
 * Dates: EthiopicTime (geez_astro.js).
 */
(function () {
  'use strict';

  const E = window.EthiopicTime;
  if (!E) return;
  const WD_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WD_AM = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
  const TEWSAK = [7, 6, 5, 4, 3, 2, 8];                       // by weekday, Sunday first
  const EVANGELISTS = [['ዮሐንስ', 'John'], ['ማቴዎስ', 'Matthew'], ['ማርቆስ', 'Mark'], ['ሉቃስ', 'Luke']];
  const FEASTS = [
    [0, 'ጾመ ነነዌ', 'Fast of Nineveh'], [14, 'ዐቢይ ጾም', 'Great Lent begins'], [41, 'ደብረ ዘይት', 'Debre Zeit, mid-Lent'],
    [62, 'ሆሳዕና', 'Hosanna, Palm Sunday'], [67, 'ስቅለት', 'Siklet, Good Friday'], [69, 'ትንሣኤ (ፋሲካ)', 'Easter'],
    [93, 'ርክበ ካህናት', 'Rekbe Kahnat'], [108, 'ዕርገት', 'Ascension'], [118, 'ጰራቅሊጦስ', 'Pentecost'],
    [119, 'ጾመ ሐዋርያት', 'Fast of the Apostles'], [121, 'ጾመ ድኅነት', 'Fast of Salvation']
  ];
  const G_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtG = (j) => { const x = new Date(E.jdnToUtc(j)); return `${x.getUTCDate()} ${G_MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
  const fmtE = (j) => { const [y, m, d] = E.jdnToEth(j); return `${E.MONTHS[m - 1]} ${d}`; };
  const wd = (j) => E.weekday(j);

  function compute(Y) {
    const AA = 5500 + Y, q = Math.floor(AA / 4), ny = (AA + q) % 7;      // 0 = Monday
    const wenber = (AA - 1) % 19, abeqte = (wenber * 11) % 30, metqi = (wenber * 19) % 30;
    // በዓለ መጥቅዕ: over 14 falls in መስከረም, otherwise in ጥቅምት; 0 is read as 30, መስከረም 30
    let bm = metqi > 14 ? [1, metqi] : [2, metqi];
    if (metqi === 0) bm = [1, 30];
    const bmJ = E.ethToJdn(Y, bm[0], bm[1]);
    const tewsak = TEWSAK[wd(bmJ)];
    const mebaja = (metqi === 0 ? 30 : metqi) + tewsak;
    let nm = bm[0] === 1 ? 5 : 6, nd = mebaja;                           // ጥር after መስከረም, የካቲት after ጥቅምት
    if (nd > 30) { nd -= 30; nm++; }
    const nineveh = E.ethToJdn(Y, nm, nd);
    return { Y, AA, q, ny, wenber, abeqte, metqi, bm, bmJ, tewsak, mebaja, nm, nd, nineveh,
      feasts: FEASTS.map(([off, am, en]) => ({ off, am, en, j: nineveh + off })) };
  }
  window.BahireHasab = { compute };

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('hbWheel')) return;
    const n = new Date();
    let year = E.jdnToEth(E.utcToJdn(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())))[0];
    let step = 9, timer = null;
    const STEPS = 10;

    // ---------- The wheel: the 19-year cycle on four rings ----------
    const C = 260;
    const pol = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
    const arc = (r0, r1, a0, a1) => {
      const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1), [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0);
      return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r1},${r1} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} A${r0},${r0} 0 0 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z`;
    };
    const RINGS = [['wenber', 'ወንበር', 72, 112], ['abeqte', 'አበቅቴ', 112, 152], ['metqi', 'መጥቅዕ', 152, 192], ['years', 'ዓመታት', 192, 244]];
    function drawWheel(r) {
      const step19 = 360 / 19;
      const first = r.Y - r.wenber;                    // first year of this cycle (ወንበር 0)
      let s = `<g class="hb-rot" style="transform: rotate(${-(r.wenber * step19)}deg)">`;
      for (let w = 0; w < 19; w++) {
        const a0 = w * step19 - step19 / 2, a1 = a0 + step19, mid = w * step19;
        const vals = { wenber: w, abeqte: (w * 11) % 30, metqi: (w * 19) % 30, years: first + w };
        const on = w === r.wenber;
        s += `<g class="hb-sec${on ? ' on' : ''}" data-y="${first + w}" tabindex="0" role="button" aria-label="${first + w}: ወንበር ${w}, አበቅቴ ${vals.abeqte}, መጥቅዕ ${vals.metqi}">`;
        RINGS.forEach(([k, , r0, r1]) => {
          s += `<path class="hb-cell ${k}" d="${arc(r0, r1, a0, a1)}"/>`;
          const [x, y] = pol((r0 + r1) / 2, mid);
          const v = vals[k];
          // 0 has no Ge'ez numeral: መጥቅዕ 0 is read as 30, the others show a dash
          const txt = k === 'years' ? `${v}` : (v ? E.geezNumber(v) : (k === 'metqi' ? '፴' : '–'));
          s += `<text class="hb-t ${k}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" transform="rotate(${mid} ${x.toFixed(1)} ${y.toFixed(1)})">${txt}</text>`;
        });
        s += `</g>`;
      }
      s += `</g>`;
      // Fixed parts: the pointer at the top, ring names, and the year in the middle
      RINGS.forEach(([k, name, r0, r1]) => {
        const [x, y] = pol((r0 + r1) / 2, 0);
        s += `<text class="hb-ring-name" x="${(x + 2).toFixed(1)}" y="${(y - (r1 - r0) / 2 + 2).toFixed(1)}" text-anchor="middle">${name}</text>`;
      });
      s += `<path class="hb-pointer" d="M${C - 9},${C - 252} L${C + 9},${C - 252} L${C},${C - 238} Z"/>`;
      s += `<circle class="hb-core" cx="${C}" cy="${C}" r="66"/>`;
      s += `<text class="hb-core-g" x="${C}" y="${C - 6}" text-anchor="middle">${E.geezNumber(r.Y)}</text>`;
      s += `<text class="hb-core-y" x="${C}" y="${C + 16}" text-anchor="middle">${r.Y} E.C.</text>`;
      s += `<text class="hb-core-s" x="${C}" y="${C + 34}" text-anchor="middle">${EVANGELISTS[r.Y % 4][0]}</text>`;
      $('hbWheel').innerHTML = s;
    }

    // ---------- The working, one step at a time ----------
    function steps(r) {
      const bmTxt = `${E.MONTHS[r.bm[0] - 1]} ${r.bm[1]}`;
      return [
        ['ዓመተ ዓለም', 'Year of the world', `5500 + ${r.Y} = <b>${r.AA}</b>`],
        ['ወንጌላዊ', 'Evangelist', `${r.AA} mod 4 = ${r.AA % 4} → <b class="ge">${EVANGELISTS[r.Y % 4][0]}</b> (${EVANGELISTS[r.Y % 4][1]})${r.Y % 4 === 3 ? ', a leap year: ጳጉሜ has 6 days' : ''}`],
        ['መባቻ', 'New-year weekday', `(${r.AA} + ${r.q}) mod 7 = ${r.ny}, counted from Monday → <b>${WD_EN[(r.ny + 1) % 7]}</b>`],
        ['ወንበር', 'Place in the 19-year cycle', `(${r.AA} − 1) mod 19 = <b>${r.wenber}</b>`],
        ['አበቅቴ', 'Epact, the moon’s age', `${r.wenber} × 11 mod 30 = <b>${r.abeqte}</b>`],
        ['መጥቅዕ', 'Metqi', `${r.wenber} × 19 mod 30 = <b>${r.metqi}</b>${r.metqi ? ` <span class="hint">(${r.abeqte} + ${r.metqi} = 30)</span>` : ' <span class="hint">0 is read as 30</span>'}`],
        ['በዓለ መጥቅዕ', 'Its day', `${r.metqi === 0 ? '30' : r.metqi} ${r.bm[0] === 1 ? '> 14, so in መስከረም' : '≤ 14, so in ጥቅምት'} → <b class="ge">${bmTxt}</b>, a ${WD_EN[wd(r.bmJ)]}`],
        ['ተውሳክ', 'Weekday addition', `${WD_EN[wd(r.bmJ)]} → <b>${r.tewsak}</b> <span class="hint">Sun 7 · Mon 6 · Tue 5 · Wed 4 · Thu 3 · Fri 2 · Sat 8</span>`],
        ['መባጃ ሐመር', 'Sum', `${r.metqi === 0 ? 30 : r.metqi} + ${r.tewsak} = <b>${r.mebaja}</b>${r.mebaja > 30 ? ' − 30 = ' + (r.mebaja - 30) + ', one month on' : ''}`],
        ['ጾመ ነነዌ', 'Fast of Nineveh', `<b class="ge">${E.MONTHS[r.nm - 1]} ${r.nd}</b>, a Monday · ${fmtG(r.nineveh)}`]
      ];
    }

    function render() {
      const r = compute(year);
      drawWheel(r);
      $('hbYear').innerHTML = `${year} <span class="ge">${E.geezNumber(year)}</span>`;
      $('hbSteps').innerHTML = steps(r).map(([am, en, body], i) =>
        `<li class="${i === step ? 'on' : ''}${i > step ? ' later' : ''}"><span class="hb-step-n mono">${i + 1}</span>` +
        `<span class="hb-step-h"><b class="ge">${am}</b><span class="hint">${en}</span></span><span class="hb-step-b">${body}</span></li>`).join('');
      $('hbFeasts').innerHTML = r.feasts.map((f, i) =>
        `<tr class="${step < STEPS - 1 ? 'later' : ''}${f.off === 69 ? ' easter' : ''}"><td class="ge">${f.am}</td><td>${f.en}</td>` +
        `<td class="mono">+${f.off}</td><td class="ge">${fmtE(f.j)}</td><td>${WD_EN[wd(f.j)].slice(0, 3)}</td><td>${fmtG(f.j)}</td></tr>`).join('');
      $('hbPlay').textContent = timer ? 'Pause' : 'Play';
    }
    const stop = () => { clearInterval(timer); timer = null; };
    $('hbPrev').addEventListener('click', () => { stop(); year--; render(); });
    $('hbNext').addEventListener('click', () => { stop(); year++; render(); });
    $('hbToday').addEventListener('click', () => {
      stop();
      const m = new Date();
      year = E.jdnToEth(E.utcToJdn(Date.UTC(m.getFullYear(), m.getMonth(), m.getDate())))[0];
      render();
    });
    $('hbPlay').addEventListener('click', () => {
      if (timer) { stop(); render(); return; }
      step = 0; render();
      timer = setInterval(() => { if (step >= STEPS - 1) { stop(); render(); return; } step++; render(); }, 1400);
      render();
    });
    $('hbSteps').addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) { stop(); step = [...li.parentNode.children].indexOf(li); render(); } });
    $('hbWheel').addEventListener('click', (e) => { const g = e.target.closest('.hb-sec'); if (g) { stop(); year = Number(g.dataset.y); render(); } });
    $('hbWheel').addEventListener('keydown', (e) => {
      const g = e.target.closest('.hb-sec');
      if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); year = Number(g.dataset.y); render(); }
    });
    // Follow the year of the date picked in the fidel calendar
    document.addEventListener('fidel-date', (e) => {
      const y = E.jdnToEth(E.utcToJdn(e.detail.t))[0];
      if (y !== year) { year = y; render(); }
    });
    render();
  });
})();
