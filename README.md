# Ge'ez-based RNN Cipher

Interactive web app for the M.Sc. thesis *Modeling Ge'ez based Recurrent Neural Network Cipher Algorithm* (Biruk Tesfaye Yohannes, Dilla University, 2019).

It encrypts text with the thesis's 8-recursion network: each character becomes an 8×8 (64-bit) block. An optional AES-128 layer goes on top. The app also includes a step-by-step inspector and reference material on the Ge'ez writing system.

## Run locally

No build step. Serve the folder with any static server:

```
npx serve .        # or: python -m http.server 8080
```

Then open http://localhost:8080.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `index.css` | Styles |
| `app.js` | UI logic, canvas drawings |
| `geez_rnn_engine.js` | Cipher engine (encrypt/decrypt, AES layer) |
| `geez_dataset.js` | 8×8 character maps and Ge'ez reference data |

> Research prototype. Not for protecting real data.

## Deploying

`main` deploys automatically to Hostinger. When you change `app.js`, `index.css` or the other scripts, bump the `?v=` value on their tags in `index.html` so the CDN serves the new files.

## Ge'ez and Amharic 8×8 maps

Every Ethiopic character uses the same principle as the English letters: the glyph's black/white pixel shape fills the 6×7 data area (columns 3–8, rows 1–7), and columns 1–2 and row 8 are flag bits. The 238 maps (26 Ge'ez classes and 8 Amharic classes, 7 orders each) were rasterized from Noto Sans Ethiopic Bold at a 0.42 coverage threshold. Every map in the dataset (322 including Latin, digits and symbols) is unique, so every character decrypts back to itself.
