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
import { type Account, betterAuth } from "better-auth";
import { anonymous, genericOAuth, username } from "better-auth/plugins";
import { authKV, db } from "./server/db.ts";
import { AuthKV } from "./server/auth/kv.ts";
import type { RedisClientType } from "redis";
import { providers } from "./server/auth/providers.ts";
import { getLocalIPs } from "./lib/utils.ts";
import { env } from "../deps.ts";
import { ulid } from "ulid";
import { APIError } from "better-call";

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
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },
  databaseHooks: { account: { create: { after: afterCreateAccount } } },
  hooks: {},
  emailAndPassword: {
    enabled: Deno.env.get("NODE_ENV") !== "production",
    minPasswordLength: 1,
  },
  plugins: [
    genericOAuth({ config: providers }),
    username({ minUsernameLength: 1 }),
    anonymous(),
  ],
  trustedOrigins: getLocalIPs().map((x) => `http://${x}:${env.PORT ?? 3000}`),
  advanced: { cookiePrefix: "splikan" },
});

export type Session = typeof auth.$Infer.Session;

async function afterCreateAccount(account: Account): Promise<void> {
  const user = await db.selectFrom("user")
    .selectAll()
    .innerJoin("account", "account.userId", "user.id")
    .where("account.id", "=", account.id)
    .executeTakeFirstOrThrow();

  const [studentId, schoolDomain] = user.email.split("@");

  let schoolId = await db.selectFrom("school")
    .select("id")
    .where("domain", "=", schoolDomain)
    .executeTakeFirst().then((x) => x?.id);

  if (typeof schoolId !== "number") {
    schoolId = await db.insertInto("school")
      .values({ domain: schoolDomain })
      .returning("id as id")
      .executeTakeFirstOrThrow().then((x) => x.id);
  }

  if (typeof schoolId !== "number") {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Error while creating your student",
    });
  }

  await db.insertInto("student")
    .values({
      hash: ulid(),
      student_id: studentId,
      school_id: schoolId,
      account_id: account.id,
    })
    .executeTakeFirstOrThrow();
}
