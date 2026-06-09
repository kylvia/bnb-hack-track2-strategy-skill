import { writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const width = 480;
const height = 480;
const outPath = new URL('../assets/buidl-logo.png', import.meta.url);
const pixels = Buffer.alloc(width * height * 4);

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuf = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 8 + data.length);
  return out;
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));
}

function put(x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= width || y >= height || alpha <= 0) return;
  const i = (Math.floor(y) * width + Math.floor(x)) * 4;
  const a = Math.max(0, Math.min(1, alpha));
  pixels[i] = mix(pixels[i], color[0], a);
  pixels[i + 1] = mix(pixels[i + 1], color[1], a);
  pixels[i + 2] = mix(pixels[i + 2], color[2], a);
  pixels[i + 3] = 255;
}

function fillBackground() {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = x - width / 2;
      const dy = y - height / 2;
      const d = Math.sqrt(dx * dx + dy * dy) / 340;
      const glow = Math.max(0, 1 - d);
      const i = (y * width + x) * 4;
      pixels[i] = mix(7, 22, glow);
      pixels[i + 1] = mix(11, 35, glow);
      pixels[i + 2] = mix(18, 45, glow);
      pixels[i + 3] = 255;
    }
  }
}

function circle(cx, cy, r, color, alpha = 1) {
  const minX = Math.floor(cx - r - 2);
  const maxX = Math.ceil(cx + r + 2);
  const minY = Math.floor(cy - r - 2);
  const maxY = Math.ceil(cy + r + 2);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      put(x, y, color, alpha * Math.max(0, Math.min(1, r + 0.7 - d)));
    }
  }
}

function ring(cx, cy, r, thickness, color, alpha = 1) {
  const minX = Math.floor(cx - r - thickness - 2);
  const maxX = Math.ceil(cx + r + thickness + 2);
  const minY = Math.floor(cy - r - thickness - 2);
  const maxY = Math.ceil(cy + r + thickness + 2);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const d = Math.abs(Math.hypot(x + 0.5 - cx, y + 0.5 - cy) - r);
      put(x, y, color, alpha * Math.max(0, Math.min(1, thickness / 2 + 0.7 - d)));
    }
  }
}

function line(x1, y1, x2, y2, thickness, color, alpha = 1) {
  const minX = Math.floor(Math.min(x1, x2) - thickness - 2);
  const maxX = Math.ceil(Math.max(x1, x2) + thickness + 2);
  const minY = Math.floor(Math.min(y1, y2) - thickness - 2);
  const maxY = Math.ceil(Math.max(y1, y2) + thickness + 2);
  const vx = x2 - x1;
  const vy = y2 - y1;
  const len2 = vx * vx + vy * vy;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const t = Math.max(0, Math.min(1, ((x + 0.5 - x1) * vx + (y + 0.5 - y1) * vy) / len2));
      const px = x1 + t * vx;
      const py = y1 + t * vy;
      const d = Math.hypot(x + 0.5 - px, y + 0.5 - py);
      put(x, y, color, alpha * Math.max(0, Math.min(1, thickness / 2 + 0.7 - d)));
    }
  }
}

function roundedRect(x0, y0, w, h, r, color, alpha = 1) {
  for (let y = Math.floor(y0); y < y0 + h; y += 1) {
    for (let x = Math.floor(x0); x < x0 + w; x += 1) {
      const cx = Math.max(x0 + r, Math.min(x + 0.5, x0 + w - r));
      const cy = Math.max(y0 + r, Math.min(y + 0.5, y0 + h - r));
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      put(x, y, color, alpha * Math.max(0, Math.min(1, r + 0.7 - d)));
    }
  }
}

fillBackground();

for (let y = 42; y < 438; y += 36) {
  line(42, y, 438, y, 1, [42, 64, 82], 0.18);
}
for (let x = 42; x < 438; x += 36) {
  line(x, 42, x, 438, 1, [42, 64, 82], 0.18);
}

circle(240, 240, 174, [9, 20, 30], 0.9);
ring(240, 240, 174, 3, [42, 227, 179], 0.55);
ring(240, 240, 132, 2, [255, 136, 42], 0.34);
ring(240, 240, 91, 2, [118, 167, 255], 0.3);

line(142, 302, 214, 244, 15, [42, 227, 179], 0.92);
line(214, 244, 284, 272, 15, [42, 227, 179], 0.92);
line(284, 272, 344, 180, 15, [42, 227, 179], 0.92);

circle(142, 302, 26, [14, 31, 44], 1);
circle(142, 302, 17, [42, 227, 179], 1);
circle(214, 244, 27, [14, 31, 44], 1);
circle(214, 244, 18, [42, 227, 179], 1);
circle(284, 272, 27, [14, 31, 44], 1);
circle(284, 272, 18, [42, 227, 179], 1);
circle(344, 180, 28, [14, 31, 44], 1);
circle(344, 180, 19, [255, 136, 42], 1);

roundedRect(177, 143, 126, 168, 28, [234, 243, 255], 0.08);
roundedRect(199, 166, 82, 122, 20, [234, 243, 255], 0.14);
line(198, 329, 315, 142, 18, [255, 136, 42], 1);
line(190, 337, 307, 150, 5, [255, 242, 211], 0.72);

circle(240, 240, 54, [5, 12, 19], 0.72);
ring(240, 240, 54, 3, [234, 243, 255], 0.3);

const raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y += 1) {
  raw[y * (width * 4 + 1)] = 0;
  pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

writeFileSync(fileURLToPath(outPath), Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND'),
]));

console.log(`${fileURLToPath(outPath)} written from ${dirname(fileURLToPath(import.meta.url))}`);
