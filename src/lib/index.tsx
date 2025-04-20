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
import { query } from "@solidjs/router";
import { sql } from "kysely";
import { db } from "~/server/db";

export const getClassStats = query(() => {
  "use server";
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  return db
    .selectFrom("class")
    .innerJoin("student_class", "student_class.class_id", "class.id")
    .select([
      sql<number>`COUNT(DISTINCT class.id)`.as("completed_classes"),
      sql<number>`COUNT(DISTINCT student_class.student_id)`.as(
        "students_tutored",
      ),
      sql<number>`SUM(DISTINCT (julianday("to") - julianday("from")) * 24)`.as(
        "hours_tutored",
      ),
    ])
    .where("class.accepted", "=", 1)
    .where("class.to", "<", now)
    .executeTakeFirst()
    .then((x) => ({
      completed_classes: x?.completed_classes ?? 0,
      students_tutored: x?.students_tutored ?? 0,
      hours_tutored: Math.round(x?.hours_tutored ?? 0),
    }));
}, "class-stats");

export const getActiveTutors = query((): Promise<number> => {
  "use server";

  return db.selectFrom("tutor")
    .select(({ fn }) => [fn.count<number>("id").as("count")])
    .where("pause", "=", 0)
    .executeTakeFirst()
    .then((x) => x?.count ?? 0);
}, "active-tutors");
