import { createMiddleware } from "@solidjs/start/middleware";
import type { FetchEvent } from "@solidjs/start/server";

export default createMiddleware({
  onRequest(event: FetchEvent): void | Response {
    event.locals.startTime = Date.now();
  },
  onBeforeResponse: [() => {}, () => {}],
});
