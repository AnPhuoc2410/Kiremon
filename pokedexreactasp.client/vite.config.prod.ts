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
        // Chỉ tách các thư viện độc lập không phụ thuộc vào React để tránh lỗi khởi tạo chéo (TDZ/CommonJS)
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // Tách Supabase
            if (id.includes("node_modules/@supabase/")) {
              return "vendor-supabase";
            }
            // Tách các thư viện Animation thuần (GSAP, AnimeJS)
            if (
              id.includes("node_modules/gsap/") ||
              id.includes("node_modules/animejs/")
            ) {
              return "vendor-animations";
            }
            // Tách các thư viện tiện ích (lodash, date-fns)
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
