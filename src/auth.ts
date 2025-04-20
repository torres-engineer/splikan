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
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { authKV, db } from "./server/db.ts";
import { AuthKV } from "./server/auth/kv.ts";
import type { RedisClientType } from "redis";
import { genericOAuth } from "better-auth/plugins";
import { providers } from "./server/auth/providers.ts";

export const auth = betterAuth({
  database: {
    db,
    type: "sqlite",
  },
  secondaryStorage: new AuthKV(authKV as RedisClientType),
  session: {
    additionalFields: {
      lang: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
  databaseHooks: {},
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    genericOAuth({ config: providers }),
    username(),
  ],
});

export type Session = typeof auth.$Infer.Session;
