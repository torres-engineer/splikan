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

type InitialDB = Record<string | number | symbol, never>;
import type { ColumnType } from "kysely";
import type { Buffer } from "../deps.ts";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Block {
  "blocked_by_id": number;
  "blocked_id": number;
}

export interface Class {
  accepted: Generated<number>;
  from: string;
  hash: string;
  id: Generated<number | null>;
  "location_id": number;
  "max_students": string;
  pass: Buffer | null;
  private: number;
  to: string;
  "tutor_id": number;
}

export interface Degree {
  code: string | null;
  id: Generated<number | null>;
  name: string;
  "school_id": number;
  "type_id": number;
}

export interface DegreeType {
  id: Generated<number | null>;
  name: string;
}

export interface Location {
  id: Generated<number | null>;
  latitude: string;
  longitude: string;
  name: string;
  "tutor_id": number;
}

export interface School {
  domain: string;
  id: Generated<number | null>;
}

export interface Student {
  hash: string;
  id: Generated<number | null>;
  name: string;
  "profile_pic": Buffer | null;
  "school_id": number;
  "student_id": string;
  "updated_at": Generated<string>;
}

export interface StudentClass {
  "class_id": number;
  "student_id": number;
}

export interface StudentReview {
  comment: string;
  rating: number;
  "student_id": number;
  "tutor_id": number;
  "tutor_response": string | null;
}

export interface StudyArea {
  "group_id": number;
  id: Generated<number | null>;
  name: string;
}

export interface StudyAreaGroup {
  id: Generated<number | null>;
  name: string;
}

export interface Tutor {
  "curriculum_vitae": string | null;
  "degree_id": number | null;
  description: string | null;
  gpa: string | null;
  id: Generated<number | null>;
  "max_students_per_class": string | null;
  pause: Generated<number>;
  price: string | null;
  "price_currency": Generated<string>;
  "price_unit": Generated<string>;
  "student_id": number;
}

export interface TutorReview {
  comment: string;
  rating: number;
  "student_id": number;
  "tutor_id": number;
}

export interface TutorStudyArea {
  "study_area_id": number;
  "tutor_id": number;
}

export interface UnavailableBlock {
  from: string;
  id: Generated<number | null>;
  repeat: string | null;
  "repeat_on": string | null;
  "repeat_unit": string | null;
  to: string;
  "tutor_id": number;
  until: string | null;
}

export interface DB {
  block: Block;
  class: Class;
  degree: Degree;
  "degree_type": DegreeType;
  location: Location;
  school: School;
  student: Student;
  "student_class": StudentClass;
  "student_review": StudentReview;
  "study_area": StudyArea;
  "study_area_group": StudyAreaGroup;
  tutor: Tutor;
  "tutor_review": TutorReview;
  "tutor_study_area": TutorStudyArea;
  "unavailable_block": UnavailableBlock;
}

export async function up(db: Kysely<InitialDB>): Promise<void> {
  await db.schema.createTable("school")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("domain", "text", (col) => col.unique().notNull())
    .execute();
  await db.schema.createIndex("school_domain_unique_index")
    .on("school")
    .columns(["domain"])
    .execute();
  await db.schema.createTable("degree_type")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "text", (col) => col.notNull().unique())
    .execute();
  await db.schema.createTable("degree")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("code", "text", (col) => col.unique())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn(
      "school_id",
      "integer",
      (col) => col.notNull().references("school.id").onDelete("cascade"),
    )
    .addColumn(
      "type_id",
      "integer",
      (col) => col.notNull().references("degree_type.id").onDelete("set null"),
    )
    .execute();
  await db.schema.createIndex("degree_unique_index")
    .on("degree")
    .columns(["code", "name"])
    .execute();
  await db.schema.createTable("student")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("hash", "uuid", (col) => col.unique().notNull())
    .addColumn("student_id", "text", (col) => col.notNull())
    .addColumn(
      "school_id",
      "integer",
      (col) => col.notNull().references("school.id").onDelete("cascade"),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("profile_pic", "blob")
    .addColumn(
      "updated_at",
      "datetime",
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addUniqueConstraint("unique_school_student", ["student_id", "school_id"])
    .execute();
  await db.schema.createIndex("student_unique_index")
    .on("student")
    .columns(["student_id", "school_id"])
    .execute();
  await db.schema.createTable("tutor")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn(
      "student_id",
      "integer",
      (col) =>
        col.notNull().references("student.id").unique().onDelete("cascade"),
    )
    .addColumn(
      "degree_id",
      "integer",
      (col) => col.references("degree.id").onDelete("set null"),
    )
    .addColumn("price", "float4", (col) => col.unsigned())
    .addColumn("price_unit", "text", (col) => col.notNull().defaultTo(sql`"h"`))
    .addColumn(
      "price_currency",
      "text",
      (col) => col.notNull().defaultTo(sql`"EUR"`),
    )
    .addColumn("max_students_per_class", "integer", (col) => col.unsigned())
    .addColumn("gpa", "integer", (col) => col.unsigned())
    .addColumn("description", "text")
    .addColumn("curriculum_vitae", "text")
    .addColumn("pause", "boolean", (col) => col.notNull().defaultTo(sql`1`))
    .execute();
  await db.schema.createTable("study_area_group")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "text", (col) => col.notNull().unique())
    .execute();
  await db.schema.createTable("study_area")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "text", (col) => col.notNull().unique())
    .addColumn(
      "group_id",
      "integer",
      (col) =>
        col.notNull().references("study_area_group.id").onDelete("set null"),
    )
    .execute();
  await db.schema.createTable("unavailable_block")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn(
      "tutor_id",
      "integer",
      (col) => col.notNull().references("tutor.id").onDelete("cascade"),
    )
    .addColumn("from", "datetime", (col) => col.notNull())
    .addColumn("to", "datetime", (col) => col.notNull())
    .addColumn("until", "datetime")
    .addColumn("repeat", "integer", (col) => col.unsigned())
    .addColumn("repeat_unit", "text")
    .addColumn("repeat_on", "integer", (col) => col.unsigned())
    .execute();
  await db.schema.createTable("location")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn(
      "tutor_id",
      "integer",
      (col) => col.notNull().references("tutor.id").onDelete("cascade"),
    )
    .addColumn("latitude", "float4", (col) => col.notNull())
    .addColumn("longitude", "float4", (col) => col.notNull())
    .execute();
  await db.schema.createTable("class")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("hash", "uuid", (col) => col.unique().notNull())
    .addColumn("private", "boolean", (col) => col.notNull())
    .addColumn("pass", "blob")
    .addColumn("from", "datetime", (col) => col.notNull())
    .addColumn("to", "datetime", (col) => col.notNull())
    .addColumn("max_students", "integer", (col) => col.notNull().unsigned())
    .addColumn("accepted", "boolean", (col) => col.notNull().defaultTo(sql`0`))
    .addColumn(
      "tutor_id",
      "integer",
      (col) => col.notNull().references("tutor.id").onDelete("set null"),
    )
    .addColumn(
      "location_id",
      "integer",
      (col) => col.notNull().references("location.id").onDelete("restrict"),
    )
    .execute();
  await db.schema.createTable("tutor_review")
    .addColumn("rating", "integer", (col) => col.notNull())
    .addColumn("comment", "text", (col) => col.notNull())
    .addColumn(
      "tutor_id",
      "integer",
      (col) => col.notNull().references("tutor.id").onDelete("cascade"),
    )
    .addColumn(
      "student_id",
      "integer",
      (col) => col.notNull().references("student.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("primary_key", ["tutor_id", "student_id"])
    .execute();
  await db.schema.createTable("student_review")
    .addColumn("rating", "integer", (col) => col.notNull())
    .addColumn("comment", "text", (col) => col.notNull())
    .addColumn("tutor_response", "text")
    .addColumn(
      "tutor_id",
      "integer",
      (col) => col.notNull().references("tutor.id").onDelete("cascade"),
    )
    .addColumn(
      "student_id",
      "integer",
      (col) => col.notNull().references("student.id").onDelete("set null"),
    )
    .addPrimaryKeyConstraint("primary_key", ["tutor_id", "student_id"])
    .execute();
  await db.schema.createTable("block")
    .addColumn(
      "blocked_by_id",
      "integer",
      (col) => col.notNull().references("student.id").onDelete("cascade"),
    )
    .addColumn(
      "blocked_id",
      "integer",
      (col) => col.notNull().references("student.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("primary_key", ["blocked_by_id", "blocked_id"])
    .execute();
  await db.schema.createTable("student_class")
    .addColumn(
      "student_id",
      "integer",
      (col) => col.notNull().references("student.id").onDelete("cascade"),
    )
    .addColumn(
      "class_id",
      "integer",
      (col) => col.notNull().references("class.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("primary_key", ["student_id", "class_id"])
    .execute();
  await db.schema.createTable("tutor_study_area")
    .addColumn(
      "tutor_id",
      "integer",
      (col) => col.notNull().references("tutor.id").onDelete("cascade"),
    )
    .addColumn(
      "study_area_id",
      "integer",
      (col) => col.notNull().references("study_area.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("primary_key", ["tutor_id", "study_area_id"])
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("tutor_study_area").execute();
  await db.schema.dropTable("student_class").execute();
  await db.schema.dropTable("block").execute();
  await db.schema.dropTable("student_review").execute();
  await db.schema.dropTable("tutor_review").execute();
  await db.schema.dropTable("class").execute();
  await db.schema.dropTable("location").execute();
  await db.schema.dropTable("unavailable_block").execute();
  await db.schema.dropTable("study_area").execute();
  await db.schema.dropTable("study_area_group").execute();
  await db.schema.dropTable("tutor").execute();
  await db.schema.dropTable("student").execute();
  await db.schema.dropTable("degree").execute();
  await db.schema.dropTable("degree_type").execute();
  await db.schema.dropTable("school").execute();
}
