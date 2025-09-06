require('@testing-library/jest-dom');

// Mock ResizeObserver for MUI DataGrid in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserverMock;
}

// Polyfill TextEncoder/TextDecoder for libraries that expect Web APIs
try {
  if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('node:util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
} catch {}

// Ensure Web Crypto API is available (used by some hashing utilities)
try {
  if (typeof global.crypto === 'undefined' || !global.crypto.subtle) {
    const { webcrypto } = require('node:crypto');
    global.crypto = webcrypto;
  }
} catch {}

