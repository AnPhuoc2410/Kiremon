// vite.config.base.ts
import { UserConfig } from "vite";
import react from "@vitejs/plugin-react"; // Hoặc plugin framework bạn dùng
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default (env: Record<string, string>): UserConfig => ({
  plugins: [
    react(),
    tsconfigPaths(), // Tự động map alias từ tsconfig.json
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
