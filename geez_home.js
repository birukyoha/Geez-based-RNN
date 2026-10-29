/**
 * Ge'ez RNN Cipher — Home tab
 * Today's fidel letter (from the fidel calendar) and links into the rest of the site.
 */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const home = $('home-tab');
    if (!home) return;

    // Today's letter: the fidel calendar's letter for today's Ethiopian date
    const E = window.EthiopicTime, C = window.GeezCalendar;
    if (E && C && C.letterOn) {
      const n = new Date(), t = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
      const g = C.letterOn(t), loc = C.locate(t);
      $('homeTodayGlyph').textContent = g ? g.glyph : '·';
      $('homeTodayText').innerHTML = `<span class="ge">${E.ethText(t)}</span>` +
        (loc ? `<span>Day ${loc.k + 1} of 364 · Equinox ${loc.half}</span>` : '<span>Between cycles: ጳጉሜ closes the year</span>');
      const pb = $('homeTodayProfile');
      if (pb) {
        if (loc) { const k = loc.k % 182; pb.dataset.letter = `${Math.floor(k / 7)},${k % 7}`; }
        else pb.hidden = true;
      }

      // Today's feast, or the next one, from the Bahire Hasab of this year (and next year if all have passed)
      const B = window.BahireHasab, fe = $('homeFeast');
      if (B && fe) {
        const today = E.utcToJdn(t), Y = E.jdnToEth(today)[0];
        const list = [Y, Y + 1].flatMap((y) => B.compute(y).feasts);
        const hit = list.find((f) => f.j >= today);
        if (hit) {
          const days = hit.j - today, ut = E.jdnToUtc(hit.j);
          const gd = new Date(ut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
          fe.innerHTML = days === 0
            ? `Today is <b class="ge">${hit.am}</b> (${hit.en})`
            : `Next feast: <b class="ge">${hit.am}</b> (${hit.en}) in ${days} day${days === 1 ? '' : 's'} · <span class="ge">${E.ethText(ut)}</span> · ${gd}`;
          fe.hidden = false;
        }
      }
    }

    // How the cipher works, live on today's letter
    const letter = (E && C && C.letterOn) ? ((C.letterOn((() => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); })()) || {}).glyph || 'ሀ') : 'ሀ';
    $('hcLetter').textContent = letter;
    $('hcLetterInline').textContent = letter;
    const cells = (m) => m.flat().map((b) => `<span class="${b ? 'on' : ''}"></span>`).join('');
    try {
      if (typeof GEEZ_DATASET !== 'undefined' && GEEZ_DATASET.getMatrixForChar) $('hcMap').innerHTML = cells(GEEZ_DATASET.getMatrixForChar(letter));
      if (typeof GeezRNNCipher !== 'undefined') {
        const r = new GeezRNNCipher().encryptText(letter);
        const block = r.blocks64[0];
        $('hcBlock').innerHTML = cells(block);
        $('hcHex').textContent = r.hex.replace(/(.{4})/g, '$1 ').trim();
        $('hcRec').innerHTML = block.map((row, i) => {
          const on = row.filter(Boolean).length;
          return `<span>tr${i + 1}<i style="--w:${Math.max(8, on / 8 * 100)}%;--d:${(i * 0.08).toFixed(2)}s"></i></span>`;
        }).join('');
      }
    } catch (err) { /* the rest of Home still works without the live demo */ }

    home.addEventListener('click', (e) => {
      const go = e.target.closest('[data-home-go]');
      if (go && window.GeezModel) {
        const [sub, anchor] = go.dataset.homeGo.split(':');
        window.GeezModel.go(sub === 'model' ? anchor : sub, sub === 'model' ? null : anchor);
        if (sub === 'model') window.scrollTo({ top: 0 });
        return;
      }
      const tab = e.target.closest('[data-home-tab]');
      if (tab) {
        const btn = document.querySelector(`.tab-btn[data-tab="${tab.dataset.homeTab}"]`);
        if (btn) btn.click();
      }
    });
  });
})();
