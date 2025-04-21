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
import { type ComponentProps, For, type JSX, Show, splitProps } from "solid-js";
import { Callout, CalloutContent, CalloutTitle } from "./ui/callout";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { signIn } from "~/lib/sign_in";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "./ui/text-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useNavigate } from "@solidjs/router";
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxSection,
  ComboboxTrigger,
} from "./ui/combobox";
import { Label } from "./ui/label";

interface Provider {
  value: string;
  label: string;
  disabled: boolean;
}
interface Category {
  label: string;
  options: Provider[];
}
const PROVIDERS: Category[] = [
  {
    label: "Local",
    options: [
      { value: "username", label: "Username", disabled: false },
      { value: "anonymous", label: "Anonymous", disabled: false },
    ],
  },
  {
    label: "Schools",
    options: [],
  },
];

const PROVIDERS_VALUES = PROVIDERS.reduce<string[]>(
  (prev, cur) => prev.concat(cur.options.map((x) => x.value)),
  [],
);

const ProviderSchema = v.pipe(
  v.string(),
  v.picklist(PROVIDERS_VALUES, "You need to select one of the valid providers"),
  v.readonly(),
  v.title("Provider"),
  v.description("The SSO provider"),
);

const UsernameSchema = v.nullish(
  v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.readonly(),
    v.title("Username"),
    v.description("Username to use when the provider is `username`"),
  ),
);

const SignInSchema = v.pipe(
  v.object({
    provider: ProviderSchema,
    username: UsernameSchema,
  }),
  v.forward(
    v.partialCheck(
      [["provider"], ["username"]],
      ({ provider, username }) =>
        provider !== "username" || typeof username === "string",
      "You need to give a username to use the `username` provider",
    ),
    ["username"],
  ),
);
const SignInData = v.InferOutput<typeof SignInSchema>;

export default function SignInForm(props: ComponentProps<"form">): JSX.Element {
  const [styleProps, _, restProps] = splitProps(
    props,
    ["style"],
    ["onSubmit"],
  );

  const navigate = useNavigate();

  const form = createForm(() => ({
    defaultValues: {
      provider: "",
    } as typeof SignInData,
    onSubmit({ value }): void {
      const { output, success } = v.safeParse(SignInSchema, value);

      if (!success) {
        return;
      }

      const { provider, username } = output;

      signIn(
        provider === "username" && typeof username === "string"
          ? { username }
          : provider,
        {
          onSuccess(): void {
            navigate("/");
          },
        },
      );
    },
    validators: {
      onChange: SignInSchema,
    },
  }));

  const showUsername = form.useStore(({ values }) => {
    const { output } = v.safeParse(SignInSchema, values);
    return (output as typeof SignInData).provider === "username";
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class={cn(
        "flex flex-col gap-4 rounded-lg max-w-md w-full p-6 mx-auto",
        styleProps.style,
      )}
      {...restProps}
    >
      <p class="text-2xl font-bold mb-4 text-center">
        Sign In with your school account
      </p>
      <form.Field name="provider" validators={{ onChange: ProviderSchema }}>
        {(field) => (
          <div class="mb-4 flex justify-center flex-wrap gap-2">
            <p class="flex flex-row justify-center items-center gap-2">
              <Label for={field().name}>School:</Label>
              <Combobox<Provider, Category>
                name={field().name}
                defaultValue={field().state.value}
                onBlur={field().handleBlur}
                onInputChange={(value: string) => {
                  if (value === "") {
                    field().handleChange("");
                  }
                }}
                onChange={(val) => {
                  if (val !== null) field().handleChange(val.value);
                }}
                validationState={field().state.meta.errors.length > 0
                  ? "invalid"
                  : "valid"}
                required
                options={PROVIDERS}
                optionValue="value"
                optionTextValue="label"
                optionLabel="label"
                optionDisabled="disabled"
                optionGroupChildren="options"
                placeholder="Search for your school&hellip;"
                itemComponent={(props) => (
                  <ComboboxItem item={props.item}>
                    <ComboboxItemLabel>
                      {props.item.rawValue.label}
                    </ComboboxItemLabel>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                )}
                sectionComponent={(props) => (
                  <ComboboxSection>
                    {props.section.rawValue.label}
                  </ComboboxSection>
                )}
              >
                <ComboboxControl aria-label="Provider">
                  <ComboboxInput id={field().name} />
                  <ComboboxTrigger />
                </ComboboxControl>
                <ComboboxContent />
              </Combobox>
            </p>
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
          </div>
        )}
      </form.Field>
      <Show when={showUsername()}>
        <form.Field
          name="username"
          validators={{ onChange: UsernameSchema }}
        >
          {(field) => (
            <TextField
              validationState={(field().state.meta.errors?.length ?? 0) > 0
                ? "invalid"
                : "valid"}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
              class="grid w-full max-w-sm items-center gap-1.5"
            >
              <TextFieldLabel for={field().name}>Username</TextFieldLabel>
              <Tooltip>
                <TooltipTrigger
                  as={TextFieldInput}
                  type="text"
                  id={field().name}
                  name={field().name}
                  placeholder="Username"
                  autocomplete="username"
                />
                <TooltipContent>
                  <TextFieldErrorMessage>
                    <ol>
                      <For each={field().state.meta.errors}>
                        {(i) => <li>{i?.message}</li>}
                      </For>
                    </ol>
                  </TextFieldErrorMessage>
                </TooltipContent>
              </Tooltip>
            </TextField>
          )}
        </form.Field>
      </Show>
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
