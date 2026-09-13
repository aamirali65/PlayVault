export const HOUSE_EDGE = 0.01;

function hmacSha256(key: string, message: string): string {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const msgData = encoder.encode(message);

  const innerKey = new Uint8Array(64);
  const outerKey = new Uint8Array(64);

  for (let i = 0; i < 64; i++) {
    const k = i < keyData.length ? keyData[i] : 0x00;
    innerKey[i] = k ^ 0x36;
    outerKey[i] = k ^ 0x5c;
  }

  const innerMsg = new Uint8Array(innerKey.length + msgData.length);
  innerMsg.set(innerKey);
  innerMsg.set(msgData, innerKey.length);

  const innerHash = sha256Sync(innerMsg);

  const outerMsg = new Uint8Array(outerKey.length + innerHash.length);
  outerMsg.set(outerKey);
  outerMsg.set(innerHash, outerKey.length);

  return bytesToHex(sha256Sync(outerMsg));
}

function sha256Sync(data: Uint8Array): Uint8Array {
  const words = preprocess(data);
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const k = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];

  for (let i = 0; i < words.length; i += 16) {
    const w = new Array(64);
    for (let j = 0; j < 16; j++) {
      w[j] = (words[i + j] << 24) | (words[i + j + 1] << 16) | (words[i + j + 2] << 8) | words[i + j + 3];
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j-15], 7) ^ rotr(w[j-15], 18) ^ (w[j-15] >>> 3);
      const s1 = rotr(w[j-2], 17) ^ rotr(w[j-2], 19) ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let j = 0; j < 64; j++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;

      h = g; g = f; f = e; e = (d + t1) | 0;
      d = c; c = b; b = a; a = (t1 + t2) | 0;
    }

    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
  }

  return new Uint8Array([
    (h0>>24)&0xff, (h0>>16)&0xff, (h0>>8)&0xff, h0&0xff,
    (h1>>24)&0xff, (h1>>16)&0xff, (h1>>8)&0xff, h1&0xff,
    (h2>>24)&0xff, (h2>>16)&0xff, (h2>>8)&0xff, h2&0xff,
    (h3>>24)&0xff, (h3>>16)&0xff, (h3>>8)&0xff, h3&0xff,
    (h4>>24)&0xff, (h4>>16)&0xff, (h4>>8)&0xff, h4&0xff,
    (h5>>24)&0xff, (h5>>16)&0xff, (h5>>8)&0xff, h5&0xff,
    (h6>>24)&0xff, (h6>>16)&0xff, (h6>>8)&0xff, h6&0xff,
    (h7>>24)&0xff, (h7>>16)&0xff, (h7>>8)&0xff, h7&0xff,
  ]);
}

function rotr(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) | 0;
}

function preprocess(data: Uint8Array): number[] {
  const bitLen = data.length * 8;
  const padLen = (data.length + 9 + 63) & ~63;
  const padded = new Uint8Array(padLen);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(padLen - 4, bitLen >>> 0, false);
  return Array.from(padded);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateServerSeed(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytesToHex(bytes);
}

export function hashServerSeed(serverSeed: string): string {
  return hmacSha256("playvault-server", serverSeed);
}

export function generateResult(serverSeed: string, clientSeed: string, nonce: number): number {
  const hmac = hmacSha256(serverSeed, `${clientSeed}:${nonce}`);
  const hex8 = hmac.substring(0, 8);
  const uint32 = parseInt(hex8, 16);
  return uint32 / 0x100000000;
}

export function generateId(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytesToHex(bytes);
}
