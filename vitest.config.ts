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
