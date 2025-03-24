import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import type { JSX } from "solid-js";

export default function App(): JSX.Element {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
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
          <a href="/">Index</a>
          <Suspense>{props.children}</Suspense>
          {/* NOSCRIPT */}
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
