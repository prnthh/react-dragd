import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.js': 'jsx',
    };
  },
  onSuccess: async () => {
    copyFileSync('src/index.d.ts', 'dist/index.d.ts');
  },
});
