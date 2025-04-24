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
import { type RouteSectionProps, useLocation } from "@solidjs/router";
import { createMemo, type JSX, Show } from "solid-js";
import { DocsSidebar } from "~/components/DocsSidebar";
import { Footer } from "~/components/Footer";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function DocsLayout(props: RouteSectionProps): JSX.Element {
  const location = useLocation();
  const pathname = () => location.pathname;
  const path = createMemo(() =>
    pathname().substring("/docs/".length).split("/").filter((i) => i.length > 0)
  );

  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs/">Documentation</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/docs/about/${path()[0] === "about" ? "" : path()[0]}`}
                >
                  {(path()[0] === "about" ? "" : path()[0])?.replace(
                    /[-_]/g,
                    " ",
                  )?.replace(/\b\w/g, (l) => l.toUpperCase())}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <Show when={path().length > 1}>
                <Show when={path().length > 3}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                </Show>
                <Show when={path().length > 2}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={pathname.replace(/\/.*$/, "")}>
                      {path()[path().length - 2].replace(/[-_]/g, " ").replace(
                        /\b\w/g,
                        (l) => l.toUpperCase(),
                      )}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Show>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink current>
                    {path()[path().length - 1].replace(/[-_]/g, " ").replace(
                      /\b\w/g,
                      (l) => l.toUpperCase(),
                    )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Show>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main class="flex flex-1 flex-col gap-4 p-4">
          {props.children}
        </main>
        <Separator />
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
