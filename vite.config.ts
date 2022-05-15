import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { VarletUIResolver } from "unplugin-vue-components/resolvers";
import styleImport, { VantResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VarletUIResolver()],
    }),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
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
