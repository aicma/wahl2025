import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react, {reactCompilerPreset} from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import babel from "@rolldown/plugin-babel"

// https://vite.dev/config/
export default defineConfig({
  base: "https://aicma.github.io/wahl2025/",
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/csv-proxy": {
        target: "https://www.bundeswahlleiterin.de",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/csv-proxy/, ""),
      },
    },
  },
})
