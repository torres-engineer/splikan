import {
  defineConfig,
  type ViteCustomizableConfig,
} from "@solidjs/start/config";
import { default as Inspect } from "vite-plugin-inspect";
import { default as tailwindcss } from "@tailwindcss/vite";

export default defineConfig({
  solid: {},
  server: {
    preset: "deno_server",
    //logLevel: 999,
    compatibilityDate: "2025-02-22",
    experimental: {
      openAPI: undefined,
      wasm: undefined,
    },
    future: {},
    storage: {},
    timing: true,
    serveStatic: "deno",
    publicAssets: [],
    compressPublicAssets: true,
    prerender: {
      routes: [],
      crawlLinks: false,
    },
    minify: false,
    node: false,
    analyze: {},
  },
  middleware: "src/middleware/index.ts",
  experimental: {
    islands: undefined,
  },
  vite({ router }): ViteCustomizableConfig {
    switch (router) {
      case "server":
      case "client":
      case "server-function":
    }
    return {
      define: {
        "import.meta.env.ENV": JSON.stringify(Deno.env.get("NODE_ENV")),
      },
      plugins: [
        Inspect({
          build: true,
          outputDir: ".vite-inspect",
        }),
        tailwindcss(),
      ],
      html: {
        //cspNonce: "",
      },
      css: {
        devSourcemap: true,
        transformer: "postcss",
      },
      assetsInclude: undefined,
      // logLevel: Deno.env.get("NODE_ENV") === "production" ? "silent" : "info",
    };
  },
  devOverlay: Deno.env.get("NODE_ENV") !== "production",
});
