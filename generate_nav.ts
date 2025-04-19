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
const ROUTES_ROOT = "./src/routes/docs";
const OUTPUT_DIR = "src/generated";
const OUTPUT_FILE = `${OUTPUT_DIR}/docs_nav.ts`;

export type NavItem = {
  title: string;
  url: string;
};

export type NavGroup = {
  title: string;
  url?: string;
  items: NavEntry[];
};

export type NavEntry = NavItem | NavGroup;

function toTitleCase(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

async function isLayoutFile(filePath: string): Promise<boolean> {
  const base = filePath.replace(/\.tsx$/, "");
  try {
    const stat = await Deno.stat(base);
    return stat.isDirectory;
  } catch {
    return false;
  }
}

async function walkDir(
  dir: string,
  baseUrl = "/docs",
): Promise<NavEntry[]> {
  const navItems: NavEntry[] = [];

  for await (const entry of Deno.readDir(dir)) {
    const fullPath = `${dir}/${entry.name}`;
    const urlPath = `${baseUrl}/${entry.name.replace(/\.tsx$/, "")}`;

    if (entry.isDirectory) {
      const indexFile = `${fullPath}/index.tsx`;
      let hasIndex = false;

      try {
        const stat = await Deno.stat(indexFile);
        hasIndex = stat.isFile;
      } catch { /**/ }

      const children = await walkDir(fullPath, `${baseUrl}/${entry.name}`);

      navItems.push({
        title: toTitleCase(entry.name),
        url: hasIndex ? `${baseUrl}/${entry.name}` : undefined,
        items: children as NavItem[],
      });
    } else if (
      entry.isFile && entry.name.endsWith(".tsx") &&
      entry.name !== "index.tsx" &&
      !(await isLayoutFile(fullPath))
    ) {
      navItems.push({
        title: toTitleCase(entry.name.replace(/\.tsx$/, "")),
        url: urlPath,
      });
    }
  }

  return navItems.sort((a, b) => a.title.localeCompare(b.title));
}

Promise.all([Deno.mkdir(OUTPUT_DIR, { recursive: true }), walkDir(ROUTES_ROOT)])
  .then(([_, nav]) =>
    Deno.writeTextFile(
      OUTPUT_FILE,
      `type NavItem = {
  title: string;
  url: string;
};

type NavGroup = {
  title: string;
  url?: string;
  items: NavEntry[];
};

type NavEntry = NavItem | NavGroup;

export const NAV: NavEntry[] = ${JSON.stringify(nav)};`,
    )
  );
