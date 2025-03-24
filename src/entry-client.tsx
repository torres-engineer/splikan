// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// deno-lint-ignore no-undef -- I don't know what to do in this situation
const root = document.getElementById("app");

if (root !== null) {
  mount(() => <StartClient />, root);
}
