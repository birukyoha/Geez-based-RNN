/**
 * Ge'ez RNN Cipher — Ideographic property: the meanings as a map
 * Each class carries one or two ideas (geez_dataset.js: meaning). Grouped by theme, the ideas
 * light up their letters, and the 52-week ribbon shows where those letters fall in the
 * fidel calendar: class c holds week c + 1 of each equinox (days 7c + 1 … 7c + 7 and the
 * same again from day 183). Links open the calendar or the letter's family.
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;
  const CLASSES = D.ethiopianClasses.slice(0, 26);
  const MONTHS = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];

  // Theme → { class index: the idea it carries in that theme }
  const THEMES = [
    { key: 'body', label: 'The body', ideas: { 1: 'tongue', 4: 'tooth', 5: 'head', 6: 'person', 12: 'eye', 13: 'hand, palm', 15: 'eye', 17: 'right fisted hand', 24: 'mouth, breath' } },
    { key: 'home', label: 'Home and craft', ideas: { 2: 'thread', 8: 'house, door', 10: 'enclosure, yard', 11: 'copper', 14: 'hook, peg', 16: 'weapon, armour', 18: 'door, entrance', 20: 'basket' } },
    { key: 'animals', label: 'Animals', ideas: { 0: 'lion', 7: 'horn', 11: 'snake', 19: 'camel' } },
    { key: 'nature', label: 'Nature and sky', ideas: { 3: 'water', 4: 'sun', 15: 'fountain', 20: 'sun disk', 22: 'sprout', 23: 'sun, dawn' } },
    { key: 'ideas', label: 'Ideas and order', ideas: { 0: 'beginning', 1: 'word', 2: 'life', 5: 'leader', 7: 'top', 9: 'mark, sign', 12: 'origin', 21: 'split, form', 22: 'righteousness', 25: 'end, boundary' } }
  ];

  window.GeezIdeo = { themesOf: (c) => THEMES.filter((t) => c in t.ideas).map((t) => ({ label: t.label, idea: t.ideas[c] })) };
  /** Ethiopian month/day of a cycle day k (0–363) */
  const md = (k) => [Math.floor(k / 30) + 1, (k % 30) + 1];
  const weekText = (c, half) => {
    const k0 = (half - 1) * 182 + 7 * c, [m0, d0] = md(k0), [m1, d1] = md(k0 + 6);
    return m0 === m1 ? `${MONTHS[m0 - 1]} ${d0}–${d1}` : `${MONTHS[m0 - 1]} ${d0} – ${MONTHS[m1 - 1]} ${d1}`;
  };

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('idGrid')) return;
    let theme = 'body', cur = 3;

    $('idThemes').innerHTML = THEMES.map((t) => `<button type="button" data-t="${t.key}">${t.label} <span class="mono">${Object.keys(t.ideas).length}</span></button>`).join('') +
      `<button type="button" data-t="all">All 26</button>`;
    $('idGrid').innerHTML = CLASSES.map((cls, c) =>
      `<button type="button" class="id-tile" data-c="${c}"><span class="ge">${cls.geez}</span><span class="id-words">${(cls.meaning || '').toLowerCase()}</span></button>`).join('');
    // 52-week ribbon: two equinoxes of 26 class weeks
    $('idRibbon').innerHTML = [1, 2].map((h) =>
      `<div class="id-rib-row"><span class="label">Equinox ${h}</span><div class="id-rib">${CLASSES.map((cls, c) =>
        `<span class="id-wk" data-c="${c}" title="Week ${c + 1}: ${weekText(c, h)}"><span class="ge">${cls.geez}</span></span>`).join('')}</div>` +
      `<span class="hint id-rib-ends">${weekText(0, h).split(' ')[0]} → ${weekText(25, h).split(' – ').pop().split(' ')[0]}</span></div>`).join('');

    function render() {
      const T = THEMES.find((t) => t.key === theme);
      $('idThemes').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.t === theme));
      $('idGrid').querySelectorAll('.id-tile').forEach((b) => {
        const c = Number(b.dataset.c);
        const hit = !T || c in T.ideas;
        b.classList.toggle('hit', !!T && hit);
        b.classList.toggle('faded', !hit);
        b.classList.toggle('sel', c === cur);
        b.querySelector('.id-words').textContent = T && hit ? T.ideas[c] : (CLASSES[c].meaning || '').toLowerCase();
      });
      $('idRibbon').querySelectorAll('.id-wk').forEach((w) => {
        const c = Number(w.dataset.c);
        w.classList.toggle('hit', !!T && c in T.ideas);
        w.classList.toggle('sel', c === cur);
      });
      $('idSummary').innerHTML = T
        ? `<b>${T.label}</b>: ${Object.entries(T.ideas).map(([c, w]) => `<span class="ge">${CLASSES[c].geez}</span> ${w}`).join(' · ')}`
        : 'All 26 classes with their ideas. Pick a theme to group them.';
      const cls = CLASSES[cur];
      const themes = THEMES.filter((t) => cur in t.ideas).map((t) => t.label.toLowerCase());
      $('idInfo').innerHTML =
        `<div class="sy-head"><span class="sy-big ge">${cls.geez}</span><div><h4>${cls.name}</h4><span class="sub">${cls.meaning || ''}</span></div></div>` +
        `<dl class="cube-props">` +
        `<div><dt>Themes</dt><dd>${themes.join(', ') || '–'}</dd></div>` +
        `<div><dt>Picture</dt><dd>${cls.pictoOrigin || '–'}</dd></div>` +
        `<div><dt>Calendar weeks</dt><dd><span class="ge">${weekText(cur, 1)}</span> and <span class="ge">${weekText(cur, 2)}</span> <span class="sub">Week ${cur + 1} of each equinox carries ${cls.geez} through its seven orders</span></dd></div>` +
        `</dl>` +
        `<div class="btn-row"><button type="button" class="btn secondary small" data-id-go="calendar">Show in the calendar</button>` +
        `<button type="button" class="btn secondary small" data-id-go="family">See its family</button><button type="button" class="btn small lp-open-btn" data-letter="${cur},0">Full letter profile</button></div>`;
    }

    $('idThemes').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      theme = b.dataset.t;
      const T = THEMES.find((t) => t.key === theme);
      if (T && !(cur in T.ideas)) cur = Number(Object.keys(T.ideas)[0]);
      render();
    });
    const pick = (e) => { const b = e.target.closest('[data-c]'); if (b) { cur = Number(b.dataset.c); render(); } };
    $('idGrid').addEventListener('click', pick);
    $('idRibbon').addEventListener('click', pick);
    $('idInfo').addEventListener('click', (e) => {
      const b = e.target.closest('[data-id-go]');
      if (!b || !window.GeezModel) return;
      if (b.dataset.idGo === 'family') {
        window.GeezModel.go('pictographic');
        if (window.GeezFamily) window.GeezFamily.select(cur, true);
      } else {
        const E = window.EthiopicTime;
        if (E && window.GeezCalendar && window.GeezCalendar.pick) {
          const n = new Date(), today = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
          const y = E.jdnToEth(E.utcToJdn(today))[0];
          const [m, d] = md(7 * cur);
          window.GeezCalendar.pick(E.jdnToUtc(E.ethToJdn(y, m, d)));
        }
        window.GeezModel.go('astrographic', 'astroCalendar');
      }
    });
    render();
  });
})();
