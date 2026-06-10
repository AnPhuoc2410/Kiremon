import { UserConfig } from "vite";

export default (env: Record<string, string>): UserConfig => {
  const backendUrl = env.VITE_API_BASE_URL || "https://localhost:7051/api";
  let backendOrigin = backendUrl;
  try {
    backendOrigin = new URL(backendUrl).origin;
  } catch (e) {
    // fallback
  }

  return {
    server: {
      port: 3000,
      open: true,
      cors: true,
      strictPort: true,
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
        "/hubs": {
          target: backendOrigin,
          ws: true,
          secure: false,
          changeOrigin: true,
        },
      },
    },
    build: {
      sourcemap: true,
    },
  };
};
