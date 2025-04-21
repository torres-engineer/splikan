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
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "../../auth.ts";
import type { User } from "better-auth";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions): Promise<
  {
    req: Request;
    resHeaders: Headers;
    user?: User;
  }
> {
  const session = await auth.api.getSession(req);
  const user = session?.user;
  return { req, resHeaders, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
