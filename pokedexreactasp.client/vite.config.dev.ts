import { UserConfig } from "vite";

export default (env: Record<string, string>): UserConfig => ({
  server: {
    port: 2405,
    open: true,
    cors: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
  },
});
