
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    assetsInlineLimit: 0, // Don't inline small files as base64
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Configure sql.js correctly for export/import to work
      output: {
        manualChunks: {
          'sql.js': ['sql.js'],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/sql.js/dist/sql-wasm.wasm',
          dest: 'assets'
        }
      ]
    })
  ].filter(Boolean),
  optimizeDeps: {
    include: ['sql.js'], // Include sql.js in optimization to ensure it's bundled correctly
    esbuildOptions: {
      // Avoid "default export is not available" issues
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
