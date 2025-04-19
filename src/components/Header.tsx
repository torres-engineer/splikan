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
import { A } from "@solidjs/router";
import { Logo } from "./Logo";
import { type JSX, Show } from "solid-js";
import { cn } from "~/lib/utils";

export interface Props {
  showSlogan?: boolean;
}

export function Header({ showSlogan }: Props): JSX.Element {
  return (
    <header class="m-4 flex flex-col justify-center items-center gap-2">
      <div
        class={cn(
          "contents",
          "sm:flex sm:self-start sm:items-baseline sm:gap-2",
        )}
      >
        <A href="/">
          <h1 class={cn("text-4xl/snug", "md:text-6xl")}>
            <Logo />
          </h1>
        </A>
        <Show when={showSlogan ?? true}>
          <p
            class={cn(
              "text-2xl/snug font-bold text-pretty text-center",
              "sm:text-start sm:before:content-[',_']",
              "lg:text-4xl",
            )}
          >
            <abbr title="Student-to-Student">S2S</abbr> peer tutoring made easy!
          </p>
        </Show>
      </div>
    </header>
  );
}
