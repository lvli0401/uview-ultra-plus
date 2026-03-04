import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    plugins: [uni()],
    server: {
      port: 5175
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.nvue', '.uts']
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import", "legacy-js-api"]
        }
      }
    }
  }
});
