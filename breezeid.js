// Browser-compatible crypto: use Web Crypto API in browsers, Node.js crypto in Node.js
const getRandomBytes = (() => {
  // Check if we're in a browser environment
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    // Browser: use Web Crypto API
    return (size) => {
      const arr = new Uint8Array(size);
      window.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.getRandomValues
  ) {
    // Browser/Web Worker: use Web Crypto API from globalThis
    return (size) => {
      const arr = new Uint8Array(size);
      globalThis.crypto.getRandomValues(arr);
      return arr;
    };
  } else {
    // Node.js: use crypto module
    const crypto = require("node:crypto");
    return (size) => {
      return crypto.randomBytes(size);
    };
  }
})();

const charset = "AEIUQWTYPSDFGRHJKLZXCVBNM2346789";
const { profanities } = require("./profanities");

const poolSize = 16 * 8; // default id length * 8 = 128
let pool;
let poolIndex = 0;

fillPool();
function fillPool() {
  pool = getRandomBytes(poolSize);
}

function hasProfanity(input) {
  return profanities.some(function (v) {
    return input.toLowerCase().indexOf(v) >= 0;
  });
}

function breezeid(length = 4 * 4) {
  if (length > poolSize) {
    throw new Error(
      `breezeid: Max ID length (${poolSize}) exceeded. Increase the pool size in source.`
    );
  }

  return insertHyphens(genChars(length));
}

function genChars(length) {
  let result = "";

  // if amount to generate exceeds pool size, refill the pool
  if (poolIndex + length >= pool.length) {
    fillPool();
    poolIndex = 0;
  }

  for (let i = 0; i < length; i++) {
    result += charset[pool[poolIndex] % charset.length];
    poolIndex++;
  }
  return result;
}

function insertHyphens(input, every = 4, joinBy = "-") {
  let result = [];
  let position = 0;
  for (let index = 0; index < input.length / every; index++) {
    let fragment = input.slice(position, position + every);
    if (hasProfanity(fragment)) {
      fragment = genChars(fragment.length);
      if (hasProfanity(fragment)) {
        fragment = fragment.split("").toReversed().join("");
      }
    }

    result.push(fragment);

    position += every;
  }
  return result.join(joinBy);
}

module.exports = { breezeid, BreezeID: breezeid };
