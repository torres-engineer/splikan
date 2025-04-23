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
import { createSignal, type JSX, Show, Suspense } from "solid-js";
import { Header } from "../components/Header";
import { Achievements } from "~/components/Achievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { About } from "~/components/About";
import { Separator } from "~/components/ui/separator";
import { Footer } from "~/components/Footer";
import SignInForm from "~/components/SignInForm";
import { Button } from "~/components/ui/button";
import { A, type RouteDefinition, useNavigate } from "@solidjs/router";
import { authClient } from "~/lib/auth";
import { signOut } from "~/lib/sign_in";
import { QueryBoundary } from "~/components/QueryBoundary";
import { getStatsOptions } from "~/lib";
import { useQuery } from "@tanstack/solid-query";
import { queryClient } from "~/lib/trpc";
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "~/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const route = {
  preload(): void {
    queryClient.prefetchQuery(getStatsOptions);
  },
} satisfies RouteDefinition;

const SHOW = true;

export default function Home(): JSX.Element {
  const statsQuery = useQuery(() => getStatsOptions);

  const [showAchievements, setShowAchievements] = createSignal(SHOW);

  const navigate = useNavigate();

  return (
    <main>
      <Header />
      <div class="flex m-4">
        <Button class="mx-auto" as={A} href="/signin">
          Find your perfect tutor!
        </Button>
      </div>
      <Show when={showAchievements()}>
        <div class="my-2">
          <h2 class="sr-only">Achievements</h2>
          <QueryBoundary
            query={statsQuery}
            loadingFallback={() => {
              setShowAchievements(SHOW);
              return <Skeleton />;
            }}
            errorFallback={() => setShowAchievements(!SHOW)}
          >
            {(stats) => {
              setShowAchievements(SHOW);
              return <Achievements {...stats} />;
            }}
          </QueryBoundary>
        </div>
      </Show>
      <Tabs defaultValue="about" class="w-full sm:hidden">
        <TabsList class="sticky top-0 grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <About onGetStarted={() => navigate("/signin")} />
        </TabsContent>
        <TabsContent value="account">
          <SessionData />
        </TabsContent>
      </Tabs>
      <Resizable orientation="horizontal" class="!hidden !sm:flex w-full">
        <ResizablePanel initialSize={2 / 3} class="overflow-hidden">
          <About onGetStarted={() => navigate("/signin")} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel initialSize={1 / 3} class="overflow-hidden">
          <SessionData />
        </ResizablePanel>
      </Resizable>
      <Separator />
      <Footer />
    </main>
  );
}

function SessionData(): JSX.Element {
  const session = authClient.useSession();
  const navigate = useNavigate();

  return (
    <Show when={session().data} fallback={<SignInForm />}>
      {(data) => {
        const user = () => data().user;
        const image = () => user().image ?? undefined;
        const initials = () => user().name.split(/\s+/).map((x) => x.charAt(0));
        const imageFallback = () =>
          initials().length > 1
            ? `${initials()[0]}${initials()[initials().length - 1]}`
            : initials()[0];

        return (
          <Suspense fallback={<Skeleton />}>
            <Card>
              <CardHeader>
                <CardTitle>
                  Welcome{" "}
                  {user().displayUsername ?? user().username ?? user().name}
                </CardTitle>
                <CardDescription class="flex gap-2">
                  <Show
                    when={data().user.isAnonymous ?? false}
                    fallback={<Badge>@{data().user.email.split("@")[1]}</Badge>}
                  >
                    <Badge variant="secondary">Anonymous</Badge>
                  </Show>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Avatar>
                  <AvatarImage src={image()} />
                  <AvatarFallback>{imageFallback()}</AvatarFallback>
                </Avatar>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  onClick={() =>
                    signOut({
                      onSuccess: () => {
                        navigate("/");
                      },
                    })}
                >
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </Suspense>
        );
      }}
    </Show>
  );
}
