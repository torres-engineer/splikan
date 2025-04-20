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
import { Header } from "../components/Header";
import { Achievements } from "~/components/Achievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { About } from "~/components/About";
import { Separator } from "~/components/ui/separator";
import { Footer } from "~/components/Footer";
import SignInForm from "~/components/SignInForm";
import { Button } from "~/components/ui/button";
import {
  A,
  createAsync,
  type RouteDefinition,
  useNavigate,
} from "@solidjs/router";
import { getActiveTutors, getClassStats } from "~/lib";

export const route = {
  preload(): void {
    getClassStats();
    getActiveTutors();
  },
} satisfies RouteDefinition;

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  const signInForm = <SignInForm />;

  const classStats = createAsync(() => getClassStats(), { deferStream: true });
  const activeTutors = createAsync(() => getActiveTutors(), {
    deferStream: true,
  });

  return (
    <main>
      <Header />
      <div class="flex m-4">
        <Button class="mx-auto" as={A} href="/signin">
          Find your perfect tutor!
        </Button>
      </div>
      <div class="my-2">
        <Achievements
          completedClasses={classStats()?.completed_classes ?? 0}
          studentsTutored={classStats()?.students_tutored ?? 0}
          activeTutors={activeTutors() ?? 0}
          hoursOfTutoring={classStats()?.hours_tutored ?? 0}
        />
      </div>
      <Tabs defaultValue="about" class="w-full sm:hidden">
        <TabsList class="sticky top-0 grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <About onGetStarted={() => navigate("/signin")} />
        </TabsContent>
        <TabsContent value="account">{signInForm}</TabsContent>
      </Tabs>
      <div class="hidden sm:grid grid-flow-row grid-cols-2 md:grid-cols-3">
        <div class="md:col-span-2">
          <About onGetStarted={() => navigate("/signin")} />
        </div>
        <div>{signInForm}</div>
      </div>
      {
        /*
      <Resizable orientation="horizontal" class="w-full">
        <ResizablePanel initialSize={2/3} class="overflow-hidden">
          <About />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel initialSize={1/3} class="overflow-hidden"></ResizablePanel>
      </Resizable>
      */
      }
      <Separator />
      <Footer />
    </main>
  );
}
