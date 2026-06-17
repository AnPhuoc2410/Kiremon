import { UserConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

export default (env: Record<string, string>): UserConfig => ({
  build: {
    target: "es2022", // Sinh mã JS hiện đại hơn giúp tối ưu tốc độ và dung lượng
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,
    cssMinify: true, // Nén CSS
    chunkSizeWarningLimit: 600, // Cảnh báo khi chunk vượt quá 600KB
    rollupOptions: {
      output: {
        // Định danh file kèm hash giúp tối ưu cơ chế browser caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // Tối ưu hóa phân tách chunk (manualChunks) tránh file bundle tổng quá nặng
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // Tách React core (chỉ react, react-dom, scheduler)
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/")
            ) {
              return "vendor-react-core";
            }
            // Tách React Router / React Router DOM
            if (
              id.includes("node_modules/react-router/") ||
              id.includes("node_modules/react-router-dom/")
            ) {
              return "vendor-react-router";
            }
            // Tách TanStack (Query, Router)
            if (id.includes("node_modules/@tanstack/")) {
              return "vendor-tanstack";
            }
            // Tách Supabase
            if (id.includes("node_modules/@supabase/")) {
              return "vendor-supabase";
            }
            // Tách React Joyride (thư viện hướng dẫn du lịch rất nặng)
            if (id.includes("node_modules/react-joyride/")) {
              return "vendor-joyride";
            }
            // Tách UI framework và icons
            if (
              id.includes("node_modules/@radix-ui/") ||
              id.includes("node_modules/@tabler/icons-react/") ||
              id.includes("node_modules/rpg-awesome/")
            ) {
              return "vendor-ui";
            }
            // Tách Recharts
            if (id.includes("node_modules/recharts/")) {
              return "vendor-charts";
            }
            // Tách các thư viện animation nặng
            if (
              id.includes("node_modules/framer-motion/") ||
              id.includes("node_modules/gsap/") ||
              id.includes("node_modules/animejs/")
            ) {
              return "vendor-animations";
            }
            // Tách lodash, date-fns
            if (
              id.includes("node_modules/lodash/") ||
              id.includes("node_modules/date-fns/")
            ) {
              return "vendor-utils";
            }
          }
        },
      },
    },
  },
  plugins: [
    // Gzip compression (dự phòng)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      verbose: false,
    }),
    // Brotli compression (hiệu năng nén cao hơn Gzip từ 15-20%)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      verbose: false,
    }),
    env.VITE_ANALYZE === "true" &&
      visualizer({
        filename: "./dist/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean) as any,
  esbuild: {
    drop: ["console", "debugger"], // Tự động loại bỏ console.log và debugger ở môi trường production
  },
});
