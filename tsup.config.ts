import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  {
    entry: { 'adaptive-wcag': 'src/index.ts' },
    format: ['iife'],
    globalName: 'AdaptiveWCAG',
    footer: { js: 'if(typeof window!=="undefined"){window.AdaptiveWCAG=AdaptiveWCAG.default;}' },
    sourcemap: true,
    minify: true,
    outExtension: () => ({ js: '.min.js' }),
  },
]);
