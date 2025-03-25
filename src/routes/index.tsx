import { Title } from "@solidjs/meta";
import type { JSX } from "solid-js";

export default function Home(): JSX.Element {
  return (
    <main>
      <Title>Hello World</Title>
      <h1 class="text-9xl">Hello world!</h1>
    </main>
  );
}
