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
    }

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
