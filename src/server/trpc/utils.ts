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
  type inferProcedureBuilderResolverOptions,
  initTRPC,
  TRPCError,
} from "@trpc/server";
import type { Context } from "./context.ts";
import type { User } from "better-auth";
import { transformer } from "../../lib/trpc.ts";

interface Meta {
  authRequired: boolean;
  role?: "user" | "admin";
}

export const t = initTRPC.context<Context>().meta<Meta>().create({
  transformer,
});

export const { router, procedure, mergeRouters, createCallerFactory } = t;
export type ProcedureOptions = inferProcedureBuilderResolverOptions<
  typeof procedure
>;

export const authedProcedure = t.procedure.use(
  function isAuthed(opts): Promise<Context & ({ user: User })> {
    const { meta, ctx, next } = opts;
    if (meta?.authRequired && !ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { user: ctx.user } });
  },
).meta({
  authRequired: true,
  role: "user",
});

// export const loggedProcedure = procedure.use(async (opts) => {
//   const start = Date.now();
//
//   const result = await opts.next();
//
//   const durationMs = Date.now() - start;
//   const meta = { path: opts.path, type: opts.type, durationMs };
//
//   result.ok
//     ? console.log("OK request timing:", meta)
//     : console.error("Non-OK request timing", meta);
//
//   return result;
// });
