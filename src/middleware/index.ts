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
import { createMiddleware } from "@solidjs/start/middleware";
import type { FetchEvent } from "@solidjs/start/server";
import type { EventHandlerResponse } from "vinxi@0.5.4/http";

const notice = `
Splikan - S2S (Student-to-Student) peer tutoring made easy!
Copyright (C) 2025  Joao Augusto Costa Branco Marado Torres
<torres.dev@disroot.org>

This file is part of Splikan.

Splikan is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

Splikan is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
more details.

You should have received a copy of the GNU Affero General Public License
along with Splikan.  If not, see <https://www.gnu.org/licenses/>.
`;

const DOCTYPE = "<!DOCTYPE html>";

export default createMiddleware({
  onRequest(event: FetchEvent): void | Response {
    event.locals.startTime = Date.now();
  },
  onBeforeResponse(
    event: FetchEvent,
    response: { body?: Awaited<EventHandlerResponse> },
  ): void | Response {
    if (!event.response.headers.get("Content-Type")?.includes("text/html")) {
      return;
    }

    if (response.body !== undefined) {
      if (
        typeof response.body === "string" &&
        response.body.includes("<!DOCTYPE html>")
      ) {
        response.body = response.body.replace(
          DOCTYPE,
          `${DOCTYPE}\n<!--${notice}-->\n`,
        );
      } else if (response.body instanceof ReadableStream) {
        let injected = false;
        let buffered = "";
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        response.body = response.body.pipeThrough(
          new TransformStream<Uint8Array, Uint8Array>({
            start(): void {},
            transform(
              chunk: Uint8Array,
              controller: TransformStreamDefaultController,
            ): void {
              if (injected) {
                controller.enqueue(chunk);
                return;
              }
              buffered += decoder.decode(chunk, { stream: true });
              if (buffered.length >= DOCTYPE.length) {
                let output = buffered;
                if (buffered.startsWith(DOCTYPE)) {
                  output = buffered.replace(
                    DOCTYPE,
                    `${DOCTYPE}\n<!--${notice}-->\n`,
                  );
                }
                controller.enqueue(encoder.encode(output));
                injected = true;
              }
            },
            flush(controller: TransformStreamDefaultController): void {
              if (!injected && buffered.length > 0) {
                controller.enqueue(encoder.encode(buffered));
              }
            },
          }),
        );
      }
    }
  },
});
