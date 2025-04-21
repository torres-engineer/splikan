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
import { QueryClient, queryOptions } from "@tanstack/solid-query";
import { sql } from "kysely";
import type { Props as AchievementsProps } from "../components/Achievements.tsx";
import { db } from "../server/db.ts";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { experimental_prefetchInRender: true } },
});

function getStats(): Promise<AchievementsProps> {
  "use server";
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  return db
    .selectFrom(["class", "tutor"])
    .innerJoin("student_class", "student_class.class_id", "class.id")
    .select([
      sql<number>`COUNT(DISTINCT class.id)`.as("completed_classes"),
      sql<number>`COUNT(DISTINCT tutor.id)`.as("active_tutors"),
      sql<number>`COUNT(DISTINCT student_class.student_id)`.as(
        "students_tutored",
      ),
      sql<number>`SUM(DISTINCT (julianday("to") - julianday("from")) * 24)`
        .as(
          "hours_of_tutoring",
        ),
    ])
    .where("class.accepted", "=", 1)
    .where("class.to", "<", now)
    .where("tutor.pause", "=", 0)
    .executeTakeFirst()
    .then((x) => ({
      completedClasses: x?.completed_classes ?? 0,
      studentsTutored: x?.students_tutored ?? 0,
      activeTutors: x?.active_tutors ?? 0,
      hoursOfTutoring: Math.round(x?.hours_of_tutoring ?? 0),
    }));
}
export const getStatsOptions = queryOptions({
  queryKey: ["stats"],
  queryFn: getStats,
  deferStream: true,
  throwOnError: true,
});
