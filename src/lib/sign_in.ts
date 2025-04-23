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
import type { User } from "better-auth";
import { authClient } from "./auth.ts";
import { queryClient, trpc } from "./trpc.ts";

type Providers = Parameters<typeof authClient.signIn.oauth2>[0]["providerId"];
type SignInUsernameFetchOptions = Parameters<
  typeof authClient.signIn.username
>[1];
type SignUpEmailFetchOptions = Parameters<typeof authClient.signUp.email>[1];
type SignInFetchOptions = SignInUsernameFetchOptions | SignUpEmailFetchOptions;
type SignOutFetchOptions = Parameters<typeof authClient.signOut>[1];

export async function signIn(
  provider: Providers | { username: string } | "anonymous",
  fetchOptions: SignInFetchOptions = {},
): Promise<{ token: string | null; user: User } | undefined> {
  if (typeof provider !== "string") {
    const { username } = provider;
    const { data, error } = await authClient.signIn.username({
      username,
      password: username,
    }, fetchOptions);

    if (error === null) {
      queryClient.invalidateQueries({ queryKey: trpc.student.pathKey() });

      return data;
    }

    {
      const { data, error } = await authClient.signUp.email({
        email: `${username}@localhost.localdomain`,
        name: username,
        password: username,
        username,
      }, fetchOptions);

      if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: trpc.student.pathKey() });

      return data;
    }
  } else if (provider === "anonymous") {
    const { data, error } = await authClient.signIn.anonymous();

    if (error) {
      throw error;
    }
    queryClient.invalidateQueries({ queryKey: trpc.student.pathKey() });

    return data;
  } else {
    const { error } = await authClient.signIn.oauth2({
      providerId: provider,
      callbackURL: "/",
    });
    if (error) {
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: trpc.student.pathKey() });
  }
}

export async function signOut(
  fetchOptions: SignOutFetchOptions = {},
): Promise<boolean> {
  const { data, error } = await authClient.signOut({}, fetchOptions);

  if (error !== null) {
    throw error;
  }

  queryClient.invalidateQueries({ queryKey: trpc.student.pathKey() });

  return data.success;
}
