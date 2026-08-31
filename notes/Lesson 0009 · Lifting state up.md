One-line summary: Shared filter/sort state lifts to the common parent (`page.tsx`). Children become controlled via value + handler props. The on-screen list is **derived** each render (`vehicles.filter/sort`) — not a second `useState` copy.

## Context
- Side-project task **0008** (pivotal). Lesson file **0009** (0008 is local useState).
- Official: [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).

## Three steps
1. Remove local `useState` from toggle / chips / stepper.
2. Pass current values as props.
3. Pass setters/handlers as props so children can request updates.

## Derived list
```ts
const visible = vehicles.filter(...).sort(...);
```
Do not mirror into `const [visible, setVisible] = useState(vehicles)`.

## Next
Lesson 0010 — loading / empty / no-match; when `useEffect` is wrong.
