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

import type { DB as InitialDB } from "./1745131434964_better-auth_migrations.ts";
import type { DB } from "kysely-codegen";
export type { DB };

export async function up(db: Kysely<InitialDB>): Promise<void> {
  await db.schema.createTable("student_new")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("hash", "uuid", (col) => col.unique().notNull())
    .addColumn("student_id", "text", (col) => col.notNull())
    .addColumn(
      "school_id",
      "integer",
      (col) => col.notNull().references("school.id").onDelete("cascade"),
    )
    .addColumn(
      "account_id",
      "text",
      (col) => col.notNull().references("account.id"),
    )
    .addUniqueConstraint("unique_school_student", ["student_id", "school_id"])
    .execute();
  await db.insertInto("student_new")
    .columns(["id", "hash", "student_id", "school_id", "account_id"])
    .expression((eb) =>
      eb.selectFrom("student")
        .innerJoin("school", "student.school_id", "school.id")
        .innerJoin(
          "user",
          (join) =>
            join.on(
              "user.email",
              "=",
              sql`
                student.student_id || '@' || school.domain
              `,
            ),
        )
        .innerJoin("account", "account.userId", "user.id")
        .select([
          "student.id",
          "student.hash",
          "student.student_id",
          "student.school_id",
          "account.id as account_id",
        ])
    )
    .execute();
  await db.schema.dropTable("student").execute();
  await db.schema.alterTable("student_new").renameTo("student").execute();
  await db.schema.createIndex("student_unique_index")
    .on("student")
    .columns(["student_id", "school_id"])
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.createTable("student_old")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("hash", "uuid", (col) => col.unique().notNull())
    .addColumn("student_id", "text", (col) => col.notNull())
    .addColumn(
      "school_id",
      "integer",
      (col) => col.notNull().references("school.id").onDelete("cascade"),
    )
    .addUniqueConstraint("unique_school_student", ["student_id", "school_id"])
    .execute();
  await db.insertInto("student_old")
    .columns(["id", "hash", "student_id", "school_id"])
    .expression((eb) =>
      eb.selectFrom("student").select([
        "id",
        "hash",
        "student_id",
        "school_id",
      ])
    )
    .execute();
  await db.schema.dropTable("student").execute();
  await db.schema.alterTable("student_old").renameTo("student").execute();
  await db.schema.createIndex("student_unique_index")
    .on("student")
    .columns(["student_id", "school_id"])
    .execute();
}
