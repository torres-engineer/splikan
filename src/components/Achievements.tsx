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
import { For, type JSX } from "solid-js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { default as Autoplay } from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "~/lib/utils";

export interface Props {
  completedClasses: number;
  studentsTutored: number;
  activeTutors: number;
  minutesOfTutoring: number;
}

const ACHIEVEMENTS: ((props: Props) => JSX.Element)[] = [
  ({ completedClasses, studentsTutored }: Props) => (
    <p>
      <span>{completedClasses}</span> classes completed between{" "}
      <span>{studentsTutored}</span> different students
    </p>
  ),
  ({ activeTutors }: Props) => (
    <p>
      <span>{activeTutors}</span> active tutors
    </p>
  ),
  ({ minutesOfTutoring }: Props) => {
    const hours = Math.floor(minutesOfTutoring / 60);
    const minutes = minutesOfTutoring % 60;
    const duration = new Intl.DurationFormat("en", { style: "long" }).format({
      hours,
      minutes,
    });
    return (
      <p>
        <span>{duration.length > 0 ? duration : "0 minutes"}</span>{"  "}
        of tutoring done
      </p>
    );
  },
];

const JUMP = false;
export const DELAY = 6000;

export function Achievements(props: Props): JSX.Element {
  const plugin = Autoplay({ delay: DELAY, stopOnInteraction: true });
  return (
    <Card class="flex flex-col items-center justify-center">
      <CardHeader>
        <CardTitle>What have we achieved?</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          class={cn("w-full max-w-xs", "sm:max-w-sm")}
          opts={{ align: "start", loop: true }}
          plugins={[plugin]}
          onMouseEnter={plugin.stop}
          onMouseLeave={() => plugin.play(JUMP)}
        >
          <CarouselContent class="-ml-6 oldstyle-nums max-w-[64dvw]">
            <For each={ACHIEVEMENTS}>
              {(achievement) => (
                <CarouselItem class="flex items-center justify-center basis-1/1 pl-6">
                  <div
                    class={cn(
                      "my-auto p-1",
                      "[&>p]:text-center",
                      "[&>p>span]:font-black",
                    )}
                  >
                    {achievement(props)}
                  </div>
                </CarouselItem>
              )}
            </For>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
