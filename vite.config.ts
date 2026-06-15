import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 코어
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI 라이브러리
          'vendor-radix': [
            '@radix-ui/react-dialog', '@radix-ui/react-accordion',
            '@radix-ui/react-tabs', '@radix-ui/react-select',
            '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip',
          ],
          // 차트/데이터
          'vendor-charts': ['recharts'],
          // 폼/검증
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // 상태 관리
          'vendor-state': ['zustand', '@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
}));
