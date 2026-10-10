import { page } from '$app/state';
import docsRaw from './docs-data.jsonc?raw';

export interface ComponentDoc {
  component: string;
  name: string;
  tag: string;
  blurb: string;
  code: string;
  attributes: Record<string, string[]>;
  /** underlying element(s) — a single name or a list, with or without <angle> brackets */
  base?: string | string[];
}

/**
 * Strip `//` line comments and block comments from JSONC without touching
 * comment-like sequences inside string values (e.g. `"https://..."`).
 */
export function stripJsonComments(text: string): string {
  let out = '';
  let inString = false;
  let inLine = false;
  let inBlock = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inLine) {
      if (char === '\n') {
        inLine = false;
        out += char;
      }
      continue;
    }

    if (inBlock) {
      if (char === '*' && next === '/') {
        inBlock = false;
        i++;
      }
      continue;
    }

    if (inString) {
      out += char;
      if (char === '\\') {
        out += next ?? '';
        i++;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      out += char;
      continue;
    }

    if (char === '/' && next === '/') {
      inLine = true;
      i++;
      continue;
    }

    if (char === '/' && next === '*') {
      inBlock = true;
      i++;
      continue;
    }

    out += char;
  }

  return out;
}

/** Parse JSONC (JSON with comments) — the format `docs-data.jsonc` is written in. */
export function parseJsonc<T>(text: string): T {
  return JSON.parse(stripJsonComments(text)) as T;
}

/** Every documented component, parsed once. */
export const docs: ComponentDoc[] = parseJsonc<ComponentDoc[]>(docsRaw);

/** Top-level navigation, shared by every route. */
export const tabs = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Playground', href: '/playground' }
];

/** Whether `href` is the current route (or an ancestor of it). */
export function isActive(href: string): boolean {
  return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
}

/** `base` can be "button" or ["<button>"] — normalise to bare tag names. */
export function baseTags(base?: string | string[]): string[] {
  if (!base) return [];
  const list = Array.isArray(base) ? base : [base];
  return list
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim().replace(/^<|>$/g, ''))
    .filter(Boolean);
}
