One-line summary: In the App Router, **folders under `app/` are URL segments**; `page.tsx` makes a segment public; extract shared UI to `components/` and link routes with `next/link`.

## Context
- Side-project task **0010**. Lesson file **0011** (0010 file is `useEffect`).
- Official: [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages).

## Target structure
| Route | File | State pattern |
|---|---|---|
| `/` | `app/page.tsx` | Landing + `Link` |
| `/rides-lift` | `app/rides-lift/page.tsx` | Imports `RidesResultsPage` (lift) |
| `/rides` | `app/rides/page.tsx` | MobX — lesson **0012** |

## Rules
- `"use client"` on files that use hooks / browser interactivity.
- `layout.tsx` = shared shell; `page.tsx` = screen for that URL.
- Thin route files import fat client components — don't duplicate 200 lines per route.

## Next
[Lesson 0012 · MobX filter store](Lesson%200012%20·%20MobX%20filter%20store.md) on `/rides`.
