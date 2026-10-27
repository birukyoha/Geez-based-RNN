/**
 * Ge'ez Recurrent Neural Network (RNN) Cipher Engine
 * Implements Biruk Tesfaye's M.Sc. Thesis Algorithm (Dilla University, 2019)
 */

let geezDatasetRef;
if (typeof GEEZ_DATASET !== 'undefined') {
  geezDatasetRef = GEEZ_DATASET;
} else if (typeof require !== 'undefined') {
  geezDatasetRef = require('./geez_dataset.js');
}

class GeezRNNCipher {
  constructor(customWeights = null, customBiases = null) {
    // 8x8 Weight Matrix (default: all 0s for fixed-network mode)
    this.weights = customWeights || Array.from({ length: 8 }, () => Array(8).fill(0));
    
    // Custom Biases if provided by user override
    this.customBiases = customBiases || null;
  }

  /**
   * Helper: Convert character to 8-bit binary array (ASCII code or Ethiopic Equinox index)
   */
  charToAsciiBits(char) {
    if (!char) return [0, 0, 0, 0, 0, 0, 0, 0];
    const dataset = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : geezDatasetRef;
    if (dataset && dataset.getCharacterProfile) {
      const profile = dataset.getCharacterProfile(char);
      if (profile && profile.isEthiopic) {
        // Map 182 Ethiopic syllographs to their unique 8-bit Equinox day (1..182)
        const day = profile.equinoxDay || 1;
        return day.toString(2).padStart(8, '0').split('').map(Number);
      }
    }
    const code = char.charCodeAt(0) & 0xFF;
    return code.toString(2).padStart(8, '0').split('').map(Number);
  }

  /**
   * Helper: Convert 8-bit binary array back to ASCII character
   */
  asciiBitsToChar(bits) {
    const code = parseInt(bits.join(''), 2);
    return String.fromCharCode(code);
  }

  /**
   * Helper: Convert Hex string to Binary string (4 bits per hex digit)
   */
  hexToBinary(hexString) {
    const cleanHex = hexString.replace(/[^0-9A-Fa-f]/g, '');
    let binary = '';
    for (let i = 0; i < cleanHex.length; i++) {
      binary += parseInt(cleanHex[i], 16).toString(2).padStart(4, '0');
    }
    return binary;
  }

  /**
   * Helper: Convert Binary string to 8x8 matrix blocks (64 bits per character)
   */
  binaryToBlocks(binaryString) {
    const cleanBin = binaryString.replace(/[^01]/g, '');
    const blocks64 = [];

    // Each character block is 64 bits (8 rows x 8 columns)
    for (let i = 0; i < cleanBin.length; i += 64) {
      const chunk = cleanBin.substring(i, i + 64);
      if (chunk.length < 64) continue; // Skip incomplete blocks

      const block = [];
      for (let r = 0; r < 8; r++) {
        const rowBits = chunk.substring(r * 8, (r + 1) * 8).split('').map(Number);
        block.push(rowBits);
      }
      blocks64.push(block);
    }
    return blocks64;
  }

  /**
   * Encrypts a single character through 8-step RNN recursions
   * @param {string} char 
   * @returns {Object} { block64: Array[8][8], traces: Array[8] }
   */
  encryptCharacter(char) {
    const dataset = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : geezDatasetRef;
    const targetCognitiveMap = dataset.getMatrixForChar(char);
    const initialInputVector = this.charToAsciiBits(char);

    let currentInputVector = [...initialInputVector];
    const block64 = [];
    const traces = [];

    // Execute 8 Recurrences (tr1 through tr8)
    for (let tr = 1; tr <= 8; tr++) {
      const rowIndex = tr - 1;

      // Determine Bias Vector B_tr for recursion step tr:
      // Maps cognitive map row values: 0 -> -1, 1 -> +1
      let biasVector;
      if (this.customBiases && this.customBiases[rowIndex]) {
        biasVector = [...this.customBiases[rowIndex]];
      } else {
        biasVector = targetCognitiveMap[rowIndex].map(val => (val === 1 ? 1 : -1));
      }

      const weightVector = this.weights[rowIndex];

      // Vector arithmetic: V[i] = (W[i] * X[i]) + B[i]
      const V = [];
      const outputVector = [];

      for (let i = 0; i < 8; i++) {
        const vVal = (weightVector[i] * currentInputVector[i]) + biasVector[i];
        V.push(vVal);
        // Activation function: Step / Linear threshold
        // If V[i] > 0 -> 1 else 0
        const actVal = vVal > 0 ? 1 : 0;
        outputVector.push(actVal);
      }

      traces.push({
        recursionStep: tr,
        inputVector: [...currentInputVector],
        weightVector: [...weightVector],
        biasVector: [...biasVector],
        vVector: [...V],
        outputVector: [...outputVector]
      });

      block64.push([...outputVector]);

      // Feedback loop: Output feeds back as input for next recursion step
      currentInputVector = [...outputVector];
    }

    return {
      character: char,
      targetMap: targetCognitiveMap,
      initialInput: initialInputVector,
      block64: block64,
      traces: traces
    };
  }

  /**
   * Decrypts a 64-bit matrix block back into plaintext character
   * @param {Array[8][8]} block64 
   * @returns {Object} { character, recoveredBits, traces }
   */
  decryptCharacter(block64) {
    const dataset = (typeof GEEZ_DATASET !== 'undefined') ? GEEZ_DATASET : geezDatasetRef;
    const traces = [];

    // Search dataset cognitive maps to find closest match for block64
    let matchedChar = '?';
    let bestScore = -1;

    for (const charKey of Object.keys(dataset.cognitiveMaps)) {
      const map = dataset.cognitiveMaps[charKey];
      let matches = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (map[r][c] === block64[r][c]) matches++;
        }
      }
      if (matches > bestScore) {
        bestScore = matches;
        matchedChar = charKey;
      }
    }

    // Step-by-step trace generation for decryption inspector
    let currentInput = [...block64[0]];
    for (let tr = 1; tr <= 8; tr++) {
      const rowIndex = tr - 1;
      const biasVector = block64[rowIndex].map(val => (val === 1 ? 1 : -1));
      const weightVector = this.weights[rowIndex];

      const V = [];
      const outputVector = [];
      for (let i = 0; i < 8; i++) {
        const vVal = (weightVector[i] * currentInput[i]) + biasVector[i];
        V.push(vVal);
        outputVector.push(vVal > 0 ? 1 : 0);
      }

      traces.push({
        recursionStep: tr,
        inputVector: [...currentInput],
        weightVector: [...weightVector],
        biasVector: [...biasVector],
        vVector: [...V],
        outputVector: [...outputVector]
      });
      currentInput = [...outputVector];
    }

    const recoveredBits = this.charToAsciiBits(matchedChar);

    return {
      character: matchedChar,
      recoveredBits: recoveredBits,
      traces: traces
    };
  }

  /**
   * Encrypts a full text string
   * @param {string} text 
   * @returns {Object} Encryption result with binary, hex, blocks, and step traces
   */
  encryptText(text) {
    const charResults = [];
    let fullBinaryString = '';
    const blocks64 = [];

    for (let i = 0; i < text.length; i++) {
      const res = this.encryptCharacter(text[i]);
      charResults.push(res);

      const blockBin = res.block64.map(row => row.join('')).join('');
      fullBinaryString += blockBin;
      blocks64.push(res.block64);
    }

    // Convert binary to Hex for compact display
    let hexString = '';
    for (let i = 0; i < fullBinaryString.length; i += 4) {
      const chunk = fullBinaryString.substring(i, i + 4).padEnd(4, '0');
      hexString += parseInt(chunk, 2).toString(16).toUpperCase();
    }

    return {
      plaintext: text,
      fullBinary: fullBinaryString,
      hex: hexString,
      charResults: charResults,
      blocks64: blocks64
    };
  }

  /**
   * Decrypts a full matrix block array back into plaintext
   * @param {Array[8][8]} blocks64 
   * @returns {string} Plaintext
   */
  decryptTextFromBlocks(blocks64) {
    let plaintext = '';
    for (const block of blocks64) {
      const decRes = this.decryptCharacter(block);
      plaintext += decRes.character;
    }
    return plaintext;
  }

  /**
   * Decrypts from a binary ciphertext string (e.g. 576 bits of 0s and 1s)
   * @param {string} binaryString 
   * @returns {string} Plaintext
   */
  decryptTextFromBinary(binaryString) {
    const blocks = this.binaryToBlocks(binaryString);
    if (blocks.length === 0) return '';
    return this.decryptTextFromBlocks(blocks);
  }

  /**
   * Decrypts from a Hex ciphertext string (e.g. "2222223E22222200...")
   * @param {string} hexString 
   * @returns {string} Plaintext
   */
  decryptTextFromHex(hexString) {
    const binary = this.hexToBinary(hexString);
    return this.decryptTextFromBinary(binary);
  }

  /**
   * Perform Web Crypto API AES-128 CBC Encryption on binary cipher string
   */
  async encryptAES128(binaryData, keyPassphrase = "GEEZ_SECRET_KEY") {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return { ciphertextHex: "AES unavailable in non-browser context" };
    }

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(keyPassphrase.padEnd(16, '0').substring(0, 16));
      const aesKey = await crypto.subtle.importKey('raw', keyData, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);

      const iv = new Uint8Array(16); // 128-bit static IV for demonstration
      const dataBuffer = encoder.encode(binaryData);
      const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: iv }, aesKey, dataBuffer);

      const byteArray = new Uint8Array(encryptedBuffer);
      const hex = Array.from(byteArray).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      return {
        ciphertextHex: hex,
        ivHex: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')
      };
    } catch (e) {
      return { ciphertextHex: "AES Encryption Error: " + e.message };
    }
  }

  /**
   * Perform Web Crypto API AES-128 CBC Decryption
   */
  async decryptAES128(ciphertextHex, keyPassphrase = "GEEZ_SECRET_KEY") {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return { binaryData: "", error: "AES unavailable" };
    }

    try {
      const cleanHex = ciphertextHex.replace(/[^0-9A-Fa-f]/g, '');
      const byteArray = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

      const encoder = new TextEncoder();
      const keyData = encoder.encode(keyPassphrase.padEnd(16, '0').substring(0, 16));
      const aesKey = await crypto.subtle.importKey('raw', keyData, { name: 'AES-CBC' }, false, ['decrypt']);

      const iv = new Uint8Array(16);
      const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, aesKey, byteArray);

      const decoder = new TextDecoder();
      const binaryString = decoder.decode(decryptedBuffer);
      return { binaryData: binaryString, error: null };
    } catch (e) {
      return { binaryData: "", error: "Invalid AES Ciphertext or Key" };
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = GeezRNNCipher;
}
