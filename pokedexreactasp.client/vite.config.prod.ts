import { UserConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

export default (env: Record<string, string>): UserConfig => ({
  build: {
    target: "es2015",
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react"; // Tách React core ra riêng
            }
            if (id.includes("lodash") || id.includes("date-fns")) {
              return "vendor-utils";
            }
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    // Gzip compression (tăng tốc tải trang)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    env.VITE_ANALYZE === "true" &&
      visualizer({
        filename: "./dist/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
});
