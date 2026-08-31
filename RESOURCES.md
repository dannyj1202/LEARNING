# React / Next.js Vehicle Booking Resources

## Knowledge

- [TypeScript Field Guide (personal notes)](file:///Users/daniel.varghese/Desktop/Almosafer/Almosafer/07%20Learning%20Block/Study/TypeScript%20Field%20Guide.md)
  User's own notes, organized as a progressive skill tree mirroring the official Handbook (Phase 1: core mental model & everyday types, Phase 2: narrowing/unknown/never, Phase 3: generics, Phase 4: real-world config). Use for: the primary source on every TypeScript lesson going forward — preferred over the official Handbook per user request, since it's already pitched at their level and cross-references production reality.
- [React Mastery Guide (personal notes)](file:///Users/daniel.varghese/Desktop/Almosafer/Almosafer/07%20Learning%20Block/Study/React%20Mastery%20Guide.md)
  User's own notes on React. Use for: the primary source on every React lesson going forward, same reasoning as the TypeScript Field Guide above.
- [React: Your First Component — react.dev](https://react.dev/learn/your-first-component)
  Official definition of components as capitalised JS functions that return markup. Use for: first mental model of UI building blocks.
- [React: Quick Start — react.dev/learn](https://react.dev/learn)
  Nesting components, JSX, displaying data, events, shared state. Use for: the 80% daily React surface area.
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  How parents configure children with data. Use for: VehicleCard title/price/features from mock data.
- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
  Mapping arrays to components with keys. Use for: rendering the list of vehicles from data.
- [React: Sharing State Between Components (lifting state up)](https://react.dev/learn/sharing-state-between-components)
  Official lift pattern — common parent owns state; children get value + setters via props; filtered results are derived. Use for: lesson **0009** / side-project task **0008** (filters + sort).
- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
  Official mental model for `useEffect` — sync with external systems after paint. Use for: lesson **0010** / side-project task **0009** (fetch/loading).
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
  When deriving UI or filtering during render is enough. Use for: empty/no-match states and avoiding cargo-cult Effects in lesson **0010**.
- [MobX: Introduction / concepts](https://mobx.js.org/README.html)
  Official overview: `observable`, `computed`, `action`, and why reactions re-run. Use for: mental model before coding **08b**.
- [MobX: React integration](https://mobx.js.org/react-integration.html)
  Official guide to wrapping components with `observer` (`mobx-react-lite`) and reading observables. Use for: wiring filter/sort UI in **08b**.
- [MobX: Computed values](https://mobx.js.org/computeds.html)
  Derived, cached values from observables. Use for: `visibleVehicles` from filter + sort state (parallel to deriving a list after lift in **08a**).
- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  Official guide to primitive types, object types, and type annotations. Use for: typing `Vehicle` and `VehicleCard`'s props.
- [TypeScript Handbook: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
  Official guide to shaping object/interface types, optional properties, readonly. Use for: the `Vehicle` model shape and why a mistyped field is a compile-time error.
- [TypeScript: `strictNullChecks` (tsconfig reference)](https://www.typescriptlang.org/tsconfig/strictNullChecks.html)
  Official statement of what the flag does: with it off, `null`/`undefined` are "effectively ignored by the language… This can lead to unexpected errors at runtime." Use for: the single most important fact about reviewing ct-web-transport, which sets `"strict": false` in both packages — see learning record 0011.
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example)
  Community-standard reference for typing React props, state, and hooks. Named directly by the "typescript (depth)" dashboard card. Use for: the comparison step **after** an unaided typing attempt — the card's second deliverable is an addendum listing where ct-web-transport's conventions differ from this.
- [TypeScript Handbook: Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
  Entry point for generics, `keyof`, and utility types. Use for: the three constructs still deferred in the glossary's "Still fuzzy" section — pick this up when one of them actually appears in a repo file the user must read.
- [Next.js 16: Installation / Getting Started](https://nextjs.org/docs/app/getting-started/installation)
  Official App Router + TypeScript scaffold (`create-next-app`). Use for: spinning up the mission project.
- [Next.js: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
  File-system routing — folders under `app/` map to URLs; `page.tsx` vs `layout.tsx`. Use for: lesson **0011** / side-project task **0010** (routing).
- [Next.js: page file convention](https://nextjs.org/docs/app/api-reference/file-conventions/page)
  What makes a route segment public; Server vs Client pages. Use for: lesson **0011** (`"use client"` placement).
- [Next.js 16 announcement](https://nextjs.org/blog/next-16)
  What ships with Next 16 (Turbopack default, React 19.2, Cache Components). Use for: stack orientation, not deep APIs yet.
- [Emotion: @emotion/styled](https://emotion.sh/docs/styled)
  Official styled-components-style API for Emotion. Use for: Book now buttons, chips, cards in the target stack.
- [Emotion: Introduction](https://emotion.sh/docs/introduction)
  Install `@emotion/react` + `@emotion/styled`. Use for: first Emotion setup in Next.js.

## Wisdom (Communities)

- [Reactiflux Discord](https://www.reactiflux.com/)
  Large, moderated React community. Use for: stuck questions after trying docs + a minimal repro.
- [r/reactjs](https://www.reddit.com/r/reactjs/)
  Active subreddit; quality varies — prefer posts with code. Use for: “does this component split make sense?” critique once you have a draft page.

## Gaps

- ~~Emotion + Next.js 16 App Router (RSC) pairing gotchas~~ — **resolved 2026-08-11.** Checked official Next.js docs (nextjs.org/docs/app/guides/css-in-js, version-tagged 16.3.0): Emotion is listed as "currently working on support" for the app directory, unlike styled-components/MUI which have first-class registry examples. MUI ships a whole separate package (`@mui/material-nextjs`) just to solve Emotion's SSR cache flushing properly. Decision for this project: skip the custom `CacheProvider`/`createCache` registry — verified empirically (inspected actual server-rendered HTML output of the scaffolded project) that plain `@emotion/styled` on a `"use client"` component, with `compiler: { emotion: true }` in `next.config.ts`, already inlines correct CSS during SSR for this project's scope. Production-grade SSR hardening (the MUI-style registry) is out of scope per `MISSION.md`. Re-verify if we hit real style-flash/hydration issues once `useState`-driven components and nested styled components are added.
