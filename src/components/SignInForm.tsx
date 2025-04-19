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
import { createForm } from "@tanstack/solid-form";
import * as v from "valibot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { type ComponentProps, For, type JSX, Show, splitProps } from "solid-js";
import { Callout, CalloutContent, CalloutTitle } from "./ui/callout";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

type Provider = {
  provider: string;
};

export default function SignInForm(props: ComponentProps<"form">): JSX.Element {
  const [styleProps, _, restProps] = splitProps(
    props,
    ["style"],
    ["onSubmit"],
  );

  const form = createForm(() => ({
    defaultValues: {
      provider: "",
    } as Provider,
    onSubmit({ _value }): void {
    },
  }));

  const opts = ["local"];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class={cn("rounded-lg max-w-md w-full p-6 mx-auto", styleProps.style)}
      {...restProps}
    >
      <p class="text-2xl font-bold mb-4 text-center">
        Sign In with your school account
      </p>
      <p class="mb-4 flex justify-center flex-wrap gap-2">
        <form.Field
          name="provider"
          validators={{
            onChange: v.pipe(
              v.string(),
              v.picklist(
                opts,
                "You need to select one of the valid providers!",
              ),
              v.title("Provider"),
              v.description("The SSO provider"),
            ),
          }}
        >
          {(field) => (
            <>
              <div class="flex flex-row justify-center items-baseline gap-2">
                <Label for={field().name}>School:</Label>
                <Select
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.target.value)}
                  onChange={(val) => {
                    if (val !== null) field().handleChange(val);
                  }}
                  options={opts}
                  placeholder="Select a prodiver&hellip;"
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>
                      {props.item.rawValue}
                    </SelectItem>
                  )}
                >
                  <SelectTrigger aria-label="Provider" class="w-[180px]">
                    <SelectValue<string>>
                      {(state) => state.selectedOption()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </div>
              <Show
                when={field().state.meta.errors.length > 0}
              >
                <Callout
                  class="max-w-[96vw] w-11/12 basis-full"
                  variant="error"
                >
                  <CalloutTitle>Error</CalloutTitle>
                  <CalloutContent>
                    <ol>
                      <For each={field().state.meta.errors}>
                        {(i) => <li>{i?.message}</li>}
                      </For>
                    </ol>
                  </CalloutContent>
                </Callout>
              </Show>
            </>
          )}
        </form.Field>
      </p>
      <p class="flex m-2 justify-center">
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {(state) => (
            <Button
              variant={state().isSubmitting ? "ghost" : undefined}
              type="submit"
              disabled={!state().canSubmit}
              aria-disabled={!state().canSubmit}
            >
              {state().isSubmitting ? "..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </p>
      <form.Subscribe
        selector={({ isSubmitSuccessful }) => isSubmitSuccessful}
      >
        {(state) => (
          <Show when={state()}>
            <Callout variant="success">
              <CalloutTitle>Signed In</CalloutTitle>
              <CalloutContent>Redirecting...</CalloutContent>
            </Callout>
          </Show>
        )}
      </form.Subscribe>
    </form>
  );
}
