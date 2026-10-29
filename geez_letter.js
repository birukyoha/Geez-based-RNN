/**
 * Ge'ez RNN Cipher — Letter profile
 * One panel per syllograph that gathers all five properties in one place: its syllable and orders,
 * its picture and family line, its ideas, its number, its days in the fidel calendar, its sound
 * relatives, and its 8×8 map and cipher block. Opens over any tab from any [data-letter="c,o"]
 * button, and has its own address (#letter-c-o).
 */
(function () {
  'use strict';

  const D = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : null;
  if (!D || !Array.isArray(D.ethiopianClasses)) return;
  const FORMS = ['geez', 'kaeb', 'salis', 'rabe', 'hamis', 'sadis', 'sabe'];
  const CLASSES = D.ethiopianClasses.slice(0, 26);
  const WD_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const G_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const $ = (id) => document.getElementById(id);

  let box = null, cur = [0, 0], prevHash = '', lastFocus = null;

  function ensure() {
    if (box) return;
    box = document.createElement('div');
    box.className = 'lp-backdrop';
    box.hidden = true;
    box.innerHTML = `<div class="lp-panel" role="dialog" aria-modal="true" aria-labelledby="lpTitle">
      <div class="lp-bar">
        <button type="button" class="btn secondary small" data-lp="prev" aria-label="Previous letter">←</button>
        <button type="button" class="btn secondary small" data-lp="next" aria-label="Next letter">→</button>
        <span class="hint lp-pos" id="lpPos"></span>
        <button type="button" class="btn secondary small lp-close" data-lp="close">Close</button>
      </div>
      <div class="lp-body" id="lpBody"></div>
    </div>`;
    document.body.appendChild(box);
    box.addEventListener('click', (e) => {
      if (e.target === box) { close(); return; }
      const b = e.target.closest('[data-lp]');
      if (b) {
        const a = b.dataset.lp;
        if (a === 'close') close();
        if (a === 'prev' || a === 'next') {
          let k = cur[0] * 7 + cur[1] + (a === 'next' ? 1 : -1);
          k = (k + 182) % 182;
          open(Math.floor(k / 7), k % 7);
        }
        if (a === 'order') open(cur[0], Number(b.dataset.o));
        if (a === 'family' && window.GeezModel) { close(); window.GeezModel.go('pictographic'); if (window.GeezFamily && window.GeezFamily.select) window.GeezFamily.select(cur[0], true); }
        if (a === 'calendar' && window.GeezModel) {
          close();
          if (window.GeezCalendar && window.GeezCalendar.pick) window.GeezCalendar.pick(Number(b.dataset.t));
          window.GeezModel.go('astrographic', 'astroCalendar');
        }
        if (a === 'map' && window.GeezApp) { close(); window.GeezApp.openMap(CLASSES[cur[0]][FORMS[cur[1]]]); }
      }
    });
    document.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && !e.target.closest('input, textarea')) box.querySelector('[data-lp="next"]').click();
      if (e.key === 'ArrowLeft' && !e.target.closest('input, textarea')) box.querySelector('[data-lp="prev"]').click();
    });
  }

  const card = (title, body, cls = '') => `<section class="lp-card ${cls}"><h4>${title}</h4>${body}</section>`;

  function build(c, o) {
    const cls = CLASSES[c], g = cls[FORMS[o]];
    const S = window.GeezSyllo, E = window.EthiopicTime, N = window.GeezNumbers;
    const F = window.GeezFamily && window.GeezFamily.data ? window.GeezFamily.data[c] : null;
    const P = window.GeezPicto ? window.GeezPicto.drawingFor(c) : null;
    const themes = window.GeezIdeo ? window.GeezIdeo.themesOf(c) : [];
    const cons = S ? S.CONS[c] : '', vow = S ? S.VOWELS[o] : '';
    const value = cls.baseValue * (o + 1);

    // Days in the fidel calendar this Ethiopian year: k = 7c + o, and again 182 days later
    let cal = '';
    if (E) {
      const n = new Date(), today = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
      const Y = E.jdnToEth(E.utcToJdn(today))[0];
      cal = [0, 182].map((off, h) => {
        const k = 7 * c + o + off, m = Math.floor(k / 30) + 1, d = (k % 30) + 1;
        const j = E.ethToJdn(Y, m, d), t = E.jdnToUtc(j), x = new Date(t);
        return `<li><b>Day ${k + 1}</b> · Equinox ${h + 1} · <span class="ge">${E.MONTHS[m - 1]} ${d}</span> <span class="hint">${WD_EN[E.weekday(j)]}, ${x.getUTCDate()} ${G_MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}</span>` +
          ` <button type="button" class="lp-link" data-lp="calendar" data-t="${t}">Show</button></li>`;
      }).join('');
      cal = `<ul class="lp-list">${cal}</ul><p class="hint">Week ${c + 1} of each equinox belongs to <span class="ge">${cls.geez}</span>; its ${o + 1}${['st', 'nd', 'rd'][o] || 'th'} order falls on day ${o + 1} of that week.</p>`;
    }

    // 8×8 map and the cipher block
    let cipher = '';
    try {
      const m = D.getMatrixForChar(g);
      const r = typeof GeezRNNCipher !== 'undefined' ? new GeezRNNCipher().encryptText(g) : null;
      const cells = (mm) => mm.flat().map((b) => `<span class="${b ? 'on' : ''}"></span>`).join('');
      cipher = `<div class="lp-maps"><div><div class="hc-grid">${cells(m)}</div><span class="hint">8×8 map</span></div>` +
        (r ? `<div><div class="hc-grid out">${cells(r.blocks64[0])}</div><span class="hint">Cipher block</span></div>` : '') + `</div>` +
        (r ? `<p class="mono lp-hex">${r.hex.replace(/(.{4})/g, '$1 ').trim()}</p>` : '') +
        `<button type="button" class="btn secondary small" data-lp="map">Open in the 8×8 map</button>`;
    } catch (e) { cipher = '<p class="hint">No map for this letter.</p>'; }

    // Sound relatives
    const grp = S && S.groupOf(c);
    const amh = (D.amharicClasses || []).filter((a) => a.from === cls.geez);
    const sound = (grp ? `<p>Sounds like ${grp.classes.filter((k) => k !== c).map((k) => `<span class="ge lp-g">${CLASSES[k][FORMS[o]]}</span>`).join(' ')} in Amharic. In Ge'ez it was ${grp.was[grp.classes.indexOf(c)]}.</p>` : '<p>No other letter shares its sound.</p>') +
      (amh.length ? `<p>Amharic built <span class="ge lp-g">${amh.map((a) => a[FORMS[o]]).join(' ')}</span> from it.</p>` : '');

    // Family line
    const famLine = F ? [F.egy ? `<span class="hiero">${F.egy}</span>` : '', F.ps ? `<i>${F.ps}</i>` : '', F.phn ? `<span class="phn">${F.phn}</span>` : '', F.osa ? `<span class="osa">${F.osa}</span>` : '', `<span class="ge">${cls.geez}</span>`]
      .filter(Boolean).join('<span class="lp-arrow">→</span>') : '';

    return `<header class="lp-head">
        <span class="lp-big ge">${g}</span>
        <div><h3 id="lpTitle">${cls.name} <span class="ge">${g}</span></h3>
          <p class="lp-sub">Class ${c + 1} · ${S ? S.ORDER_NAMES[o] : ''}, order ${o + 1} · <span class="mono">${cons}${o === 5 ? '(ə)' : vow}</span></p>
          <div class="lp-orders">${FORMS.map((f, k) => `<button type="button" data-lp="order" data-o="${k}" class="${k === o ? 'on' : ''}" aria-label="Order ${k + 1}">${cls[f]}</button>`).join('')}</div>
        </div>
      </header>
      <div class="lp-grid">
        ${card('Pictographic', `${P ? `<span class="ink lp-draw" style="--src:url(img/picto/${P.pic}.svg)" aria-hidden="true"></span>` : ''}` +
          `<p>${P ? `A picture of ${P.thing}. ` : ''}${F && F.pic ? `The Proto-Sinaitic sign showed ${F.pic}.` : (F && F.note ? F.note : '')}</p>` +
          (famLine ? `<p class="lp-fam">${famLine}</p>` : '') +
          (F && (F.greek || F.latin) ? `<p class="hint">Relatives today: ${[F.greek, F.latin].filter(Boolean).join(' ')}</p>` : '') +
          `<button type="button" class="btn secondary small" data-lp="family">See its family</button>`)}
        ${card('Ideographic', `<p><b>${cls.meaning || '–'}</b></p>` + (themes.length ? `<ul class="lp-list">${themes.map((t) => `<li>${t.label}: ${t.idea}</li>`).join('')}</ul>` : '') + (cls.pictoOrigin ? `<p class="hint">${cls.pictoOrigin}</p>` : ''))}
        ${card('Astrographic', cal)}
        ${card('Numeric', `<p class="lp-num"><span class="mono">${cls.baseValue} × ${o + 1} =</span> <b>${value.toLocaleString()}</b>${N ? ` <span class="ge">${N.toGeez(value)}</span>` : ''}</p><p class="hint">Base value ${cls.baseValue} for the class, multiplied by the order.</p>`)}
        ${card('Syllographic', `<p><span class="mono">${cons}</span> + <span class="mono">${vow}</span>. ${S ? S.MARKS[o].charAt(0).toUpperCase() + S.MARKS[o].slice(1) : ''}.</p>` + sound)}
        ${card('In the cipher', cipher)}
      </div>`;
  }

  function open(c, o, updateHash = true) {
    if (!(c >= 0 && c < 26 && o >= 0 && o < 7)) return;
    ensure();
    if (box.hidden) { lastFocus = document.activeElement; prevHash = location.hash; }
    cur = [c, o];
    $('lpBody').innerHTML = build(c, o);
    $('lpPos').textContent = `${c * 7 + o + 1} of 182`;
    box.hidden = false;
    document.documentElement.classList.add('lp-open');
    box.querySelector('.lp-panel').scrollTop = 0;
    if (updateHash) { try { history.replaceState(null, '', `#letter-${c}-${o}`); } catch (e) { /* ignore */ } }
    box.querySelector('.lp-close').focus({ preventScroll: true });
  }
  function close(restoreHash = true) {
    if (!box || box.hidden) return;
    box.hidden = true;
    document.documentElement.classList.remove('lp-open');
    if (restoreHash) try { history.replaceState(null, '', prevHash && !prevHash.startsWith('#letter-') ? prevHash : location.pathname); } catch (e) { /* ignore */ }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Any [data-letter="c,o"] button on the page opens a profile
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-letter]');
    if (!b) return;
    const [c, o] = b.dataset.letter.split(',').map(Number);
    open(c, o);
  });

  window.GeezLetter = { open, close };
})();
