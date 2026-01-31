import { defineConfig, loadEnv, mergeConfig } from "vite";
import baseConfig from "./vite.config.base";
import devConfig from "./vite.config.dev";
import prodConfig from "./vite.config.prod";

export default defineConfig(({ command, mode }) => {
  // Load toàn bộ env vars (bao gồm cả prefix VITE_)
  const env = loadEnv(mode, process.cwd(), "");

  const isDev = mode === "development";

  // Chọn config dựa trên mode
  const envConfig = isDev ? devConfig(env) : prodConfig(env);

  // Merge Base Config với Environment Config
  // Base config được ưu tiên thấp hơn, Env config sẽ override
  return mergeConfig(baseConfig(env), envConfig);
});
