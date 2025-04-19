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
import { For, Index, type JSX, Show } from "solid-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface Props {
  onGetStarted?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

const TRIGGER_ACCENT_CLASS = cn(
  "text-primary !no-underline font-black inline-block",
);

const ITEMS: () => { trigger: JSX.Element; content: string[] }[] = () => [
  {
    trigger: (
      <>
        <span class={TRIGGER_ACCENT_CLASS}>
          Sign In
        </span>{" "}
        with your school <span class="text-nowrap">e-mail</span>
      </>
    ),
    content: [
      `
        This way, you're only connecting with tutors from your school. It's
        convinient, secure, and keeps the students within the school.
      `,
    ],
  },
  {
    trigger: (
      <>
        <span class={TRIGGER_ACCENT_CLASS}>
          Find
        </span>{" "}
        the perfect tutor for you
      </>
    ),
    content: [
      `
        Browse through a list of tutors who specialize in different subjects.
        You can filter by study area, degree, price range, GPA, and more.
      `,
      `
        Once you've found the right tutor for you, book a class that fits both
        your schedules. You'll be able to easily contact the tutor with any
        questions before finalizing the appointment via their school e-mail.
      `,
    ],
  },
  {
    trigger: (
      <>
        Become a tutor too<span class={TRIGGER_ACCENT_CLASS}>
          !
        </span>
      </>
    ),
    content: [
      `
        Maybe you also can help other students. Why not share your knowledge?
      `,
      `
        If you've mastered a subject, you can activate your tutor profile and
        start offering lessons to your fellow schoolmates.
      `,
      `
        Set your availability, class locations, and study areas that you are
        able to teach. Let the student know what are you capable of.
      `,
      `
        You can take a break whenever you need!
      `,
      `
        You were in their shoes once, now you can help them succeed.
      `,
    ],
  },
];

export function About({ onGetStarted }: Props): JSX.Element {
  return (
    <article class="mx-1 p-4">
      <h2 class="text-2xl font-serif">Start using it now:</h2>
      <Accordion
        defaultValue={["item-1"]}
        multiple={false}
        collapsible
        class="p-2"
      >
        <Index each={ITEMS()}>
          {(item, i) => {
            const { trigger, content } = item();
            i++;
            return (
              <AccordionItem
                value={`item-${i}`}
                class={cn(
                  "group/item flex items-baseline gap-4",
                )}
              >
                <span class="text-3xl font-serif no-wrap">
                  {i}.
                </span>
                <div class="w-full">
                  <AccordionTrigger
                    class={cn(
                      "group/trigger min-h-32 flex opacity-60 animate-pulse group-hover/item:animate-none cursor-pointer",
                      "data-expanded:opacity-100 data-expanded:animate-none data-expanded:cursor-default",
                    )}
                  >
                    <h3
                      class={cn(
                        "mt-16 inline font-sans text-3xl/snug font-bold decoration-secondary decoration-wavy decoration-2 underline-offset-1 text-balance text-start",
                        "[&:first-child]:mt-0",
                        "md:[&:first-child]:mt-16",
                        "group-data-expanded/trigger:underline",
                      )}
                    >
                      {trigger}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent
                    class={cn(
                      "mr-4",
                      "**:text-justify **:text-ellipsis **:text-base **:hyphens-auto **:mt-4",
                      "**:first-child:mt-0",
                    )}
                  >
                    <For each={content}>
                      {(paragraph) => <p>{paragraph}</p>}
                    </For>
                    <Show when={i === 1}>
                      <Button onClick={onGetStarted}>Get Started</Button>
                    </Show>
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
          }}
        </Index>
      </Accordion>
      <p class="text-center">
        <Button
          as={A}
          href="/docs/about"
          variant="link"
          class="after:content-['_\1F517']"
        >
          Learn More
        </Button>
      </p>
    </article>
  );
}
