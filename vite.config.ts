import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// @ts-ignore
import componentTagger from 'vite-plugin-component-tagger';

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

export default defineConfig(({ mode }) => ({
  base: '/',
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__dirname, '.'),
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'index.html'),
        path.resolve(__dirname, 'public'),
      ],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        format: 'esm'
      }
    },
    sourcemap: true,
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      target: 'esnext',
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx'
      }
    }
  },
  esbuild: {
    target: 'esnext',
    loader: 'tsx'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    '__VITE_IS_MODERN__': 'true'
  },
  preview: {
    port: 8080,
    strictPort: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
}));
