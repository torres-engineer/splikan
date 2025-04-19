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
import type { JSX } from "solid-js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

export function CopyrightNotice(): JSX.Element {
  return (
    <div class="flex flex-col gap-2 *:text-sm *:text-center">
      <p>
        <Logo /> Copyright &copy; 2025{"  "}
        <a href="https://github.com/torres-engineer">
          Jo&atilde;o Augusto Costa Branco Marado Torres
        </a>{" "}
        <a href="mailto:torres.dev@disroot.org">
          &lt;torres.dev@disroot.org&gt;
        </a>.
      </p>
      <p>
        <Logo />{" "}
        comes with ABSOLUTELY NO WARRANTY. This is free software, and you are
        welcome to redistribute it under certain conditions.<br />
        <AlertDialog>
          <AlertDialogTrigger as={Button} variant="link">
            Click here for details
          </AlertDialogTrigger>
          <AlertDialogContent class="max-w-[96lvw]">
            <AlertDialogTitle>License notice</AlertDialogTitle>
            <AlertDialogDescription class="[&>p]:m-2">
              <BiggerNotice />
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      </p>
    </div>
  );
}

function BiggerNotice(): JSX.Element {
  return (
    <>
      <p>
        Splikan - <abbr title="Student-to-Student">S2S</abbr>{" "}
        peer tutoring made easy!<br />
        Copyright &copy; 2025 Jo&atilde;o Augusto Costa Branco Marado Torres
        {" "}
        <a href="mailto:torres.dev@disroot.org">
          &lt;torres.dev@disroot.org&gt;
        </a>.
      </p>

      <p>
        This program is free software: you can redistribute it and/or modify it
        under the terms of the GNU Affero General Public License as published by
        the Free Software Foundation, either version 3 of the License, or (at
        your option) any later version.
      </p>

      <p>
        This program is distributed in the hope that it will be useful, but
        WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
        General Public License for more details.
      </p>

      <p>
        You should have received a copy of the GNU Affero General Public License
        along with this program. If not, see{" "}
        <a href="https://www.gnu.org/licenses/">
          &lt;https://www.gnu.org/licenses/&gt;
        </a>.
      </p>
    </>
  );
}
