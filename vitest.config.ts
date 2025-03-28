/// <reference types="vitest/config" />
import { default as solid } from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    reporters: ["verbose", "json", "html"].concat(
      Deno.env.get("GITHUB_ACTIONS") ? ["github-actions"] : [],
    ),
    outputFile: {
      json: "./test_report/json-report.json",
      html: "./test_report/html-report.html",
    },
  },
  plugins: [solid()],
  resolve: {
    conditions: ["development", "browser"],
  },

  define: {
    "import.meta.vitest": "undefined",
  },
});
