# React / Next.js Vehicle Booking Resources

## Knowledge

- [React: Your First Component — react.dev](https://react.dev/learn/your-first-component)
  Official definition of components as capitalised JS functions that return markup. Use for: first mental model of UI building blocks.
- [React: Quick Start — react.dev/learn](https://react.dev/learn)
  Nesting components, JSX, displaying data, events, shared state. Use for: the 80% daily React surface area.
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  How parents configure children with data. Use for: VehicleCard title/price/features from mock data.
- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
  Mapping arrays to components with keys. Use for: rendering the list of vehicles from data.
- [React: Sharing State Between Components (lifting state up)](https://react.dev/learn/sharing-state-between-components)
  Official lift pattern — common parent owns state; children get value + setters via props; filtered results are derived. Use for: lesson **08a** (filters + sort).
- [MobX: Introduction / concepts](https://mobx.js.org/README.html)
  Official overview: `observable`, `computed`, `action`, and why reactions re-run. Use for: mental model before coding **08b**.
- [MobX: React integration](https://mobx.js.org/react-integration.html)
  Official guide to wrapping components with `observer` (`mobx-react-lite`) and reading observables. Use for: wiring filter/sort UI in **08b**.
- [MobX: Computed values](https://mobx.js.org/computeds.html)
  Derived, cached values from observables. Use for: `visibleVehicles` from filter + sort state (parallel to deriving a list after lift in **08a**).
- [Next.js 16: Installation / Getting Started](https://nextjs.org/docs/app/getting-started/installation)
  Official App Router + TypeScript scaffold (`create-next-app`). Use for: spinning up the mission project.
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

- Emotion + Next.js 16 App Router (RSC) pairing gotchas — need a high-trust, version-current guide before we wire Emotion into the scaffold. Prefer official Emotion docs + Next.js CSS-in-JS notes over blog posts until verified.
