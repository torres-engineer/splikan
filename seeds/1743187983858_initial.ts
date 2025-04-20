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
import type { Kysely } from "kysely";
import type { DB } from "../migrations/1743126287135_initial.ts";

export async function seed(db: Kysely<DB>): Promise<void> {
  await Promise.allSettled([
    db.insertInto("degree_type").values([
      { name: "Associate" },
      { name: "Bachelor" },
      { name: "Master" },
      { name: "Doctorate" },
    ]).execute(),
    await db.transaction().execute(async (trx) => {
      // based on <https://certifica.dgert.gov.pt/legislacao/cnaef-classificacao-nacional-de-areas-de-educacao-e-formacao.aspx>
      await trx.insertInto("study_area_group").values([
        { id: 0, name: "General programs" },
        { id: 1, name: "Education" },
        { id: 2, name: "Arts and humanities" },
        { id: 3, name: "Social sciences, commerce and law" },
        { id: 4, name: "Science, mathematics and computer science" },
        {
          id: 5,
          name: "Engineering, manufacturing industries and construction",
        },
        { id: 6, name: "Agriculture" },
        { id: 7, name: "Health and social protection" },
        { id: 8, name: "Services" },
        { id: 9, name: "Unknown or unspecified" },
      ]).execute();
      await trx.insertInto("study_area").values([
        { id: 1, group_id: 0, name: "Basic programs" },
        { id: 8, group_id: 0, name: "Literacy" },
        { id: 9, group_id: 0, name: "Personal development" },
        {
          id: 14,
          group_id: 1,
          name: "Training of teachers/trainers and educational sciences",
        },
        { id: 21, group_id: 2, name: "Arts" },
        { id: 22, group_id: 2, name: "Humanities" },
        { id: 31, group_id: 3, name: "Social and behavioral sciences" },
        { id: 32, group_id: 3, name: "Information and journalism" },
        { id: 34, group_id: 3, name: "Business sciences" },
        { id: 38, group_id: 3, name: "Law" },
        { id: 42, group_id: 4, name: "Life sciences" },
        { id: 44, group_id: 4, name: "Physical sciences" },
        { id: 46, group_id: 4, name: "Mathematics and statistics" },
        { id: 48, group_id: 4, name: "Computer science" },
        { id: 52, group_id: 5, name: "Engineering and related techniques" },
        { id: 54, group_id: 5, name: "Manufacturing industries" },
        { id: 58, group_id: 5, name: "Architecture and construction" },
        { id: 62, group_id: 6, name: "Agriculture, forestry and fishing" },
        { id: 64, group_id: 6, name: "Veterinary sciences" },
        { id: 72, group_id: 7, name: "Health" },
        { id: 76, group_id: 7, name: "Social services" },
        { id: 82, group_id: 8, name: "Personal Services" },
        { id: 84, group_id: 8, name: "Transport services" },
        { id: 86, group_id: 8, name: "Environmental protection" },
        { id: 88, group_id: 8, name: "Security Services" },
        { id: 99, group_id: 9, name: "Unknown or unspecified" },
      ]).execute();
    }),
  ]);
}
