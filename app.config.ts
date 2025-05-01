/**
 * Splikan - S2S (Student-to-Student) peer tutoring made easy!
 * Copyright (C) 2025  Joao Augusto Costa Branco Marado Torres
 * <torres.dev@disroot.org>
 *
 * This file is part of Splikan.
 *
 * Splikan is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * Splikan is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Splikan.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  defineConfig,
  type ViteCustomizableConfig,
} from "@solidjs/start/config";
import { default as Inspect } from "vite-plugin-inspect";
import { default as tailwindcss } from "@tailwindcss/vite";

export default defineConfig({
  server: {
    preset: "deno_server",
    logLevel: 999,
    compatibilityDate: "2025-04-18",
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
    plugins: [],
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
