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
const NAME = "Splikan";

self.addEventListener("fetch", (e) => {
  (e.request.url.includes("localhost") || e.request.url.includes("workers")) &&
    e.respondWith(
      caches.open(NAME).then((t) =>
        t.match(e.request).then((n) =>
          n || fetch(e.request).then((n) => (t.put(e.request, n.clone()), n))
        )
      ),
    );
});

self.addEventListener("activate", (e) => e.waitUntil(caches.delete(NAME)));
