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
import { ErrorBoundary, Match, Suspense, Switch } from "solid-js";
import type { UseQueryResult } from "@tanstack/solid-query";
import type { JSX } from "solid-js";

/**
 * MIT License
 *
 * Copyright (c) 2021-present Tanner Linsley
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */
export interface QueryBoundaryProps<T = unknown> {
  query: UseQueryResult<T, Error>;

  /**
   * Triggered when the data is initially loading.
   */
  loadingFallback?: (() => JSX.Element) | JSX.Element;

  /**
   * Triggered when fetching is complete, but the returned data was falsey.
   */
  notFoundFallback?: (() => JSX.Element) | JSX.Element;

  /**
   * Triggered when the query results in an error.
   */
  errorFallback?: (err: Error, retry: () => void) => JSX.Element;

  /**
   * Triggered when fetching is complete, and the returned data is not falsey.
   */
  children: (data: Exclude<T, null | false | undefined>) => JSX.Element;
}

/**
 * Convenience wrapper that handles suspense and errors for queries. Makes the results of query.data available to
 * children (as a render prop) in a type-safe way.
 */
export function QueryBoundary<T>(props: QueryBoundaryProps<T>): JSX.Element {
  return (
    <Suspense
      fallback={typeof props.loadingFallback === "function"
        ? props.loadingFallback()
        : props.loadingFallback}
    >
      <ErrorBoundary
        fallback={(err: Error, reset) =>
          props.errorFallback
            ? (
              props.errorFallback(err, async () => {
                await props.query.refetch();
                reset();
              })
            )
            : (
              <div>
                <div class="error">{err.message}</div>
                <button
                  type="button"
                  onClick={async () => {
                    await props.query.refetch();
                    reset();
                  }}
                >
                  retry
                </button>
              </div>
            )}
      >
        <Switch>
          {
            /* <Match when={props.query.isError}>
            {props.errorFallback && props.query.error !== null
              ? (
                props.errorFallback(props.query.error, props.query.refetch)
              )
              : (
                <div>
                  <div class="error">{props.query.error?.message}</div>
                  <button
                    onClick={() => {
                      props.query.refetch();
                    }}
                  >
                    retry
                  </button>
                </div>
              )}
          </Match> */
          }

          <Match when={!props.query.isFetching && !props.query.data}>
            {props.notFoundFallback
              ? (
                typeof props.notFoundFallback === "function"
                  ? props.notFoundFallback()
                  : props.notFoundFallback
              )
              : <div>not found</div>}
          </Match>

          <Match when={props.query.data}>
            {props.children(
              props.query.data as Exclude<T, null | false | undefined>,
            )}
          </Match>
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
}
