/**
 * Ge'ez RNN Cipher — UI logic
 * Engine: geez_rnn_engine.js · Data: geez_dataset.js
 */
document.addEventListener('DOMContentLoaded', () => {
  const engine = new GeezRNNCipher();
  const $ = (id) => document.getElementById(id);

  // ---------- State ----------
  let selectedChar = 'A';
  let lastEncryption = null;
  let inspectorStep = 1;
  let playInterval = null;
  let activeOrderFilter = 0;
  let highlightedSpokeIdx = -1;

  // ---------- Theme tokens (canvas + SVG read colors from CSS) ----------
  function tokens() {
    const s = getComputedStyle(document.documentElement);
    const v = (n) => s.getPropertyValue(n).trim();
    return {
      bg: v('--bg'), surface: v('--surface'), surface2: v('--surface-2'), line: v('--line'),
      ink: v('--ink'), muted: v('--muted'), rubric: v('--rubric'), ochre: v('--ochre'), ok: v('--ok'),
      mono: v('--font-mono') || 'monospace', ethiopic: v('--font-ethiopic') || 'serif', ui: v('--font-ui') || 'sans-serif'
    };
  }
  function alpha(color, a) {
    // Accepts #rrggbb; returns rgba string
    const m = /^#([0-9a-f]{6})$/i.exec(color);
    if (!m) return color;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Theme switch (Auto / Light / Dark) ----------
  const themeButtons = document.querySelectorAll('[data-theme-choice]');
  function applyTheme(choice) {
    if (choice === 'light' || choice === 'dark') document.documentElement.setAttribute('data-theme', choice);
    else document.documentElement.removeAttribute('data-theme');
    themeButtons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.themeChoice === choice)));
  }
  let savedTheme = 'auto';
  try { savedTheme = localStorage.getItem('geez-theme') || 'auto'; } catch (e) { /* storage blocked */ }
  applyTheme(savedTheme);
  themeButtons.forEach((b) => b.addEventListener('click', () => {
    const choice = b.dataset.themeChoice;
    applyTheme(choice);
    try { localStorage.setItem('geez-theme', choice); } catch (e) { /* storage blocked */ }
  }));

  // ---------- Tabs + hash routing ----------
  const ROUTES = {
    encrypt: 'encrypt-tab', decrypt: 'decrypt-tab', map: 'visualizer-tab',
    inspector: 'inspector-tab', model: 'architecture-tab', history: 'infographics-tab'
  };
  const TAB_TO_ROUTE = Object.fromEntries(Object.entries(ROUTES).map(([k, v]) => [v, k]));
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function showTab(tabId, updateHash = true) {
    if (!$(tabId)) tabId = 'encrypt-tab';
    tabButtons.forEach((b) => {
      const on = b.dataset.tab === tabId;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    tabContents.forEach((c) => c.classList.toggle('active', c.id === tabId));
    moveDock();
    if (tabId === 'visualizer-tab') renderVisualizer();
    if (tabId === 'inspector-tab') renderInspector();
    if (tabId === 'architecture-tab') renderNumerologyWheel();
    if (tabId === 'infographics-tab') renderGeezTree();
    if (updateHash) {
      const route = TAB_TO_ROUTE[tabId];
      if (route && location.hash !== '#' + route) {
        try { history.replaceState(null, '', '#' + route); } catch (e) { location.hash = route; }
      }
    }
  }
  // Slide the dock's bump and colored bubble under the active section
  const dock = document.querySelector('.dock');
  function moveDock(instant) {
    const btn = document.querySelector('.tab-btn.active');
    if (!dock || !btn) return;
    if (instant) dock.classList.add('no-anim');
    const center = btn.offsetLeft + btn.offsetWidth / 2;
    const bump = dock.querySelector('.dock-bump');
    const bubble = dock.querySelector('.dock-bubble');
    const bw = bump.getBoundingClientRect().width;
    const maxLeft = dock.clientWidth - bw - 6;
    bump.style.transform = `translateX(${Math.min(Math.max(center - bw / 2, 6), maxLeft)}px)`;
    bubble.style.transform = `translateX(${center - bubble.getBoundingClientRect().width / 2}px)`;
    dock.style.setProperty('--bubble-color', btn.style.getPropertyValue('--accent'));
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => dock.classList.remove('no-anim')));
  }
  window.addEventListener('resize', () => moveDock(true));
  if (window.ResizeObserver && dock) new ResizeObserver(() => moveDock(true)).observe(dock);

  tabButtons.forEach((btn) => btn.addEventListener('click', () => {
    showTab(btn.dataset.tab);
    window.scrollTo({ top: 0 });
  }));
  // Arrow keys move between sections (standard tablist behavior)
  document.querySelector('.tabs').addEventListener('keydown', (e) => {
    const list = [...tabButtons];
    const i = list.indexOf(document.activeElement);
    if (i < 0) return;
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % list.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = list.length - 1;
    if (n < 0) return;
    e.preventDefault();
    list[n].focus();
    showTab(list[n].dataset.tab);
  });
  function routeFromHash() {
    const key = (location.hash || '').replace('#', '');
    if (ROUTES[key]) showTab(ROUTES[key], false);
  }
  window.addEventListener('hashchange', routeFromHash);

  // ---------- Copy buttons ----------
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = $(btn.dataset.copy);
      const text = el ? el.textContent.trim() : '';
      if (!text || text === '–') return;
      const done = () => {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1400);
      };
      const fallback = () => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = 'Selected';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
      };
      try {
        navigator.clipboard.writeText(text).then(done, fallback);
      } catch (e) { fallback(); }
    });
  });

  // ---------- Mini 8x8 tiles ----------
  function tileHtml(block, caption, active) {
    let cells = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const flag = c < 2 || r === 7;
        const on = block[r][c] === 1;
        cells += `<i class="${on ? 'on' : (flag ? 'flag' : '')}"></i>`;
      }
    }
    return `<button type="button" class="tile${active ? ' active' : ''}" data-char="${escapeHtml(caption)}" title="Inspect '${escapeHtml(caption === ' ' ? 'space' : caption)}'">
      <span class="tile-grid">${cells}</span>
      <span class="tile-cap">${caption === ' ' ? '␣' : escapeHtml(caption)}</span>
    </button>`;
  }

  // ---------- Encryption ----------
  const inputText = $('inputText');
  const keyPassphrase = $('keyPassphrase');
  const enableAES = $('enableAES');

  async function performEncryption() {
    const text = inputText.value || '';
    if (!text) {
      lastEncryption = null;
      $('cipherTiles').innerHTML = '<p class="hint">Type a message to see its cipher blocks.</p>';
      ['outputHex', 'outputAES', 'outputBinary'].forEach((id) => { $(id).textContent = '–'; });
      $('statChars').textContent = '0';
      $('statBits').textContent = '0';
      $('statAES').textContent = '–';
      $('blockCount').textContent = '0 blocks';
      return;
    }
    const result = engine.encryptText(text);
    lastEncryption = result;

    $('cipherTiles').innerHTML = result.charResults
      .map((r) => tileHtml(r.block64, r.character, r.character === selectedChar))
      .join('');
    $('blockCount').textContent = `${result.blocks64.length} block${result.blocks64.length === 1 ? '' : 's'}`;
    $('statChars').textContent = String(text.length);
    $('statBits').textContent = result.fullBinary.length.toLocaleString();
    $('outputHex').textContent = result.hex;
    $('outputBinary').textContent = (result.fullBinary.match(/.{1,8}/g) || []).join(' ');

    $('passGroup').hidden = !enableAES.checked;
    $('pipeAES').classList.toggle('off', !enableAES.checked);

    if (enableAES.checked && window.crypto && window.crypto.subtle) {
      const aes = await engine.encryptAES128(result.fullBinary, keyPassphrase.value);
      $('outputAES').textContent = aes.ciphertextHex;
      $('outputAES').classList.remove('muted');
      $('statAES').textContent = /^[0-9A-F]+$/.test(aes.ciphertextHex) ? (aes.ciphertextHex.length / 2).toLocaleString() : '–';
    } else {
      $('outputAES').textContent = enableAES.checked ? 'AES is not available in this browser.' : 'AES layer is off.';
      $('outputAES').classList.add('muted');
      $('statAES').textContent = '–';
    }
  }

  $('cipherTiles').addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    selectChar(tile.dataset.char);
    showTab('inspector-tab');
  });
  $('btnEncrypt').addEventListener('click', performEncryption);
  inputText.addEventListener('input', performEncryption);
  enableAES.addEventListener('change', performEncryption);
  keyPassphrase.addEventListener('input', performEncryption);

  // ---------- Decryption ----------
  const decryptInputType = $('decryptInputType');
  const decryptInput = $('decryptCiphertextInput');
  const segButtons = document.querySelectorAll('.segmented [data-format]');

  function setFormat(fmt) {
    decryptInputType.value = fmt;
    segButtons.forEach((b) => b.classList.toggle('active', b.dataset.format === fmt));
    $('decryptPassphraseGroup').hidden = fmt !== 'aes';
    decryptInput.placeholder = fmt === 'binary' ? 'Paste 0s and 1s (64 bits per character)'
      : fmt === 'aes' ? 'Paste the AES-128 hex output' : 'Paste the Ge\'ez cipher hex';
  }
  segButtons.forEach((b) => b.addEventListener('click', () => { setFormat(b.dataset.format); performDecryption(); }));

  function setStatus(text, kind) {
    const el = $('outputDecryptStatus');
    el.textContent = text;
    el.className = 'status' + (kind ? ' ' + kind : '');
  }

  async function performDecryption() {
    const fmt = decryptInputType.value;
    const raw = decryptInput.value.trim();
    const out = $('outputDecryptedResult');
    $('decryptTiles').innerHTML = '';
    out.classList.remove('fail');
    if (!raw) {
      out.textContent = '–';
      setStatus('Paste ciphertext, or use the latest encryption.');
      return;
    }
    try {
      let binary = '';
      if (fmt === 'hex') binary = engine.hexToBinary(raw);
      else if (fmt === 'binary') binary = raw.replace(/[^01]/g, '');
      else {
        const res = await engine.decryptAES128(raw, $('decryptPassphrase').value || 'GEEZ_SECRET_KEY');
        if (res.error) {
          out.textContent = 'Could not decrypt';
          out.classList.add('fail');
          setStatus('The AES layer did not open. Check that the passphrase matches the one used to encrypt.', 'err');
          return;
        }
        binary = res.binaryData;
      }
      const blocks = engine.binaryToBlocks(binary);
      if (!blocks.length) {
        out.textContent = 'No complete blocks';
        out.classList.add('fail');
        setStatus('Each character needs 64 bits (16 hex digits). The input is too short or not in the selected format.', 'err');
        return;
      }
      const text = engine.decryptTextFromBlocks(blocks);
      out.textContent = text;
      $('decryptTiles').innerHTML = blocks.map((b, i) => tileHtml(b, text[i] || '?', false)).join('');
      const leftover = binary.length % 64;
      const label = fmt === 'aes' ? 'AES-128 CBC, then Ge\'ez blocks' : fmt === 'binary' ? 'Ge\'ez binary blocks' : 'Ge\'ez hex blocks';
      setStatus(`Decoded ${blocks.length} block${blocks.length === 1 ? '' : 's'} from ${label}.${leftover ? ` Ignored ${leftover} trailing bits.` : ''}`, 'ok');
    } catch (e) {
      out.textContent = 'Could not read input';
      out.classList.add('fail');
      setStatus('The input could not be parsed: ' + e.message, 'err');
    }
  }

  $('btnDecrypt').addEventListener('click', performDecryption);
  decryptInput.addEventListener('input', performDecryption);
  $('decryptPassphrase').addEventListener('input', performDecryption);

  function loadLatestIntoDecrypt() {
    if (!lastEncryption) return;
    const aesHex = $('outputAES').textContent.trim();
    if (enableAES.checked && /^[0-9A-F]+$/.test(aesHex)) {
      setFormat('aes');
      decryptInput.value = aesHex;
      $('decryptPassphrase').value = keyPassphrase.value;
    } else {
      setFormat('hex');
      decryptInput.value = lastEncryption.hex;
    }
    performDecryption();
  }
  $('btnUseLatest').addEventListener('click', loadLatestIntoDecrypt);
  $('btnSendToDecrypt').addEventListener('click', async () => {
    await performEncryption();
    loadLatestIntoDecrypt();
    showTab('decrypt-tab');
    window.scrollTo({ top: 0 });
  });

  // ---------- Character selection (shared) ----------
  function selectChar(ch) {
    selectedChar = ch;
    document.querySelectorAll('.char-chip').forEach((c) => c.classList.toggle('active', c.dataset.char === ch));
    document.querySelectorAll('#cipherTiles .tile').forEach((t) => t.classList.toggle('active', t.dataset.char === ch));
    renderVisualizer();
    renderEthiopicClasses();
    renderInspector();
  }

  function renderCharSelector() {
    const groups = [
      { label: 'Uppercase', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') },
      { label: 'Lowercase', chars: 'abcdefghijklmnopqrstuvwxyz'.split('') },
      { label: 'Digits and symbols', chars: '0123456789.,!?@#$%&*+-=_:;\'"/ '.split('') }
    ];
    $('charSelector').innerHTML = groups.map((g) => `
      <div class="char-group-section">
        <div class="char-group-label">${g.label}</div>
        <div class="char-group-chips">
          ${g.chars.map((ch) => `<button type="button" class="char-chip${ch === selectedChar ? ' active' : ''}" data-char="${escapeHtml(ch)}">${ch === ' ' ? 'Space' : escapeHtml(ch)}</button>`).join('')}
        </div>
      </div>`).join('');
  }
  $('charSelector').addEventListener('click', (e) => {
    const chip = e.target.closest('.char-chip');
    if (chip) selectChar(chip.dataset.char);
  });

  // ---------- 8x8 visualizer ----------
  function renderVisualizer() {
    $('selectedCharLabel').textContent = `Character '${selectedChar === ' ' ? 'space' : selectedChar}'`;
    const grid = $('matrixGrid');
    grid.innerHTML = '';
    const matrix = GEEZ_DATASET.getMatrixForChar(selectedChar);
    let activeBits = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        const isFlag = c < 2 || r === 7;
        const on = matrix[r][c] === 1;
        if (!isFlag && on) activeBits++;
        cell.className = 'grid-cell ' + (isFlag ? 'flag-cell' : on ? 'black-pixel' : 'white-pixel');
        cell.textContent = matrix[r][c];
        cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}: ${matrix[r][c]}${isFlag ? ' (flag bit)' : ''}`);
        if (isFlag) cell.disabled = true;
        cell.addEventListener('click', () => {
          if (isFlag) return;
          matrix[r][c] = matrix[r][c] === 1 ? 0 : 1;
          GEEZ_DATASET.cognitiveMaps[selectedChar] = matrix;
          renderVisualizer();
          performEncryption();
        });
        grid.appendChild(cell);
      }
    }

    const p = GEEZ_DATASET.getCharacterProfile(selectedChar);
    $('profileGlyph').textContent = p.isEthiopic ? p.char : (p.ethiopicGlyph && p.ethiopicGlyph !== '—' ? p.ethiopicGlyph : p.char);
    $('profileTitle').textContent = `${p.className} · ${p.classMeaning}`;
    $('profilePicto').textContent = p.pictoOrigin;
    $('profileOrder').textContent = p.orderName;
    $('profileVowel').textContent = p.vowelSound;
    $('profileDay').textContent = `${p.dayOfWeek} (${p.dayGeez})`;
    $('profileEquinox').textContent = p.equinoxDay ? `Day ${p.equinoxDay} of ${p.totalEquinoxDays}` : 'Not in the 182';
    $('profileNumerology').textContent = String(p.numerologyValue);
    $('profileActiveBits').textContent = `${activeBits} of 42`;
  }

  function renderEthiopicClasses() {
    const list = $('ethiopicClassList');
    const amh = GEEZ_DATASET.amharicClasses || [];
    const amhRows = amh.map((cls) => {
      const forms = [
        [cls.geez, 1, "Ge'ez"], [cls.kaeb, 2, "Ka'eb"], [cls.salis, 3, 'Salis'], [cls.rabe, 4, "Rab'e"],
        [cls.hamis, 5, 'Hamis'], [cls.sadis, 6, 'Sadis'], [cls.sabe, 7, "Sab'e"]
      ].filter((f) => activeOrderFilter === 0 || f[1] === activeOrderFilter);
      return `<div class="class-list-entry">
        <div class="fidel-info">
          <span class="fidel-name">${escapeHtml(cls.name)}</span>
          <span class="fidel-meaning">from <span class="ge">${cls.from}</span></span>
        </div>
        <div class="fidel-chars-badge">
          ${forms.map(([ch, o, n]) => `<button type="button" class="fidel-char-pill${selectedChar === ch ? ' active' : ''}" data-char="${ch}" title="${escapeHtml(cls.name)}, order ${o} (${n})">${ch}</button>`).join('')}
        </div>
      </div>`;
    }).join('');
    list.innerHTML = GEEZ_DATASET.ethiopianClasses.map((cls) => {
      const forms = [
        [cls.geez, 1, "Ge'ez"], [cls.kaeb, 2, "Ka'eb"], [cls.salis, 3, 'Salis'], [cls.rabe, 4, "Rab'e"],
        [cls.hamis, 5, 'Hamis'], [cls.sadis, 6, 'Sadis'], [cls.sabe, 7, "Sab'e"]
      ].filter((f) => activeOrderFilter === 0 || f[1] === activeOrderFilter);
      return `<div class="class-list-entry">
        <div class="fidel-info">
          <span class="fidel-name">${escapeHtml(cls.name)}</span>
          <span class="fidel-meaning">${escapeHtml(cls.meaning)}</span>
          <span class="fidel-base-num">value ${cls.baseValue}</span>
        </div>
        <div class="fidel-chars-badge">
          ${forms.map(([ch, o, n]) => `<button type="button" class="fidel-char-pill${selectedChar === ch ? ' active' : ''}" data-char="${ch}" title="${escapeHtml(cls.name)}, order ${o} (${n})">${ch}</button>`).join('')}
        </div>
      </div>`;
    }).join('') + (amhRows ? `<div class="class-list-sub">Amharic additions <span>not among the 26 Ge'ez classes</span></div>` + amhRows : '');
  }
  $('ethiopicClassList').addEventListener('click', (e) => {
    const pill = e.target.closest('.fidel-char-pill');
    if (pill) selectChar(pill.dataset.char);
  });
  document.querySelectorAll('.order-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeOrderFilter = parseInt(btn.dataset.order, 10);
      renderEthiopicClasses();
    });
  });

  // ---------- Inspector ----------
  const stepDots = $('stepDots');
  stepDots.innerHTML = Array.from({ length: 8 }, (_, i) => `<button type="button" class="step-dot" data-step="${i + 1}" aria-label="Go to step ${i + 1}">${i + 1}</button>`).join('');
  stepDots.addEventListener('click', (e) => {
    const d = e.target.closest('.step-dot');
    if (!d) return;
    inspectorStep = parseInt(d.dataset.step, 10);
    renderInspector();
  });

  function renderInspector() {
    const label = selectedChar === ' ' ? 'space' : selectedChar;
    $('inspectorCharBadge').textContent = `Inspecting '${label}'`;
    const res = engine.encryptCharacter(selectedChar);

    $('inspectorTableBody').innerHTML = res.traces.map((t) => {
      const cls = t.recursionStep === inspectorStep ? 'active-step' : (t.recursionStep > inspectorStep ? 'future' : '');
      return `<tr class="${cls}" data-step="${t.recursionStep}">
        <td><strong>tr${t.recursionStep}</strong></td>
        <td>${t.inputVector.join('')}</td>
        <td>${t.weightVector.join('')}</td>
        <td>${t.biasVector.map((b) => (b > 0 ? '+1' : '−1')).join(' ')}</td>
        <td>${t.vVector.map((v) => (v > 0 ? '+' + v : String(v).replace('-', '−'))).join(' ')}</td>
        <td class="out">${t.outputVector.join('')}</td>
      </tr>`;
    }).join('');

    $('currentStepLabel').textContent = `Step tr${inspectorStep} of 8`;
    stepDots.querySelectorAll('.step-dot').forEach((d) => {
      const s = parseInt(d.dataset.step, 10);
      d.classList.toggle('active', s === inspectorStep);
      d.classList.toggle('done', s < inspectorStep);
    });

    // Block build-up
    let cells = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r < inspectorStep) {
          const on = res.block64[r][c] === 1;
          cells += `<i class="${on ? 'on' : ''}${r === inspectorStep - 1 ? ' current' : ''}"></i>`;
        } else {
          cells += '<i class="pending"></i>';
        }
      }
    }
    $('buildGrid').innerHTML = cells;
    $('buildHint').textContent = inspectorStep === 8 ? 'All 8 rows written: 64-bit block complete' : inspectorStep === 1 ? 'Row 1 written' : `Rows 1–${inspectorStep} written`;

    renderNNVisualizer(res.traces);
  }
  $('inspectorTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-step]');
    if (!row) return;
    inspectorStep = parseInt(row.dataset.step, 10);
    renderInspector();
  });

  $('btnPrevStep').addEventListener('click', () => { if (inspectorStep > 1) { inspectorStep--; renderInspector(); } });
  $('btnNextStep').addEventListener('click', () => { if (inspectorStep < 8) { inspectorStep++; renderInspector(); } });
  $('btnPlayStep').addEventListener('click', () => {
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
      $('btnPlayStep').textContent = 'Play';
    } else {
      $('btnPlayStep').textContent = 'Pause';
      playInterval = setInterval(() => {
        inspectorStep = (inspectorStep % 8) + 1;
        renderInspector();
      }, 1200);
    }
  });

  // ---------- Neuron connection canvas (thesis §4.2) ----------
  function drawArrow(ctx, x1, y1, x2, y2, r1, r2, color, width, headLen) {
    const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy);
    if (dist <= r1 + r2) return;
    const ux = dx / dist, uy = dy / dist;
    const sx = x1 + ux * r1, sy = y1 + uy * r1, ex = x2 - ux * r2, ey = y2 - uy * r2;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey);
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
    const a = Math.atan2(dy, dx);
    ctx.beginPath(); ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLen * Math.cos(a - Math.PI / 6), ey - headLen * Math.sin(a - Math.PI / 6));
    ctx.lineTo(ex - headLen * Math.cos(a + Math.PI / 6), ey - headLen * Math.sin(a + Math.PI / 6));
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }

  function drawNode(ctx, T, x, y, r, label, kind, mini) {
    // kind: 'key' (active input node), 'on' (bit 1), 'off'
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = kind === 'key' ? T.rubric : kind === 'on' ? T.ok : T.surface;
    ctx.fill();
    ctx.lineWidth = mini ? 1 : 1.5;
    ctx.strokeStyle = kind === 'key' ? T.rubric : kind === 'on' ? T.ok : T.line;
    ctx.stroke();
    if (label !== '' && label !== undefined && label !== null) {
      ctx.fillStyle = kind === 'off' ? T.muted : T.surface;
      ctx.font = `600 ${r >= 10 ? 10 : (r >= 6 ? 7.5 : 6)}px ${T.mono}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(label), x, y + 0.5);
    }
  }

  function drawThesisNNCanvas(canvas, trace, stepIdx, mini) {
    const T = tokens();
    const cw = Math.round(canvas.clientWidth || canvas.parentElement.clientWidth || 600);
    const W = mini ? 260 : Math.max(320, Math.min(cw, 900)), H = mini ? 165 : Math.round(Math.max(260, Math.min(W * 0.5, 380)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);

    const N = 8;
    const x1 = W * 0.09, x2 = W * 0.29, x3 = W * 0.50, x4 = W * 0.71, x5 = W * 0.91;
    const yTop = mini ? 18 : 46, yBottom = mini ? H - 26 : H - 52;
    const yMid = (yTop + yBottom) / 2, sp = (yBottom - yTop) / (N - 1);
    const r = mini ? 5.5 : 11.5, rS = mini ? 7.5 : 15;
    const head = mini ? 3.5 : 6;
    const inVec = trace ? trace.inputVector : Array(8).fill(0);
    const outVec = trace ? trace.outputVector : Array(8).fill(0);
    const ys = Array.from({ length: N }, (_, i) => yTop + i * sp);

    // Feedback rail
    const railY = H - (mini ? 8 : 16), railX = x1 - (mini ? 12 : 24);
    ctx.beginPath();
    ctx.moveTo(x5, yMid + rS); ctx.lineTo(x5, railY); ctx.lineTo(railX, railY); ctx.lineTo(railX, yMid); ctx.lineTo(x1 - rS, yMid);
    ctx.strokeStyle = T.muted; ctx.lineWidth = mini ? 1 : 1.5; ctx.setLineDash(mini ? [3, 3] : [5, 4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1 - rS, yMid); ctx.lineTo(x1 - rS - head, yMid - head * 0.6); ctx.lineTo(x1 - rS - head, yMid + head * 0.6); ctx.closePath();
    ctx.fillStyle = T.muted; ctx.fill();
    if (!mini) {
      ctx.fillStyle = T.muted; ctx.font = `500 10px ${T.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('feedback  X[tr+1] = A[tr]', W / 2, railY - 4);
    }

    // Col1 -> Col2
    for (let i = 0; i < N; i++) {
      const k = i === stepIdx;
      drawArrow(ctx, x1, yMid, x2, ys[i], rS, r, k ? T.rubric : alpha(T.muted, 0.35), k ? (mini ? 1.4 : 2.2) : (mini ? 0.6 : 1), head);
    }
    // Col2 (node k) -> Col3
    for (let j = 0; j < N; j++) {
      const on = outVec[j] === 1;
      drawArrow(ctx, x2, ys[stepIdx], x3, ys[j], r, r, on ? T.rubric : alpha(T.rubric, 0.3), on ? (mini ? 1.3 : 2) : (mini ? 0.6 : 1), head);
    }
    // Col3 -> Col4
    for (let i = 0; i < N; i++) {
      const on = outVec[i] === 1;
      drawArrow(ctx, x3, ys[i], x4, ys[i], r, r, on ? T.ochre : alpha(T.ochre, 0.3), on ? (mini ? 1.2 : 2) : (mini ? 0.6 : 1), head);
    }
    // Col4 -> Col5
    for (let i = 0; i < N; i++) {
      const on = outVec[i] === 1;
      drawArrow(ctx, x4, ys[i], x5, yMid, r, rS, on ? T.ok : alpha(T.muted, 0.3), on ? (mini ? 1.2 : 2) : (mini ? 0.6 : 1), head);
    }

    drawNode(ctx, T, x1, yMid, rS, mini ? '' : 'X', 'off', mini);
    for (let i = 0; i < N; i++) drawNode(ctx, T, x2, ys[i], r, mini ? '' : inVec[i], i === stepIdx ? 'key' : 'off', mini);
    for (let i = 0; i < N; i++) drawNode(ctx, T, x3, ys[i], r, '', outVec[i] === 1 ? 'on' : 'off', mini);
    for (let i = 0; i < N; i++) drawNode(ctx, T, x4, ys[i], r, mini ? '' : outVec[i], outVec[i] === 1 ? 'on' : 'off', mini);
    drawNode(ctx, T, x5, yMid, rS, mini ? '' : 'A', outVec.some((v) => v === 1) ? 'on' : 'off', mini);

    if (!mini) {
      ctx.fillStyle = T.muted; ctx.font = `600 10px ${T.ui}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      [['Input', x1], ['Input bits', x2], ['Hidden', x3], ['Output bits', x4], ['Row out', x5]].forEach(([t, x]) => ctx.fillText(t.toUpperCase(), x, yTop - 22));
    }
  }

  function renderNNVisualizer(traces) {
    if (!traces || traces.length < 8) return;
    const idx = inspectorStep - 1;
    $('nnActiveBadge').textContent = `tr${inspectorStep}`;
    $('descLeft').textContent = `Step tr${inspectorStep}: input node ${inspectorStep} fires and fans out to all 8 hidden nodes`;
    drawThesisNNCanvas($('canvasLeft'), traces[idx], idx, false);
    renderGalleryGrid(traces);
  }

  function rowStrip(bits) {
    return `<span class="bit-strip">${bits.map((b) => `<i class="${b ? 'on' : ''}"></i>`).join('')}</span>`;
  }

  function renderGalleryGrid(traces) {
    const grid = $('nnGalleryGrid');
    $('galleryCharBadge').textContent = `'${selectedChar === ' ' ? 'space' : selectedChar}'`;
    grid.innerHTML = '';
    for (let s = 0; s < 8; s++) {
      const t = traces[s];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `gallery-card${inspectorStep === s + 1 ? ' gallery-card-active' : ''}`;
      card.setAttribute('aria-label', `Recursion tr${s + 1}: input ${t.inputVector.join('')}, output ${t.outputVector.join('')}`);
      card.innerHTML = `<div class="gallery-card-header"><span>Recursion tr${s + 1}</span><span>writes row ${s + 1}</span></div>`;
      const c = document.createElement('canvas');
      card.appendChild(c);
      const foot = document.createElement('div');
      foot.className = 'gallery-card-foot';
      foot.innerHTML = `<span><em>X</em> ${t.inputVector.join('')}</span><span class="arrow">→</span><span><em>A</em> ${t.outputVector.join('')}</span>${rowStrip(t.outputVector)}`;
      card.appendChild(foot);
      card.addEventListener('click', () => { inspectorStep = s + 1; renderInspector(); });
      grid.appendChild(card);
      drawThesisNNCanvas(c, t, s, false);
    }
  }

  // ---------- Numeric wheel ----------
  const WHEEL = 560;
  function renderNumerologyWheel() {
    const canvas = $('archNumerologyWheelCanvas');
    if (!canvas) return;
    const T = tokens();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    if (canvas.width !== Math.round(WHEEL * dpr)) { canvas.width = Math.round(WHEEL * dpr); canvas.height = Math.round(WHEEL * dpr); }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = WHEEL, cx = w / 2, cy = w / 2;
    const bandR = w * 0.475, outerR = w * 0.385, innerR = w * 0.115;
    const step = (Math.PI * 2) / 26, ringW = (outerR - innerR) / 7;

    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = T.bg;
    ctx.beginPath(); ctx.arc(cx, cy, bandR + 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = T.line; ctx.lineWidth = 1.5; ctx.stroke();

    // Alphabet band fill
    ctx.fillStyle = T.surface;
    ctx.beginPath(); ctx.arc(cx, cy, bandR, 0, Math.PI * 2); ctx.arc(cx, cy, outerR, 0, Math.PI * 2, true); ctx.fill();

    for (let r = 1; r <= 7; r++) {
      ctx.strokeStyle = r === 7 ? T.ink : T.line;
      ctx.lineWidth = r === 7 ? 1.2 : 0.8;
      ctx.beginPath(); ctx.arc(cx, cy, innerR + ringW * r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.strokeStyle = T.ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, bandR, 0, Math.PI * 2); ctx.stroke();

    // Hub
    ctx.fillStyle = T.rubric;
    ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = T.surface; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 13px ${T.mono}`; ctx.fillText('182', cx, cy - 7);
    ctx.font = `600 9px ${T.ui}`; ctx.fillText('DAYS', cx, cy + 9);

    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    GEEZ_DATASET.ethiopianClasses.forEach((cls, i) => {
      const a = i * step - Math.PI / 2, mid = a + step / 2;
      const hi = i === highlightedSpokeIdx;
      if (hi) {
        ctx.fillStyle = alpha(T.rubric, 0.14);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, bandR, a, a + step); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = hi ? T.rubric : T.line; ctx.lineWidth = hi ? 1.6 : 0.8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
      ctx.lineTo(cx + Math.cos(a) * bandR, cy + Math.sin(a) * bandR);
      ctx.stroke();

      const left = mid > Math.PI / 2 || mid < -Math.PI / 2;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(mid);
      for (let o = 1; o <= 7; o++) {
        const val = String(cls.baseValue * o);
        ctx.save(); ctx.translate(innerR + ringW * (o - 0.5), 0); if (left) ctx.rotate(Math.PI);
        const fs = val.length >= 4 ? 8 : val.length === 3 ? 8.5 : 9.5;
        ctx.font = `${hi ? 700 : 400} ${fs}px ${T.mono}`;
        ctx.fillStyle = hi ? T.rubric : (o === 1 ? T.ink : T.muted);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(val, 0, 0);
        ctx.restore();
      }
      ctx.save(); ctx.translate(outerR + (bandR - outerR) / 2, 0); if (left) ctx.rotate(Math.PI);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = hi ? T.rubric : T.ink;
      ctx.font = `700 ${hi ? 20 : 18}px ${T.ethiopic}`;
      ctx.fillText(cls.geez, 0, -4);
      ctx.fillStyle = hi ? T.rubric : T.muted;
      ctx.font = `600 9px ${T.mono}`;
      ctx.fillText(latin[i], 0, 11);
      ctx.restore();
      ctx.restore();
    });
  }

  function wheelIdxFromEvent(e) {
    const canvas = $('archNumerologyWheelCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (WHEEL / rect.width) - WHEEL / 2;
    const y = (e.clientY - rect.top) * (WHEEL / rect.height) - WHEEL / 2;
    const d = Math.hypot(x, y);
    if (d < WHEEL * 0.11 || d > WHEEL * 0.48) return -1;
    let a = Math.atan2(y, x) + Math.PI / 2;
    if (a < 0) a += Math.PI * 2;
    return Math.floor(a / ((Math.PI * 2) / 26)) % 26;
  }
  const WHEEL_IDLE = 'Hover over a spoke to see its seven values. Click to open it in the 8×8 map.';
  function updateWheelCard(idx) {
    const box = $('archWhDetails');
    if (idx < 0) { box.textContent = WHEEL_IDLE; return; }
    const cls = GEEZ_DATASET.ethiopianClasses[idx];
    const start = idx * 7 + 1;
    box.innerHTML = `
      <div class="wh-head">${cls.geez} · ${escapeHtml(cls.name)} <span class="mono" style="font-size:12px;color:var(--muted)">[${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[idx]}]</span></div>
      <div class="hint">${escapeHtml(cls.meaning)} · base value ${cls.baseValue} · equinox days ${start}–${start + 6}</div>
      <div class="wheel-numbers-strip">${[1, 2, 3, 4, 5, 6, 7].map((o) => `<span class="wheel-order-pill"><strong>${o}</strong> ${cls.baseValue * o}</span>`).join('')}</div>`;
  }
  (function setupWheel() {
    const canvas = $('archNumerologyWheelCanvas');
    canvas.addEventListener('mousemove', (e) => {
      const idx = wheelIdxFromEvent(e);
      if (idx !== highlightedSpokeIdx) { highlightedSpokeIdx = idx; renderNumerologyWheel(); updateWheelCard(idx); }
    });
    canvas.addEventListener('mouseleave', () => { highlightedSpokeIdx = -1; renderNumerologyWheel(); updateWheelCard(-1); });
    canvas.addEventListener('click', (e) => {
      const idx = wheelIdxFromEvent(e);
      if (idx < 0) return;
      selectChar(GEEZ_DATASET.ethiopianClasses[idx].geez);
      showTab('visualizer-tab');
      window.scrollTo({ top: 0 });
    });
  })();

  // ---------- Tree (Figure 1.2) ----------
  function renderGeezTree() {
    const svg = $('geezTreeSvg');
    const clusters = [
      ['ሀ', 'Hoi', 80, ['ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ']],
      ['ለ', 'Lawi', 205, ['ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ']],
      ['ሐ', 'Haut', 330, ['ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ']],
      ['መ', 'Mai', 460, ['ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ']],
      ['ሠ', 'Saut', 590, ['ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ']],
      ['ረ', 'Rees', 715, ['ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ']],
      ['ሰ', 'Sat', 840, ['ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ']]
    ];
    const rootX = 460, rootY = 82, sY = 200;
    let h = `
      <text x="${rootX}" y="30" text-anchor="middle" class="ge" font-size="18" font-weight="700">ኑባሬ ፊደል</text>
      <text x="${rootX}" y="50" text-anchor="middle" class="t-muted" font-size="12" font-weight="600" letter-spacing="1">NUBARE FIDEL · ROOT</text>
      <text x="20" y="${sY - 4}" font-size="16" font-weight="700" class="ge">ስርወ ፊደል</text>
      <text x="20" y="${sY + 14}" class="t-muted" font-size="11" font-weight="600" letter-spacing="1">SIRIW FIDEL</text>
      <text x="${rootX}" y="448" text-anchor="middle" font-size="17" font-weight="700" class="ge">ሠራዊተ ፊደል</text>
      <text x="${rootX}" y="466" text-anchor="middle" class="t-muted" font-size="11" font-weight="600" letter-spacing="1">SERAWITE FIDEL · DERIVED FORMS</text>`;
    clusters.forEach(([root, name, x, leaves]) => {
      h += `<g class="cluster"><title>${root} (${name}) and its six derived forms</title>`;
      h += `<line class="root-branch" x1="${rootX}" y1="${rootY}" x2="${x}" y2="${sY + 40}" stroke-width="1.6"/>`;
      leaves.forEach((f, i) => {
        const lx = x - 45 + i * 18, ly = 352 + (i % 2 ? 26 : 0);
        h += `<line class="branch" x1="${x}" y1="${sY + 88}" x2="${lx}" y2="${ly}" stroke-width="1.2"/>`;
        h += `<circle class="leaf" cx="${lx}" cy="${ly}" r="6" stroke-width="1.2"/>`;
        h += `<text x="${lx}" y="${ly + (i % 2 ? 22 : -11)}" text-anchor="middle" font-size="12" class="ge">${f}</text>`;
      });
      h += `<circle class="siriw" cx="${x}" cy="${sY + 40}" r="17" stroke-width="3"/>`;
      h += `<text x="${x}" y="${sY + 46}" text-anchor="middle" font-size="17" font-weight="700" class="ge" style="fill: var(--surface)">${root}</text>`;
      h += `<text x="${x}" y="${sY + 76}" text-anchor="middle" class="t-muted" font-size="11" font-weight="600">${name}</text>`;
      h += `</g>`;
    });
    h += `<circle class="root" cx="${rootX}" cy="${rootY}" r="13" stroke-width="3"><title>Nubare Fidel, the root of Ge'ez</title></circle>`;
    svg.innerHTML = h;
  }

  // ---------- Static data tables ----------
  function renderDataTables() {
    const D = GEEZ_DATASET;
    if (D.syllographicHomophones) {
      $('archHomophoneTable').innerHTML = D.syllographicHomophones.map((it) => `
        <tr>
          <td class="glyph-cell" style="color: var(--rubric)">${it.geez}</td>
          <td class="ge">${it.amharic}</td>
          <td><strong>${escapeHtml(it.english)}</strong></td>
          <td class="muted">${escapeHtml(it.optionalMeaning || '—')}</td>
          <td class="ge" style="white-space:nowrap">${it.pair}</td>
        </tr>`).join('');
    }
    if (D.syllographMeanings) {
      $('syllographMeaningsTable').innerHTML = D.syllographMeanings.map((it) => `
        <tr>
          <td class="code-tag">${escapeHtml(it.latin)}</td>
          <td class="glyph-old">${it.proto}</td>
          <td class="glyph-old">${it.protoEthiopic}</td>
          <td class="glyph-cell">${it.classical}</td>
          <td><strong>${escapeHtml(it.name)}</strong></td>
          <td class="muted">${escapeHtml(it.description)}</td>
        </tr>`).join('');
    }
    if (D.ethiopicEvolution) {
      $('ethiopicEvolutionTable').innerHTML = D.ethiopicEvolution.map((it) => {
        const pp = it.protoEthiopic.split(' ');
        const picto = it.pictograph.replace(/^\S+\s/, '');
        return `<tr>
          <td>${escapeHtml(picto)}</td>
          <td><span class="glyph-old">${pp[0]}</span>${pp.length > 1 ? `<span class="sub">${escapeHtml(pp.slice(1).join(' '))}</span>` : ''}</td>
          <td class="glyph-cell">${it.ethiopic}</td>
          <td class="mono">${escapeHtml(it.transcription)}</td>
          <td><strong>${escapeHtml(it.name)}</strong></td>
          <td class="muted">${escapeHtml(it.meaning)}</td>
        </tr>`;
      }).join('');
    }
    if (D.comparativeAfricanSystems) {
      const split = (s) => { const p = String(s || '').split(' '); return [p[0] || '—', p.slice(1).join(' ')]; };
      $('comparativeSystemsTable').innerHTML = D.comparativeAfricanSystems.map((it) => {
        const [eg, egSub] = split(it.egyptian);
        const [pe, peSub] = split(it.protoEthiopic);
        return `<tr>
          <td class="code-tag">${escapeHtml(it.phoneme)}</td>
          <td><span class="glyph-old">${eg}</span>${egSub ? `<span class="sub">${escapeHtml(egSub)}</span>` : ''}</td>
          <td class="glyph-old">${it.meroitic || '—'}</td>
          <td class="glyph-old">${it.sinaitic || '—'}</td>
          <td class="glyph-old">${it.cretanLinear || '—'}</td>
          <td class="glyph-old">${it.meroiticLinear || '—'}</td>
          <td><span class="glyph-old">${pe}</span>${peSub ? `<span class="sub">${escapeHtml(peSub)}</span>` : ''}</td>
          <td class="glyph-cell">${it.ethiopic}</td>
          <td class="muted">${escapeHtml(it.notes)}</td>
        </tr>`;
      }).join('');
    }
  }

  // ---------- Re-draw canvases on theme or size change ----------
  function redrawGraphics() {
    if ($('inspector-tab').classList.contains('active')) renderInspector();
    if ($('architecture-tab').classList.contains('active')) renderNumerologyWheel();
  }
  try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawGraphics); } catch (e) { /* older browsers */ }
  new MutationObserver(redrawGraphics).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(redrawGraphics, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redrawGraphics);

  // ---------- Init ----------
  setFormat('hex');
  renderCharSelector();
  renderEthiopicClasses();
  renderVisualizer();
  renderDataTables();
  renderGeezTree();
  performEncryption();
  routeFromHash();
  moveDock(true);
});
