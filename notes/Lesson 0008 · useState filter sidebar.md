One-line summary: `useState` gives a component memory React keeps across renders, plus a setter that triggers a re-render. Sidebar controls (toggle, chips, stepper) each own local state; that does **not** filter the vehicle list until state is lifted (task 0008).

## Context

- **Mission tie-in:** side-project task 0007 — filter sidebar comes alive after Emotion cards (task 0006 / lesson 0005).
- **Lesson file:** `lessons/0008-usestate-filter-sidebar.html` (file number 0008 because 0006/0007 are the TypeScript work-repo lessons).
- **Hard boundary:** local `useState` only updates that component's UI. List filtering = lift state next.

## The API

```tsx
const [on, setOn] = useState(false);
// on     → value this render
// setOn  → schedule update + re-render
```

| Control | State | Update |
|---|---|---|
| Toggle | `boolean` | `setOn(!on)` |
| Chips | selected key(s) | set selected / toggle in array |
| Stepper | `number` | `setCount(count + 1)` |

## Pair with Emotion

`active={selected === "meet-greet"}` on a styled chip — state decides, CSS displays (lesson 0005).
