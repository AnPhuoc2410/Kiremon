import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Production config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            // React ecosystem
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            // Emotion
            if (id.includes("@emotion")) {
              return "vendor-emotion";
            }
            // Radix UI
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            // Tabler icons
            if (id.includes("@tabler/icons")) {
              return "vendor-icons";
            }
            // Animation libraries
            if (id.includes("animejs") || id.includes("lottie")) {
              return "vendor-animation";
            }
            // Other vendors
            return "vendor-others";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
  },
  publicDir: "public",
});
