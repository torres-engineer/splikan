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
import { type Kysely, sql } from "kysely";

import type { DB as InitialDB } from "./1743126287135_initial.ts";

export interface Account {
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  accountId: string;
  createdAt: string;
  id: string;
  idToken: string | null;
  password: string | null;
  providerId: string;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  scope: string | null;
  updatedAt: string;
  userId: string;
}

export interface User {
  createdAt: string;
  displayUsername: string | null;
  email: string;
  emailVerified: number;
  id: string;
  image: string | null;
  isAnonymous: number | null;
  name: string;
  updatedAt: string;
  username: string | null;
}

export interface Verification {
  createdAt: string | null;
  expiresAt: string;
  id: string;
  identifier: string;
  updatedAt: string | null;
  value: string;
}

export interface DB extends InitialDB {
  account: Account;
  user: User;
  verification: Verification;
}

const migrationFile = "better-auth_migrations/2025-04-21T01-12-43.027Z.sql";
export async function up(db: Kysely<InitialDB>): Promise<void> {
  await Deno.readTextFile(migrationFile).then((raw) => {
    for (const i of raw.split("\n\n")) {
      sql`${sql.raw(i)}`.execute(db);
    }
  });
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("verification").execute();
  await db.schema.dropTable("account").execute();
  await db.schema.dropTable("user").execute();
}
