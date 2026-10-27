/**
 * Ge'ez RNN Cipher Application Logic & Event Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  const cipherEngine = new GeezRNNCipher();

  // State Variables
  let selectedChar = 'A';
  let currentEncryptionResult = null;
  let inspectorStep = 1;
  let playInterval = null;

  // DOM Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Encryption Tab Controls
  const inputText = document.getElementById('inputText');
  const keyPassphrase = document.getElementById('keyPassphrase');
  const enableAES = document.getElementById('enableAES');
  const btnEncrypt = document.getElementById('btnEncrypt');

  const outputBinary = document.getElementById('outputBinary');
  const outputHex = document.getElementById('outputHex');
  const outputAES = document.getElementById('outputAES');

  // Decryption Tab Controls
  const decryptInputType = document.getElementById('decryptInputType');
  const decryptCiphertextInput = document.getElementById('decryptCiphertextInput');
  const decryptPassphraseGroup = document.getElementById('decryptPassphraseGroup');
  const decryptPassphrase = document.getElementById('decryptPassphrase');
  const btnDecrypt = document.getElementById('btnDecrypt');

  const outputDecryptedResult = document.getElementById('outputDecryptedResult');
  const outputDecryptStatus = document.getElementById('outputDecryptStatus');

  // Visualizer Tab Controls
  const matrixGrid = document.getElementById('matrixGrid');
  const selectedCharLabel = document.getElementById('selectedCharLabel');
  const charSelector = document.getElementById('charSelector');
  const ethiopicClassList = document.getElementById('ethiopicClassList');

  // Inspector Tab Controls
  const inspectorTableBody = document.getElementById('inspectorTableBody');
  const currentStepLabel = document.getElementById('currentStepLabel');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnPlayStep = document.getElementById('btnPlayStep');
  const btnNextStep = document.getElementById('btnNextStep');
  const inspectorCharBadge = document.getElementById('inspectorCharBadge');

  // Neural Network Visualizer Controls (Thesis §4.2)
  const nnActiveBadge = document.getElementById('nnActiveBadge');
  const btnToggleAllPairs = document.getElementById('btnToggleAllPairs');
  const nnAllPairsGallery = document.getElementById('nnAllPairsGallery');
  const nnGalleryGrid = document.getElementById('nnGalleryGrid');

  const canvasLeft = document.getElementById('canvasLeft');
  const paneLeft = document.getElementById('paneLeft');
  const titleLeft = document.getElementById('titleLeft');
  const descLeft = document.getElementById('descLeft');

  let showAllSteps = false;

  // --- 1. Tab Switch Logic ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      if (targetTab === 'visualizer-tab') renderVisualizer();
      if (targetTab === 'inspector-tab') renderInspector();
      if (targetTab === 'architecture-tab') renderArchitectureTab();
      if (targetTab === 'infographics-tab') renderInfographicsTab();
    });
  });

  // --- 2. Encryption Execution ---
  async function performEncryption() {
    const text = inputText.value || 'HELLOGEEZ';
    const result = cipherEngine.encryptText(text);
    currentEncryptionResult = result;

    outputBinary.textContent = result.fullBinary.match(/.{1,8}/g).join(' ');
    outputHex.textContent = result.hex;

    // Default pre-fill decrypt tab with generated Hex
    if (!decryptCiphertextInput.value) {
      decryptCiphertextInput.value = result.hex;
    }

    // AES-128 Hybrid Integration
    if (enableAES.checked && window.crypto && window.crypto.subtle) {
      const aesResult = await cipherEngine.encryptAES128(result.fullBinary, keyPassphrase.value);
      outputAES.textContent = aesResult.ciphertextHex;
    } else {
      outputAES.textContent = "AES Disabled / Not Active";
    }

    renderInspector();
  }

  btnEncrypt.addEventListener('click', performEncryption);
  inputText.addEventListener('input', performEncryption);
  enableAES.addEventListener('change', performEncryption);
  keyPassphrase.addEventListener('input', performEncryption);

  // --- 3. Standalone Decryption Execution ---
  decryptInputType.addEventListener('change', () => {
    if (decryptInputType.value === 'aes') {
      decryptPassphraseGroup.style.display = 'block';
    } else {
      decryptPassphraseGroup.style.display = 'none';
    }
  });

  async function performDecryption() {
    const format = decryptInputType.value;
    const rawInput = decryptCiphertextInput.value.trim();

    if (!rawInput) {
      outputDecryptedResult.textContent = '-';
      outputDecryptStatus.textContent = 'Please enter or paste ciphertext data.';
      return;
    }

    try {
      let recoveredText = '';

      if (format === 'hex') {
        recoveredText = cipherEngine.decryptTextFromHex(rawInput);
        outputDecryptStatus.textContent = 'Successfully decrypted from Ge\'ez RNN Hex string.';
      } else if (format === 'binary') {
        recoveredText = cipherEngine.decryptTextFromBinary(rawInput);
        outputDecryptStatus.textContent = 'Successfully decrypted from Ge\'ez 64-bit binary stream.';
      } else if (format === 'aes') {
        const pass = decryptPassphrase.value || 'GEEZ_SECRET_KEY';
        const aesRes = await cipherEngine.decryptAES128(rawInput, pass);
        if (aesRes.error) {
          outputDecryptedResult.textContent = 'DECRYPTION FAILED';
          outputDecryptStatus.textContent = 'Error: ' + aesRes.error;
          return;
        }
        recoveredText = cipherEngine.decryptTextFromBinary(aesRes.binaryData);
        outputDecryptStatus.textContent = 'Successfully decrypted through AES-128 CBC + Ge\'ez RNN pipeline.';
      }

      outputDecryptedResult.textContent = recoveredText || 'Unrecognized Pattern';
    } catch (e) {
      outputDecryptedResult.textContent = 'DECRYPTION ERROR';
      outputDecryptStatus.textContent = 'Failed to parse ciphertext: ' + e.message;
    }
  }

  btnDecrypt.addEventListener('click', performDecryption);
  decryptCiphertextInput.addEventListener('input', performDecryption);

  // --- 4. 8x8 Grid Visualizer Logic ---
  function renderCharSelector() {
    charSelector.innerHTML = '';
    const groups = [
      { label: 'Uppercase (A–Z)', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') },
      { label: 'Lowercase (a–z)', chars: 'abcdefghijklmnopqrstuvwxyz'.split('') },
      { label: 'Numbers & Symbols', chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '!', '?', '@', '#', '$', '%', '&', '*', '+', '-', '=', '_', ':', ';', "'", '"', '/', ' '] }
    ];

    groups.forEach(group => {
      const section = document.createElement('div');
      section.className = 'char-group-section';
      section.innerHTML = `<div class="char-group-label">${group.label}</div>`;

      const chipContainer = document.createElement('div');
      chipContainer.className = 'char-group-chips';

      group.chars.forEach(char => {
        const chip = document.createElement('div');
        chip.className = `char-chip ${char === selectedChar ? 'active' : ''}`;
        chip.textContent = char === ' ' ? 'Space' : char;
        chip.title = `Select '${char === ' ' ? 'Space' : char}'`;
        chip.addEventListener('click', () => {
          selectedChar = char;
          document.querySelectorAll('.char-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          renderVisualizer();
          renderEthiopicClasses();
          renderInspector();
          performEncryption();
        });
        chipContainer.appendChild(chip);
      });

      section.appendChild(chipContainer);
      charSelector.appendChild(section);
    });
  }

  let activeOrderFilter = 0; // 0 = all, 1..7 for specific orders

  function renderVisualizer() {
    selectedCharLabel.textContent = `Character '${selectedChar}'`;
    matrixGrid.innerHTML = '';

    const matrix = GEEZ_DATASET.getMatrixForChar(selectedChar);
    let activeBits = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('div');
        const isFlag = (c === 0 || c === 1 || r === 7);
        const isBlack = matrix[r][c] === 1;
        if (!isFlag && isBlack) activeBits++;

        let cellClass = 'grid-cell ';
        if (isFlag) cellClass += 'flag-cell';
        else if (isBlack) cellClass += 'black-pixel';
        else cellClass += 'white-pixel';

        cell.className = cellClass;
        cell.textContent = matrix[r][c];

        // Click to toggle bit (interactive editing)
        cell.addEventListener('click', () => {
          if (!isFlag) {
            matrix[r][c] = matrix[r][c] === 1 ? 0 : 1;
            GEEZ_DATASET.cognitiveMaps[selectedChar] = matrix;
            renderVisualizer();
            performEncryption();
          }
        });

        matrixGrid.appendChild(cell);
      }
    }

    // Render Heritage & Astrographic Profile Card
    const profile = GEEZ_DATASET.getCharacterProfile(selectedChar);
    const profileGlyph = document.getElementById('profileGlyph');
    const profileTitle = document.getElementById('profileTitle');
    const profilePicto = document.getElementById('profilePicto');
    const profileOrder = document.getElementById('profileOrder');
    const profileVowel = document.getElementById('profileVowel');
    const profileDay = document.getElementById('profileDay');
    const profileEquinox = document.getElementById('profileEquinox');
    const profileNumerology = document.getElementById('profileNumerology');
    const profileActiveBits = document.getElementById('profileActiveBits');

    if (profileGlyph) {
      profileGlyph.textContent = profile.isEthiopic ? profile.char : (profile.ethiopicGlyph || profile.char);
      profileTitle.textContent = `${profile.className} (${profile.classMeaning})`;
      profilePicto.textContent = `Pictograph: ${profile.pictoOrigin}`;
      profileOrder.textContent = profile.orderName;
      profileVowel.textContent = profile.vowelSound;
      profileDay.textContent = `${profile.dayOfWeek} (${profile.dayGeez})`;
      profileEquinox.textContent = `Day ${profile.equinoxDay} of ${profile.totalEquinoxDays} (Equinox ${profile.equinoxDay <= 91 ? '1 / Season 1' : '1 / Season 2'})`;
      profileNumerology.textContent = `${profile.numerologyValue}`;
      profileActiveBits.textContent = `${activeBits} Active / 22 Flags`;
    }
  }

  function renderEthiopicClasses() {
    ethiopicClassList.innerHTML = '';

    GEEZ_DATASET.ethiopianClasses.forEach(cls => {
      const entry = document.createElement('div');
      entry.className = 'class-list-entry';

      const forms = [
        { char: cls.geez, order: 1, name: "Ge'ez" },
        { char: cls.kaeb, order: 2, name: "Ka'eb" },
        { char: cls.salis, order: 3, name: "Salis" },
        { char: cls.rabe, order: 4, name: "Rab'e" },
        { char: cls.hamis, order: 5, name: "Hamis" },
        { char: cls.sadis, order: 6, name: "Sadis" },
        { char: cls.sabe, order: 7, name: "Sab'e" }
      ];

      const visibleForms = activeOrderFilter === 0
        ? forms
        : forms.filter(f => f.order === activeOrderFilter);

      const fidelBadgesHtml = visibleForms.map(f => {
        const isActive = (selectedChar === f.char);
        return `<span class="fidel-char-pill ${isActive ? 'active' : ''}" data-char="${f.char}" title="${cls.name} (${f.name} - Order ${f.order})">${f.char}</span>`;
      }).join(' ');

      entry.innerHTML = `
        <div class="fidel-info">
          <span class="fidel-name">${cls.name}</span>
          <span class="fidel-meaning">(${cls.meaning})</span>
          <span class="fidel-base-num">Gematria: ${cls.baseValue}</span>
        </div>
        <div class="fidel-chars-badge">
          ${fidelBadgesHtml}
        </div>
      `;

      // Attach click events to each syllograph pill
      entry.querySelectorAll('.fidel-char-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const char = pill.getAttribute('data-char');
          selectedChar = char;
          document.querySelectorAll('.char-chip').forEach(c => c.classList.remove('active'));
          renderVisualizer();
          renderEthiopicClasses();
          renderInspector();
          performEncryption();
        });
      });

      ethiopicClassList.appendChild(entry);
    });

    // Wire order filter buttons
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeOrderFilter = parseInt(btn.getAttribute('data-order'), 10);
        renderEthiopicClasses();
      });
    });
  }

  // --- 5. 8-Recursion Inspector Logic ---
  function renderInspector() {
    inspectorCharBadge.textContent = `Inspecting '${selectedChar}'`;
    const charRes = cipherEngine.encryptCharacter(selectedChar);
    inspectorTableBody.innerHTML = '';

    charRes.traces.forEach(t => {
      const tr = document.createElement('tr');
      if (t.recursionStep === inspectorStep) tr.className = 'active-step';

      tr.innerHTML = `
        <td><strong>tr${t.recursionStep}</strong></td>
        <td>${t.inputVector.join('')}</td>
        <td>${t.weightVector.join('')}</td>
        <td>[${t.biasVector.join(', ')}]</td>
        <td>[${t.vVector.join(', ')}]</td>
        <td style="color: var(--accent-cyan); font-weight: bold;">${t.outputVector.join('')}</td>
        <td>Feedback &rarr; tr${t.recursionStep < 8 ? t.recursionStep + 1 : 'Done'}</td>
      `;
      inspectorTableBody.appendChild(tr);
    });

    currentStepLabel.textContent = `Step tr${inspectorStep} / tr8`;

    // Render neural network connection diagram for current step (Thesis §4.2)
    renderNNVisualizer(charRes.traces);
  }

  btnPrevStep.addEventListener('click', () => {
    if (inspectorStep > 1) {
      inspectorStep--;
      renderInspector();
    }
  });

  btnNextStep.addEventListener('click', () => {
    if (inspectorStep < 8) {
      inspectorStep++;
      renderInspector();
    }
  });

  btnPlayStep.addEventListener('click', () => {
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
      btnPlayStep.textContent = '▶ Auto Play';
    } else {
      btnPlayStep.textContent = '⏸ Pause';
      playInterval = setInterval(() => {
        inspectorStep = (inspectorStep % 8) + 1;
        renderInspector();
      }, 1200);
    }
  });

  // --- 6. Thesis §4.2 Connection of Neurons Drawing Engine ---

  /**
   * Helper: Draws a directed line with an arrowhead between two points, offset by node radii.
   */
  function drawArrow(ctx, x1, y1, x2, y2, r1, r2, color = '#64748b', width = 1.2, headLen = 6) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    if (dist <= r1 + r2) return;

    const ux = dx / dist;
    const uy = dy / dist;

    const startX = x1 + ux * r1;
    const startY = y1 + uy * r1;
    const endX = x2 - ux * r2;
    const endY = y2 - uy * r2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

    // Arrow head
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLen * Math.cos(angle - Math.PI / 6),
      endY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headLen * Math.cos(angle + Math.PI / 6),
      endY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  /**
   * Helper: Draws an individual circular neuron node with glow and optional label/bit.
   */
  function drawNode(ctx, x, y, r, label, isPeriodic, isActive, subLabel = '') {
    // Glow effect
    if (isPeriodic) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r + 9);
      g.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      g.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.beginPath();
      ctx.arc(x, y, r + 9, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    } else if (isActive) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r + 6);
      g.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
      g.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.beginPath();
      ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Node body
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (isPeriodic) {
      ctx.fillStyle = '#00f0ff';
    } else if (isActive) {
      ctx.fillStyle = '#10b981';
    } else {
      ctx.fillStyle = '#0a101d';
    }
    ctx.fill();

    // Node border
    ctx.lineWidth = isPeriodic ? 2.5 : 1.5;
    ctx.strokeStyle = isPeriodic ? '#00f0ff' : (isActive ? '#10b981' : '#334155');
    ctx.stroke();

    // Label / bit inside node
    if (label !== undefined && label !== null && label !== '') {
      ctx.fillStyle = (isPeriodic || isActive) ? '#020617' : '#94a3b8';
      ctx.font = `bold ${r >= 10 ? 9.5 : (r >= 6 ? 7.5 : 6)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }

    // Small sub-label outside
    if (subLabel && r >= 10) {
      ctx.fillStyle = '#475569';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(subLabel, x, y - r - 2);
    }
  }

  /**
   * Draws the EXACT Thesis §4.2 connection diagram (5 Columns):
   *   Col 1: 1 Input Node (center)
   *   Col 2: 8 Nodes (with Node k radiating to all 8 nodes of Col 3)
   *   Col 3: 8 Nodes (1-to-1 forward connection to Col 4)
   *   Col 4: 8 Nodes (converging to 1 Output Node)
   *   Col 5: 1 Output Node (center) + Feedback Loop to Col 1
   */
  function drawThesisNNCanvas(canvas, trace, stepIdx, isMini = false) {
    // Base logical resolution
    const W = isMini ? 260 : 540;
    const H = isMini ? 165 : 340;

    // Retina / Hi-DPI scaling factor
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.aspectRatio = `${W} / ${H}`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, W, H);

    const N = 8;
    const activeNodeIdx = stepIdx; // 0..7 for tr1..tr8

    // Proportional Column X coordinates
    const x1 = W * 0.09; // Col 1: Input (1 node)
    const x2 = W * 0.28; // Col 2: 8 Nodes (Fan-out)
    const x3 = W * 0.50; // Col 3: 8 Nodes (Hidden)
    const x4 = W * 0.72; // Col 4: 8 Nodes (Pre-output)
    const x5 = W * 0.91; // Col 5: Output (1 node)

    // Vertical spacing
    const yTop = isMini ? 18 : 38;
    const yBottom = isMini ? H - 24 : H - 48;
    const yMid = (yTop + yBottom) / 2;
    const sp = (yBottom - yTop) / (N - 1);
    const r = isMini ? 5.5 : 11.5;
    const rSingle = isMini ? 7.5 : 13.5;

    const inputVec = trace ? trace.inputVector : Array(8).fill(0);
    const outVec = trace ? trace.outputVector : Array(8).fill(0);

    // Compute Y positions for 8 nodes
    const col2Y = [];
    const col3Y = [];
    const col4Y = [];
    for (let i = 0; i < N; i++) {
      const y = yTop + i * sp;
      col2Y.push(y);
      col3Y.push(y);
      col4Y.push(y);
    }

    // ─────────────────────────────────────────────────────────────
    // 1. Draw Feedback Loop: Col 5 (Output) -> Bottom Rail -> Col 1 (Input)
    // ─────────────────────────────────────────────────────────────
    const railY = H - (isMini ? 8 : 14);
    const railXLeft = x1 - (isMini ? 12 : 22);

    ctx.beginPath();
    ctx.moveTo(x5, yMid + rSingle);
    ctx.lineTo(x5, railY);
    ctx.lineTo(railXLeft, railY);
    ctx.lineTo(railXLeft, yMid);
    ctx.lineTo(x1 - rSingle, yMid);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.85)';
    ctx.lineWidth = isMini ? 1.0 : 1.8;
    ctx.stroke();

    // Feedback Arrow pointing into Col 1
    const head = isMini ? 4 : 6.5;
    ctx.beginPath();
    ctx.moveTo(x1 - rSingle, yMid);
    ctx.lineTo(x1 - rSingle - head, yMid - head * 0.6);
    ctx.lineTo(x1 - rSingle - head, yMid + head * 0.6);
    ctx.closePath();
    ctx.fillStyle = '#3b82f6';
    ctx.fill();

    // Feedback label
    if (!isMini) {
      ctx.fillStyle = 'rgba(96, 165, 250, 0.9)';
      ctx.font = 'bold 8.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Feedback Loop: Output → Input (X[tr+1] = A[tr])', W / 2, railY - 3);
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Col 1 (1 Node) -> Col 2 (All 8 Nodes)
    // ─────────────────────────────────────────────────────────────
    for (let i = 0; i < N; i++) {
      const isPeriodicTarget = (i === activeNodeIdx);
      const arrowColor = isPeriodicTarget ? '#00f0ff' : 'rgba(148, 163, 184, 0.35)';
      const arrowWidth = isPeriodicTarget ? (isMini ? 1.3 : 2.2) : (isMini ? 0.7 : 1.0);
      drawArrow(ctx, x1, yMid, x2, col2Y[i], rSingle, r, arrowColor, arrowWidth, isMini ? 3.5 : 6);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Col 2 (Node k ONLY) -> Col 3 (All 8 Nodes) [Periodic Radiation]
    // ─────────────────────────────────────────────────────────────
    const fromY = col2Y[activeNodeIdx];
    for (let j = 0; j < N; j++) {
      const isOutputBit1 = (outVec[j] === 1);
      const rayColor = isOutputBit1 ? '#00f0ff' : 'rgba(0, 240, 255, 0.6)';
      const rayWidth = isOutputBit1 ? (isMini ? 1.3 : 2.2) : (isMini ? 0.8 : 1.3);
      drawArrow(ctx, x2, fromY, x3, col3Y[j], r, r, rayColor, rayWidth, isMini ? 3.5 : 6);
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Col 3 (8 Nodes) -> Col 4 (8 Nodes) [1-to-1 Forward Parallel]
    // ─────────────────────────────────────────────────────────────
    for (let i = 0; i < N; i++) {
      const isActiveBit = (outVec[i] === 1);
      const fwdColor = isActiveBit ? '#f59e0b' : 'rgba(245, 158, 11, 0.35)';
      const fwdWidth = isActiveBit ? (isMini ? 1.2 : 2.0) : (isMini ? 0.7 : 1.0);
      drawArrow(ctx, x3, col3Y[i], x4, col4Y[i], r, r, fwdColor, fwdWidth, isMini ? 3.5 : 6);
    }

    // ─────────────────────────────────────────────────────────────
    // 5. Col 4 (8 Nodes) -> Col 5 (1 Output Node) [Converging Fan-in]
    // ─────────────────────────────────────────────────────────────
    for (let i = 0; i < N; i++) {
      const isActiveBit = (outVec[i] === 1);
      const convColor = isActiveBit ? '#10b981' : 'rgba(16, 185, 129, 0.35)';
      const convWidth = isActiveBit ? (isMini ? 1.2 : 2.0) : (isMini ? 0.7 : 1.0);
      drawArrow(ctx, x4, col4Y[i], x5, yMid, r, rSingle, convColor, convWidth, isMini ? 3.5 : 6);
    }

    // ─────────────────────────────────────────────────────────────
    // 6. Render Nodes
    // ─────────────────────────────────────────────────────────────
    // Col 1: Single Input Node
    drawNode(ctx, x1, yMid, rSingle, 'In', false, true, isMini ? '' : 'Col 1');

    // Col 2: 8 Nodes (Node k is periodic active)
    for (let i = 0; i < N; i++) {
      const isPeriodic = (i === activeNodeIdx);
      const bit = inputVec[i];
      drawNode(ctx, x2, col2Y[i], r, bit, isPeriodic, false);
    }

    // Col 3: 8 Hidden Nodes
    for (let i = 0; i < N; i++) {
      const active = (outVec[i] === 1);
      drawNode(ctx, x3, col3Y[i], r, '', false, active);
    }

    // Col 4: 8 Pre-output Nodes
    for (let i = 0; i < N; i++) {
      const active = (outVec[i] === 1);
      drawNode(ctx, x4, col4Y[i], r, active ? '1' : '0', false, active);
    }

    // Col 5: Single Output Node
    const hasAnyActive = outVec.some(v => v === 1);
    drawNode(ctx, x5, yMid, rSingle, 'Out', false, hasAnyActive);

    // Column Headers & Annotations (Only on Full View)
    if (!isMini) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Input (1)', x1, yTop - 12);
      ctx.fillText('Col 2 (8)', x2, yTop - 12);
      ctx.fillText('Col 3 (8)', x3, yTop - 12);
      ctx.fillText('Col 4 (8)', x4, yTop - 12);
      ctx.fillText('Output (1)', x5, yTop - 12);

      // Top Status Banner
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 10.5px monospace';
      ctx.fillText(`Recursion tr${stepIdx + 1} — Periodic Active Node: Node ${stepIdx + 1}`, W / 2, 15);
    }
  }

  /**
   * Renders only the currently active step's neural network diagram (single view).
   */
  function renderNNVisualizer(traces) {
    if (!traces || traces.length < 8) return;

    const stepIdx = inspectorStep - 1; // 0-based
    nnActiveBadge.textContent = `Active: tr${inspectorStep}`;

    // Update single pane title & description
    titleLeft.textContent = `Recursion tr${inspectorStep}`;
    descLeft.textContent = `Node ${inspectorStep} activates & fans out to all 8 nodes of Col 3`;

    // Draw single full-width canvas for the active step
    drawThesisNNCanvas(canvasLeft, traces[stepIdx], stepIdx, false);

    // Refresh gallery if it is visible
    if (showAllSteps) renderGalleryGrid(traces);
  }

  function renderGalleryGrid(traces) {
    nnGalleryGrid.innerHTML = '';
    for (let s = 0; s < 8; s++) {
      const card = document.createElement('div');
      card.className = `gallery-card ${inspectorStep === s + 1 ? 'gallery-card-active' : ''}`;
      card.innerHTML = `<div class="gallery-card-header"><span>Recursion tr${s + 1}</span><span>Step ${s + 1} / 8</span></div>`;
      const c = document.createElement('canvas');
      drawThesisNNCanvas(c, traces[s], s, true);
      card.appendChild(c);
      card.addEventListener('click', () => {
        inspectorStep = s + 1;
        renderInspector();
      });
      nnGalleryGrid.appendChild(card);
    }
  }

  // Toggle All 8 Steps gallery
  btnToggleAllPairs.addEventListener('click', () => {
    showAllSteps = !showAllSteps;
    nnAllPairsGallery.style.display = showAllSteps ? 'block' : 'none';
    btnToggleAllPairs.textContent = showAllSteps ? 'Hide 8-Step Gallery' : 'Show All 8 Steps';
    btnToggleAllPairs.classList.toggle('active', showAllSteps);
    if (showAllSteps && currentEncryptionResult) {
      const charRes = cipherEngine.encryptCharacter(selectedChar);
      renderGalleryGrid(charRes.traces);
    }
  });

  // Window Resize handling (debounced) for mobile orientation changes
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (document.getElementById('inspector-tab').classList.contains('active')) {
        renderInspector();
      }
    }, 150);
  });

  // --- 6. Historical Infographics & Interactive Wheel Renderer ---
  let highlightedSpokeIdx = -1;

  function renderInfographicsTab() {
    // 1. Render Syllograph Meanings Table
    const syllTable = document.getElementById('syllographMeaningsTable');
    if (syllTable && GEEZ_DATASET.syllographMeanings) {
      syllTable.innerHTML = GEEZ_DATASET.syllographMeanings.map(item => `
        <tr>
          <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.95rem;">${item.latin}</strong></td>
          <td style="text-align: center;"><span class="infographic-glyph glyph-hieroglyph">${item.proto}</span></td>
          <td style="text-align: center;"><span class="infographic-glyph glyph-proto-ethiopic">${item.protoEthiopic}</span></td>
          <td style="text-align: center;"><span class="infographic-glyph glyph-classical-ethiopic">${item.classical}</span></td>
          <td><strong style="font-size: 0.85rem; color: #fff;">${item.name}</strong></td>
          <td class="table-desc-text">${item.description}</td>
        </tr>
      `).join('');
    }

    // 2. Render Ethiopic Evolution Table
    const evoTable = document.getElementById('ethiopicEvolutionTable');
    if (evoTable && GEEZ_DATASET.ethiopicEvolution) {
      evoTable.innerHTML = GEEZ_DATASET.ethiopicEvolution.map(item => {
        const parts = item.protoEthiopic.split(' ');
        const glyph = parts[0] || '';
        const sub = parts.slice(1).join(' ');
        const pictoParts = item.pictograph.split(' ');
        const emoji = pictoParts[0] || '';
        const pictoText = pictoParts.slice(1).join(' ');

        return `
          <tr>
            <td><span class="table-emoji">${emoji}</span> <span style="font-size: 0.82rem; color: #fff;">${pictoText}</span></td>
            <td>
              <span class="infographic-glyph glyph-proto-ethiopic">${glyph}</span>
              ${sub ? `<span class="table-text-sub">${sub}</span>` : ''}
            </td>
            <td style="text-align: center;"><span class="infographic-glyph glyph-classical-ethiopic">${item.ethiopic}</span></td>
            <td><span class="thesis-badge" style="padding: 0.2rem 0.5rem; font-size: 0.78rem;">${item.transcription}</span></td>
            <td><strong style="font-size: 0.85rem; color: #fff;">${item.name}</strong></td>
            <td class="table-desc-text">${item.meaning}</td>
          </tr>
        `;
      }).join('');
    }

    // 3. Render Comparative African Systems Matrix (Table 1.4)
    const compTable = document.getElementById('comparativeSystemsTable');
    if (compTable && GEEZ_DATASET.comparativeAfricanSystems) {
      compTable.innerHTML = GEEZ_DATASET.comparativeAfricanSystems.map(item => {
        const egyptParts = item.egyptian.split(' ');
        const egyptGlyph = egyptParts[0] || '';
        const egyptSub = egyptParts.slice(1).join(' ');

        const protoParts = item.protoEthiopic.split(' ');
        const protoGlyph = protoParts[0] || '';
        const protoSub = protoParts.slice(1).join(' ');

        return `
          <tr>
            <td style="text-align: center;"><strong style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.95rem;">${item.phoneme}</strong></td>
            <td>
              <span class="-glyph glyph-hieroglyph">${egyptGlyph}</span>
              ${egyptSub ? `<span class="table-text-sub">${egyptSub}</span>` : ''}
            </td>
            <td style="text-align: center;"><span class="infographic-glyph glyph-medium">${item.meroitic || '—'}</span></td>
            <td style="text-align: center;"><span class="infographic-glyph glyph-medium glyph-sinaitic">${item.sinaitic || '—'}</span></td>
            <td style="text-align: center;"><span class="infographic-glyph glyph-medium" style="color: #94a3b8;">${item.cretanLinear || '—'}</span></td>
            <td style="text-align: center;"><span class="infographic-glyph glyph-medium">${item.meroiticLinear || '—'}</span></td>
            <td>
              <span class="infographic-glyph glyph-proto-ethiopic">${protoGlyph}</span>
              ${protoSub ? `<span class="table-text-sub">${protoSub}</span>` : ''}
            </td>
            <td style="text-align: center;"><span class="infographic-glyph glyph-classical-ethiopic" style="color: #fff;">${item.ethiopic}</span></td>
            <td class="table-desc-text">${item.notes}</td>
          </tr>
        `;
      }).join('');
    }

    // 4. Render Ge'ez Developed Tree (Figure 1.2)
    renderGeezTree();
  }

  // --- Render Ge'ez Developed Tree (Figure 1.2) ---
  function renderGeezTree() {
    const svg = document.getElementById('geezTreeSvg');
    if (!svg) return;

    // Define 7 main branch clusters matching Figure 1.2 from thesis
    const clusters = [
      { id: 'ha', rootFidel: 'ሀ', name: 'Hoi', color: '#38bdf8', x: 80, y: 190, leaves: ['ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'] },
      { id: 'la', rootFidel: 'ለ', name: 'Lawi', color: '#f97316', x: 205, y: 190, leaves: ['ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ'] },
      { id: 'ha2', rootFidel: 'ሐ', name: 'Haut', color: '#22c55e', x: 330, y: 190, leaves: ['ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ'] },
      { id: 'ma', rootFidel: 'መ', name: 'Mai', color: '#94a3b8', x: 460, y: 190, leaves: ['ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ'] },
      { id: 'sa', rootFidel: 'ሠ', name: 'Saut', color: '#a855f7', x: 590, y: 190, leaves: ['ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ'] },
      { id: 'ra', rootFidel: 'ረ', name: 'Rees', color: '#ef4444', x: 715, y: 190, leaves: ['ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ'] },
      { id: 'sa2', rootFidel: 'ሰ', name: 'Sat', color: '#3b82f6', x: 840, y: 190, leaves: ['ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'] }
    ];

    const rootX = 460;
    const rootY = 75;

    let svgHtml = `
      <!-- Definitions & Glow Filters -->
      <defs>
        <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f87171" stop-opacity="1" />
          <stop offset="80%" stop-color="#dc2626" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#991b1b" stop-opacity="1" />
        </radialGradient>
        <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- Background Grid Decoration -->
      <rect x="0" y="0" width="920" height="480" rx="14" fill="#080d1a" stroke="rgba(0, 240, 255, 0.15)" stroke-width="1.5" />

      <!-- Level 1 Label: Nubare Fidel -->
      <g text-anchor="middle">
        <text x="${rootX}" y="28" font-family="'Noto Sans Ethiopic', serif" font-size="18" font-weight="bold" fill="#ffffff">ኑባሬ ፊደል</text>
        <text x="${rootX}" y="48" font-family="sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="1">Nubare Fidel</text>
      </g>

      <!-- Level 2 Label: Siriw Fidel -->
      <g text-anchor="start">
        <text x="24" y="110" font-family="'Noto Sans Ethiopic', serif" font-size="17" font-weight="bold" fill="#ffffff">ስርወ ፊደል</text>
        <text x="24" y="130" font-family="sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="1">Siriw Fidel</text>
      </g>

      <!-- Level 3 Label: Serawite Fidel -->
      <g text-anchor="middle">
        <text x="${rootX}" y="445" font-family="'Noto Sans Ethiopic', serif" font-size="18" font-weight="bold" fill="#ffffff">ሠራዊተ ፊደል</text>
        <text x="${rootX}" y="465" font-family="sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="1">Serawite Fidel</text>
      </g>
    `;

    // 1. Draw Branches from Nubare Root to Siriw Nodes
    clusters.forEach(c => {
      svgHtml += `
        <line x1="${rootX}" y1="${rootY}" x2="${c.x}" y2="${c.y}" stroke="${c.color}" stroke-width="2.5" stroke-opacity="0.85" />
      `;
    });

    // 2. Draw Serawite Leaves and connecting lines from each Siriw Node
    clusters.forEach(c => {
      const leafSpread = 14;
      const startLeafX = c.x - (5 * leafSpread) / 2;

      c.leaves.forEach((fidel, lIdx) => {
        const leafX = startLeafX + lIdx * leafSpread;
        const leafY = 345 + (lIdx % 2 === 0 ? 0 : 22);

        svgHtml += `
          <!-- Branch Line to Serawite Leaf -->
          <line x1="${c.x}" y1="${c.y}" x2="${leafX}" y2="${leafY}" stroke="${c.color}" stroke-width="1.8" stroke-opacity="0.75" />
          
          <!-- Leaf Circle Node -->
          <circle cx="${leafX}" cy="${leafY}" r="7" fill="${c.color}" stroke="#0b1120" stroke-width="1.5" filter="url(#nodeShadow)">
            <title>${c.rootFidel} (${c.name}) Order ${lIdx + 2}: ${fidel}</title>
          </circle>
          
          <!-- Leaf Ethiopic Fidel Glyph -->
          <text x="${leafX}" y="${leafY + (lIdx % 2 === 0 ? -11 : 17)}" font-family="'Noto Sans Ethiopic', serif" font-size="11" font-weight="bold" fill="#f8fafc" text-anchor="middle">${fidel}</text>
        `;
      });

      // 3. Draw Siriw Main Class Node
      svgHtml += `
        <circle cx="${c.x}" cy="${c.y}" r="12" fill="${c.color}" stroke="#ffffff" stroke-width="2" filter="url(#nodeShadow)">
          <title>Siriw Fidel: ${c.rootFidel} (${c.name})</title>
        </circle>
        <text x="${c.x}" y="${c.y - 17}" font-family="'Noto Sans Ethiopic', serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">${c.rootFidel}</text>
      `;
    });

    // 4. Draw Root Node (Nubare Fidel) at Top
    svgHtml += `
      <circle cx="${rootX}" cy="${rootY}" r="14" fill="url(#rootGlow)" stroke="#ffffff" stroke-width="2.5" filter="url(#nodeShadow)">
        <title>Nubare Fidel: The Primal Root of Ge'ez</title>
      </circle>
    `;

    svg.innerHTML = svgHtml;
  }

  // --- Tab 5: Architecture Tab Renderer ---
  function renderArchitectureTab() {
    const archTable = document.getElementById('archHomophoneTable');
    if (archTable && GEEZ_DATASET.syllographicHomophones) {
      archTable.innerHTML = GEEZ_DATASET.syllographicHomophones.map(item => `
        <tr>
          <td><span class="infographic-glyph glyph-classical-ethiopic" style="font-size: 1.35rem; color: var(--accent-cyan); font-weight: bold;">${item.geez}</span></td>
          <td><span style="font-family: var(--font-ethiopic); font-size: 1.05rem; color: #fff;">${item.amharic}</span></td>
          <td><strong style="color: #cbd5e1; font-size: 0.9rem;">${item.english}</strong></td>
          <td style="color: var(--text-muted); font-size: 0.78rem; line-height: 1.35;">${item.optionalMeaning || '—'}</td>
          <td><span class="thesis-badge" style="font-size: 0.72rem; padding: 0.18rem 0.5rem;">${item.pair}</span></td>
        </tr>
      `).join('');
    }

    renderNumerologyWheel('archNumerologyWheelCanvas');
  }

  let showLatinOnWheel = false;

  function renderNumerologyWheel(targetCanvasId = 'archNumerologyWheelCanvas') {
    const canvasIds = targetCanvasId === 'all'
      ? ['archNumerologyWheelCanvas']
      : [targetCanvasId];

    canvasIds.forEach(id => {
      const canvas = document.getElementById(id);
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Dynamic Radii based strictly on canvas size
      const alphabetBandRadius = width * 0.475; // Fits inside canvas with margin
      const outerRadius = width * 0.385;        // Number boundary
      const innerRadius = width * 0.115;        // Hub boundary
      const numClasses = 26;
      const angleStep = (Math.PI * 2) / numClasses;
      const ringWidth = (outerRadius - innerRadius) / 7;

      ctx.clearRect(0, 0, width, height);

      // Background circle
      const bgGrad = ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, alphabetBandRadius + 10);
      bgGrad.addColorStop(0, '#0d1527');
      bgGrad.addColorStop(0.8, '#060913');
      bgGrad.addColorStop(1, '#020408');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, alphabetBandRadius + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 7 Concentric Number Rings (representing the 7 Orders)
      for (let r = 1; r <= 7; r++) {
        const radius = innerRadius + ringWidth * r;
        ctx.strokeStyle = (r === 7) ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = (r === 7) ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer Alphabet Band Outer Border
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, alphabetBandRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Center Core Hub (Equinox Origin)
      ctx.fillStyle = '#060d1a';
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const hubFontSize = Math.max(9, Math.round(width * 0.02));
      ctx.fillStyle = '#00f0ff';
      ctx.font = `bold ${hubFontSize}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('EQUINOX', cx, cy - 8);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `${Math.round(hubFontSize * 0.8)}px sans-serif`;
      ctx.fillText('182 DAYS', cx, cy + 8);

      // Latin alphabet correspondence table A-Z
      const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      // Draw all 26 Spokes with full 7 number rings & alphabet headers
      GEEZ_DATASET.ethiopianClasses.forEach((cls, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const nextAngle = (i + 1) * angleStep - Math.PI / 2;
        const midAngle = angle + angleStep / 2;
        const isHighlighted = (i === highlightedSpokeIdx);
        const latinChar = latinLetters[i];

        // Spoke Wedge Highlight
        if (isHighlighted) {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, alphabetBandRadius, angle, nextAngle);
          ctx.closePath();
          ctx.fill();
        }

        // Spoke Separator Line
        const xLine = cx + Math.cos(angle) * alphabetBandRadius;
        const yLine = cy + Math.sin(angle) * alphabetBandRadius;
        ctx.strokeStyle = isHighlighted ? 'rgba(0, 240, 255, 0.95)' : 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = isHighlighted ? 2.5 : 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * innerRadius, cy + Math.sin(angle) * innerRadius);
        ctx.lineTo(xLine, yLine);
        ctx.stroke();

        // Render all 7 Numbers in concentric cells & outer alphabet label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);

        // Draw 7 concentric numbers along the spoke
        for (let order = 1; order <= 7; order++) {
          const numRadius = innerRadius + ringWidth * (order - 0.5);
          const cellValue = cls.baseValue * order;

          ctx.save();
          ctx.translate(numRadius, 0);

          // Keep text readable: if on left hemisphere, rotate 180 degrees
          const isLeftHemisphere = (midAngle > Math.PI / 2 || midAngle < -Math.PI / 2);
          if (isLeftHemisphere) {
            ctx.rotate(Math.PI);
          }

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Font size scales with canvas width and number length
          const valStr = cellValue.toString();
          let fontSize = Math.max(7.5, Math.round(width * 0.017));
          if (valStr.length >= 4) fontSize = Math.max(6.5, Math.round(width * 0.014));
          else if (valStr.length === 3) fontSize = Math.max(7, Math.round(width * 0.0155));

          if (isHighlighted) {
            ctx.fillStyle = '#00f0ff';
            ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
          } else {
            ctx.fillStyle = order === 1 ? '#94a3b8' : (order === 7 ? '#f8fafc' : '#cbd5e1');
            ctx.font = `${fontSize}px "Fira Code", monospace`;
          }

          ctx.fillText(valStr, 0, 0);
          ctx.restore();
        }

        // Draw Outer Alphabet Label (Ethiopic Fidel + Latin Letter)
        const alphabetRadius = outerRadius + (alphabetBandRadius - outerRadius) / 2;
        ctx.save();
        ctx.translate(alphabetRadius, 0);

        const isLeft = (midAngle > Math.PI / 2 || midAngle < -Math.PI / 2);
        if (isLeft) ctx.rotate(Math.PI);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fidelFontSize = Math.max(14, Math.round(width * 0.032));
        const latinFontSize = Math.max(8, Math.round(width * 0.017));

        if (showLatinOnWheel) {
          ctx.fillStyle = isHighlighted ? '#00f0ff' : '#ffffff';
          ctx.font = isHighlighted ? `bold ${fidelFontSize}px "Fira Code", monospace` : `${fidelFontSize - 2}px "Fira Code", monospace`;
          ctx.fillText(`${latinChar}`, 0, -3);
          ctx.fillStyle = isHighlighted ? '#f8fafc' : 'rgba(0, 240, 255, 0.85)';
          ctx.font = `${latinFontSize}px "Noto Sans Ethiopic", serif`;
          ctx.fillText(cls.geez, 0, 9);
        } else {
          ctx.fillStyle = isHighlighted ? '#00f0ff' : '#ffffff';
          ctx.font = isHighlighted ? `bold ${fidelFontSize + 2}px "Noto Sans Ethiopic", serif` : `bold ${fidelFontSize}px "Noto Sans Ethiopic", serif`;
          ctx.fillText(cls.geez, 0, -4);

          ctx.fillStyle = isHighlighted ? '#f8fafc' : 'rgba(148, 163, 184, 0.85)';
          ctx.font = `bold ${latinFontSize}px "Fira Code", monospace`;
          ctx.fillText(latinChar, 0, 8);
        }

        ctx.restore();
        ctx.restore();
      });
    });
  }

  // Setup Wheel Mouse Interactions for a Canvas & Hover Card
  function setupWheelCanvasEvents(canvasId, detailsId) {
    const wheelCanvas = document.getElementById(canvasId);
    const whDetails = document.getElementById(detailsId);
    if (!wheelCanvas) return;

    wheelCanvas.addEventListener('mousemove', (e) => {
      const rect = wheelCanvas.getBoundingClientRect();
      const scaleX = wheelCanvas.width / rect.width;
      const scaleY = wheelCanvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - wheelCanvas.width / 2;
      const y = (e.clientY - rect.top) * scaleY - wheelCanvas.height / 2;
      const dist = Math.sqrt(x * x + y * y);

      const innerLimit = wheelCanvas.width * 0.11;
      const outerLimit = wheelCanvas.width * 0.48;

      if (dist >= innerLimit && dist <= outerLimit) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        const spokeIdx = Math.floor(angle / ((Math.PI * 2) / 26)) % 26;

        if (spokeIdx !== highlightedSpokeIdx) {
          highlightedSpokeIdx = spokeIdx;
          renderNumerologyWheel('all');

          const cls = GEEZ_DATASET.ethiopianClasses[spokeIdx];
          const latinChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[spokeIdx];
          const equinoxStart = (spokeIdx * 7) + 1;
          const equinoxEnd = equinoxStart + 6;
          const orderNames = ["1st Ge'ez", "2nd Ka'eb", "3rd Salis", "4th Rab'e", "5th Hamis", "6th Sadis", "7th Sab'e"];
          const numbersPills = [1, 2, 3, 4, 5, 6, 7].map(o => {
            const val = cls.baseValue * o;
            return `<span class="wheel-order-pill" title="${orderNames[o - 1]}"><strong>${o}:</strong> ${val}</span>`;
          }).join(' ');

          if (whDetails) {
            whDetails.innerHTML = `
              <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                <span style="font-size: 1.25rem; color: var(--accent-cyan); font-family: var(--font-ethiopic); font-weight: bold;">
                  ${cls.geez} [${latinChar}] — ${cls.name} (${cls.meaning})
                </span>
                <span class="thesis-badge" style="font-size: 0.76rem;">Base Gematria: ${cls.baseValue} • Equinox Days ${equinoxStart}–${equinoxEnd}</span>
              </div>
              <div class="wheel-numbers-strip">
                ${numbersPills}
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                👉 Click this spoke to load '${cls.geez}' into the 8x8 Cognitive Map &amp; RNN Inspector.
              </p>
            `;
          }
        }
      } else if (highlightedSpokeIdx !== -1) {
        highlightedSpokeIdx = -1;
        renderNumerologyWheel('all');
        if (whDetails) {
          whDetails.innerHTML = '26 Spoke Fidels • 7 Concentric Number Bands (1 Upto 5600)';
        }
      }
    });

    wheelCanvas.addEventListener('mouseleave', () => {
      highlightedSpokeIdx = -1;
      renderNumerologyWheel('all');
      if (whDetails) {
        whDetails.innerHTML = '26 Spoke Fidels • 7 Concentric Number Bands (1 Upto 5600)';
      }
    });

    wheelCanvas.addEventListener('click', () => {
      if (highlightedSpokeIdx >= 0) {
        const cls = GEEZ_DATASET.ethiopianClasses[highlightedSpokeIdx];
        selectedChar = cls.geez;
        // Switch to visualizer tab
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        const vizBtn = document.querySelector('[data-tab="visualizer-tab"]');
        if (vizBtn) vizBtn.classList.add('active');
        const vizContent = document.getElementById('visualizer-tab');
        if (vizContent) vizContent.classList.add('active');

        renderVisualizer();
        renderEthiopicClasses();
        renderInspector();
        performEncryption();
      }
    });
  }

  // Setup wheel interaction on both canvases
  setupWheelCanvasEvents('numerologyWheelCanvas', 'whDetails');
  setupWheelCanvasEvents('archNumerologyWheelCanvas', 'archWhDetails');

  // --- Initialize App ---
  renderCharSelector();
  renderVisualizer();
  renderEthiopicClasses();
  renderArchitectureTab();
  renderInfographicsTab();
  performEncryption();
  // Note: decryption is only triggered when user pastes/types in the decrypt tab
});
