One-line summary: Same filters/sort UI as lift-state, but **filter fields + `visibleVehicles` computed** live in a MobX store; page wrapped in **`observer`**; fetch still via **`useEffect`**.

## Context
- Curriculum **08b**. Requires 08a (lesson 0009) solid.
- Pair with lesson **0011** — `/rides-lift` vs `/rides`.
- Official: [MobX computeds](https://mobx.js.org/computeds.html), [React integration](https://mobx.js.org/react-integration.html).

## Lift vs MobX
| | Lift | MobX |
|---|---|---|
| State | `useState` in page | store fields |
| Visible list | derive in render | `get visibleVehicles()` computed |
| Wiring | props | store read + `observer` |

## Build order
1. `stores/vehicleResultsStore.ts` with `makeAutoObservable`
2. `/rides/page.tsx` + `observer`
3. Store-backed props first; then `observer` on `FiltersPanel` if ready

## Work tie-in
`transport-filter.store.ts` + `useStateOfFilters.ts` — same problem, production scale.
