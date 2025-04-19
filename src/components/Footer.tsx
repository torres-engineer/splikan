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
import type { ComponentProps, JSX } from "solid-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { CopyrightNotice } from "./CopyrightNotice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { type ConfigColorMode, useColorMode } from "@kobalte/core";

export function Footer(props: ComponentProps<"footer">): JSX.Element {
  //const [lang, setLang] = createSignal("en");
  const { colorMode, setColorMode } = useColorMode();

  return (
    <footer {...props}>
      <div class="my-2 flex flex-col items-center space-y-4">
        <NavigationMenu orientation="horizontal">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              About
              <NavigationMenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent class="grid w-[90svw] grid-rows-3 gap-3 p-4">
              <NavigationMenuLink href="/docs/about">
                <NavigationMenuLabel>About the project</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink href="/docs/faq">
                <NavigationMenuLabel>FAQs</NavigationMenuLabel>
                <NavigationMenuDescription>
                  Frequently Asked Questions.
                </NavigationMenuDescription>
              </NavigationMenuLink>
              <NavigationMenuLink href="/docs/dev-diaries">
                <NavigationMenuLabel>Developer Diaries</NavigationMenuLabel>
                <NavigationMenuDescription>
                  The developer toughts while working on this project.
                </NavigationMenuDescription>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Resources
              <NavigationMenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent class="grid w-[90svw] grid-rows-2 gap-3 [&>li:first-child]:row-span-2">
              <NavigationMenuLink
                class="box-border flex select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline focus:shadow-md"
                href="https://www.gnu.org/licenses/agpl-3.0.html"
              >
                <img
                  src="/agplv3.svg"
                  alt="GNU Affero General Public License logo"
                  class="h-24 object-scale-down m-2"
                />
                <NavigationMenuLabel class="mb-2 mt-4 text-lg font-medium">
                  License
                </NavigationMenuLabel>
                <NavigationMenuDescription class="text-sm leading-tight text-muted-foreground">
                  GNU Affero General Public License.
                </NavigationMenuDescription>
              </NavigationMenuLink>
              <NavigationMenuLink
                href="https://github.com/torres-engineer/splikan/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <NavigationMenuLabel>
                  Source Code{" "}
                  <img
                    src="../../public/Git-Icon-Black.svg"
                    alt="The Git logo representing this softwares source code"
                    class="inline h-[1em] align-middle"
                  />
                </NavigationMenuLabel>{" "}
                <NavigationMenuDescription>
                  The Corresponding Source &mdash; see section 13 of the GNU
                  AGPL for details.
                </NavigationMenuDescription>
              </NavigationMenuLink>
              <NavigationMenuLink href="/docs">
                <NavigationMenuLabel>Documentation</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink href="/docs/changelog">
                <NavigationMenuLabel>Changelog</NavigationMenuLabel>
                <NavigationMenuDescription>
                  Releases and their changelogs.
                </NavigationMenuDescription>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenu>
        <NavigationMenu orientation="horizontal">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Legal
              <NavigationMenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent class="grid w-[90svw] grid-rows-3 gap-3 p-4">
              <NavigationMenuLink
                as={A}
                href="/docs/legal/privacy-policy"
                target="_blank"
              >
                <NavigationMenuLabel>Privacy Policy</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink
                as={A}
                href="/docs/legal/terms-of-service"
                target="_blank"
              >
                <NavigationMenuLabel>Terms of Service</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink
                as={A}
                href="/docs/legal/code-of-conduct"
                target="_blank"
              >
                <NavigationMenuLabel>Code of Conduct</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink
                as={A}
                href="/docs/legal/disclaimer"
                target="_blank"
              >
                <NavigationMenuLabel>Disclaimer</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink
                as={A}
                href="/docs/legal/cookie-notice"
                target="_blank"
              >
                <NavigationMenuLabel>Cookie Notice</NavigationMenuLabel>
              </NavigationMenuLink>
              <NavigationMenuLink
                as={A}
                href="/docs/legal/accessibility-statement"
                target="_blank"
              >
                <NavigationMenuLabel>
                  Accessibility Statement
                </NavigationMenuLabel>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuTrigger as="a" href="mailto:torres.dev@disroot.org">
            Contact
          </NavigationMenuTrigger>
          <NavigationMenuTrigger
            as={A}
            href="https://github.com/torres-engineer/splikan/discussions"
            target="_blank"
          >
            Support
          </NavigationMenuTrigger>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            class={buttonVariants({ variant: "secondary" })}
            as={Button<"button">}
          >
            Settings
          </DropdownMenuTrigger>
          <DropdownMenuContent class="max-w-48">
            {
              /*
            <DropdownMenuItem closeOnSelect={false}>
              <Dialog>
                <DialogTrigger>Select a language</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a language</DialogTitle>
                    <DialogDescription>
                      Select a language. If you can't find yours, think about
                      contributing with translations.
                    </DialogDescription>
                  </DialogHeader>
                  <Select
                    value={lang()}
                    onChange={setLang}
                    options={["en"]}
                    placeholder="Select a language&hellip;"
                    itemComponent={(props) => (
                      <SelectItem item={props.item}>
                        {props.item.rawValue}
                      </SelectItem>
                    )}
                  >
                    <SelectTrigger aria-label="Language" class="w-[180px]">
                      <SelectValue<string>>
                        {(state) => state.selectedOption()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent />
                  </Select>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            */
            }
            <DropdownMenuGroup>
              <DropdownMenuGroupLabel>Theme</DropdownMenuGroupLabel>
              <DropdownMenuRadioGroup
                value={colorMode()}
                onChange={(theme) => setColorMode(theme as ConfigColorMode)}
              >
                <DropdownMenuRadioItem value="light">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CopyrightNotice />
    </footer>
  );
}
