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
import { type ComponentProps, For, type JSX, Show } from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { A, useLocation } from "@solidjs/router";
import { Logo } from "./Logo";
import { NAV } from "~/generated/docs_nav";
import type { NavGroup, NavItem } from "../../generate_nav";

const SINGLE_FILES = NAV.filter((x) => (x as NavGroup)?.items === undefined);
const DIRS = NAV.filter((x) =>
  (x as NavGroup)?.items !== undefined
) as NavGroup[];

export function DocsSidebar(
  props: ComponentProps<typeof Sidebar>,
): JSX.Element {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <For each={SINGLE_FILES}>
                {(item) => <Item {...(item as NavItem)} />}
              </For>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <For each={DIRS}>{(item) => <Group {...(item as NavGroup)} />}</For>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}

function Group({ title, items, url }: NavGroup): JSX.Element {
  return (
    <SidebarGroup>
      <SidebarGroupLabel as={url === undefined ? "div" : A} href={url ?? "#"}>
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <For each={items}>
            {(item) => (
              <Show
                when={(item as NavGroup)?.items !== undefined}
                fallback={<Item {...(item as NavItem)} />}
              >
                <Group {...(item as NavGroup)} />
              </Show>
            )}
          </For>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function Item({ title, url }: NavItem): JSX.Element {
  const location = useLocation();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        as={A}
        isActive={url.startsWith(location.pathname)}
        href={url}
      >
        {title}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
