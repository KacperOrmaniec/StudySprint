/* eslint-disable */
/**
 * Generator własnych ikon aplikacji (zastępuje domyślną ikonę Expo).
 * Uruchom: node scripts/generate-icons.js
 *
 * Motyw: checkmark w pierścieniu na niebieskim gradiencie (marka #4a90e2) —
 * nawiązuje do ukończania zadań w StudySprint.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ASSETS = path.join(__dirname, "..", "assets");

// Pełna ikona: niebieski zaokrąglony kwadrat + pierścień + checkmark.
const fullIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4a90e2"/>
      <stop offset="1" stop-color="#2f6fb0"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#g)"/>
  <circle cx="512" cy="512" r="300" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="30"/>
  <path d="M360 522 L470 632 L676 384" fill="none" stroke="#ffffff"
        stroke-width="74" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Wariant na adaptive icon (Android): tylko biały znak na przezroczystym tle,
// pomniejszony do strefy bezpiecznej (~62%), bo system maskuje i przybliża.
const foregroundIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(512,512) scale(0.62) translate(-512,-512)">
    <circle cx="512" cy="512" r="300" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="30"/>
    <path d="M360 522 L470 632 L676 384" fill="none" stroke="#ffffff"
          stroke-width="74" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

async function png(svg, size, outFile) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(path.join(ASSETS, outFile));
  console.log("✓", outFile);
}

(async () => {
  if (!fs.existsSync(ASSETS)) fs.mkdirSync(ASSETS, { recursive: true });
  // Ikona aplikacji (iOS/ogólna) i splash – pełny kolorowy znak.
  await png(fullIcon(1024), 1024, "icon.png");
  await png(fullIcon(1024), 1024, "splash-icon.png");
  // Android adaptive: foreground (przezroczyste) – tło ustawia backgroundColor.
  await png(foregroundIcon(1024), 1024, "adaptive-icon.png");
  await png(foregroundIcon(1024), 1024, "android-icon-foreground.png");
  // Favicon (web).
  await png(fullIcon(48), 48, "favicon.png");
  console.log("Gotowe — ikony wygenerowane w assets/");
})();
