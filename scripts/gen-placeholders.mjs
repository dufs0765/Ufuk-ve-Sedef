/**
 * Eksik fotoğraf yollarına SVG yer tutucu yazar (gerçek fotoğraflarla değiştirilebilir).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function albumSvg(n) {
  const h = (n * 47) % 360;
  const h2 = (h + 40) % 360;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${h},55%,38%)"/>
      <stop offset="100%" style="stop-color:hsl(${h2},45%,22%)"/>
    </linearGradient>
  </defs>
  <rect width="900" height="700" fill="url(#g)"/>
  <text x="450" y="330" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-family="system-ui,sans-serif" font-size="32" font-weight="600">Albüm ${String(n).padStart(2, "0")}</text>
  <text x="450" y="380" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="system-ui,sans-serif" font-size="15">Gerçek foto buraya (dosya adlarını koru)</text>
</svg>`;
}

function simpleSvg(title, subtitle, hue) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
  <rect width="900" height="700" fill="hsl(${hue},45%,28%)"/>
  <text x="450" y="330" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-family="system-ui,sans-serif" font-size="28" font-weight="600">${title}</text>
  <text x="450" y="375" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="system-ui,sans-serif" font-size="14">${subtitle}</text>
</svg>`;
}

function tazSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
  <circle cx="110" cy="110" r="100" fill="#7f1d1d"/>
  <circle cx="110" cy="100" r="72" fill="#fca5a5"/>
  <ellipse cx="88" cy="88" rx="14" ry="18" fill="#1f2937"/>
  <ellipse cx="132" cy="88" rx="14" ry="18" fill="#1f2937"/>
  <path d="M75 128 Q110 152 145 128" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
  <text x="110" y="198" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="system-ui,sans-serif" font-size="11">Taz (yer tutucu)</text>
</svg>`;
}

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

for (let i = 1; i <= 18; i++) {
  const n = String(i).padStart(2, "0");
  write(`public/photos/album/album-${n}.svg`, albumSvg(i));
}

write("public/photos/bad-real-1.svg", simpleSvg("Kötü son 1", "bad-real-1.svg → PNG ile değiştirebilirsin", 350));
write("public/photos/bad-real-2.svg", simpleSvg("Kötü son 2", "bad-real-2.svg", 320));
write("public/photos/happy-real-1.svg", simpleSvg("Mutlu 1", "happy-real-1.svg", 140));
write("public/photos/happy-real-2.svg", simpleSvg("Mutlu 2", "happy-real-2.svg", 160));
write("public/photos/happy-real-3.svg", simpleSvg("Mutlu 3", "happy-real-3.svg", 130));
write("public/photos/avatar-ufuk-real.svg", simpleSvg("Dufs", "avatar-ufuk-real.svg", 200));
write("public/photos/avatar-sedef-real.svg", simpleSvg("Šedf", "avatar-sedef-real.svg", 320));
write("public/stickers/taz-evil.svg", tazSvg());

console.log("Placeholder SVG dosyaları yazıldı: public/photos ve public/stickers");
