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
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { onMount, Suspense } from "solid-js";
import "./app.css";
import type { JSX } from "solid-js";
import { getCookie } from "vinxi/http";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { isServer } from "solid-js/web";

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

function getServerCookies(): string {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App(): JSX.Element {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : globalThis.document.cookie,
  );

  onMount(() => {
    if (globalThis.document !== undefined) {
      globalThis.document.documentElement.before(
        globalThis.document.createComment(notice),
      );
    }
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <ColorModeScript storageType={storageManager.type} />
          <ColorModeProvider storageManager={storageManager}>
            <Title>Splikan</Title>
            {
              /*
          <Meta charset="UTF-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover" />
          */
            }
            {/* SEO TAGS START */}
            {/* APPLE TOUCH ICON */}
            {/* ICON */}
            {/* MASK-ICON */}
            {/* THEME-COLOR */}
            {/* APPLICATION-NAME */}
            {/* GENERATOR */}
            {/* OG: */}
            {/* ACTIVITYPUB & ACTIVITYSTREAMS */}
            {/* TWITTER: */}
            {/* DESCRIPTION */}
            {/* SEO TAGS END */}
            <Suspense>{props.children}</Suspense>
            {/* NOSCRIPT */}
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
