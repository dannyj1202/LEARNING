One-line summary: Loading / empty catalog / no filter matches are mostly **render conditions**. `useEffect` syncs with external systems (e.g. fetch after mount) — not for deriving filtered lists. Prefer [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) before adding one.

## Context
- Side-project task **0009**. Lesson file **0010**.
- Official: [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects).

## Edge states
| Condition | UI |
|---|---|
| `isLoading` | Loading message / skeleton |
| `vehicles.length === 0` | Empty catalog |
| `vehicles.length > 0 && visible.length === 0` | No matches — clear filters |

## Effect smell
Using Effect only to `setState` from other state you already own → derive during render or update in the event handler instead.

## Next
Lesson **0011** — Next.js routing (`/rides-lift`, landing `/`). Lesson **0012** — MobX store on `/rides`.
