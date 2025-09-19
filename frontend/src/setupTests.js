import '@testing-library/jest-dom';

// Polyfill for TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;