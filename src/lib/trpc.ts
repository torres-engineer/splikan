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
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  loggerLink,
  splitLink,
} from "@trpc/client";
import { uneval } from "devalue";
import { default as superjson } from "superjson";
import type { AppRouter } from "../server/trpc/root.ts";
import type { TRPCCombinedDataTransformer } from "@trpc/server";
//import { env } from "../../deps.ts";

function getBaseUrl(): string {
  if (typeof globalThis.window !== "undefined") return "";

  if (Deno.env.get("NODE_ENV") === "production") return "https://example.com";
  //return `http://localhost:${env.PORT ?? 3000}`;
  return `http://localhost:3000`;
}

const url = `${getBaseUrl()}/api/trpc`;

export const transformer = {
  input: superjson,
  output: {
    serialize: (object: unknown) => uneval(object),
    // deno-lint-ignore no-eval
    deserialize: (object: unknown) => eval(`(${object})`),
  },
} satisfies TRPCCombinedDataTransformer;

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => isNonJsonSerializable(op.input),
      true: httpLink({ url, transformer }),
      false: httpBatchLink({ url, transformer }),
    }),
  ],
});
