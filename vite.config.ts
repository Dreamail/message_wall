import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  define: {
    "process.env": process.env,
  },
});
