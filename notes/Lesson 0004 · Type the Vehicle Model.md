One-line summary: giving `vehicles` and `VehicleCard`'s props a real `Vehicle` type turns shape mistakes (typo'd fields, wrong types, extra fields) into errors visible in your editor at edit time — before the page ever runs.

## Context

- **Mission tie-in:** Lesson 0003's `vehicles` array was plain JavaScript — nothing stopped a typo like `proce` or a string where a number belonged. This lesson gives that array (and `VehicleCard`'s props) a real shape to be checked against.
- **Mission update (this session):** the mission now explicitly includes code-review fluency — being able to read someone else's TS/React code and spot real bugs, not just build from scratch. Skill checks from here on are framed as small code reviews.
- **Next up:** Emotion — styling `VehicleCard`, chips, and the Book button, now that the data feeding them is trustworthy.

## A Type Is a Shape You Can Check Against

```ts
type Vehicle = {
  id: string;
  title: string;
  price: number;
};

const vehicles: Vehicle[] = [
  { id: "v1", title: "Standard Sedan", price: 39 },
  { id: "v2", title: "Luxury Sedan", price: 168 },
];
```

`Vehicle[]` means "an array of things shaped like `Vehicle`." Missing fields, extra fields, or wrong-typed fields are all flagged.

> [!tip] Rule to remember
> This checking happens at **edit/compile time**, reading your code — not at **run time**, executing it. TypeScript never watches your program run; it reads the shapes and flags mismatches before a single line executes.

## The Same Shape Types the Component's Props

```tsx
function VehicleCard({ title, price }: Vehicle) {
  return (
    <article>
      <h2>{title}</h2>
      <p>USD {price}</p>
    </article>
  );
}
```

`<VehicleCard title="SUV" price="89" />` (price as a string) is now a red squiggle in the editor, not a bug someone finds in the rendered page weeks later.

## Quiz Recap (in-lesson)

| # | Question | Correct Answer | Reasoning |
|---|----------|-----------------|-----------|
| 1 | `{ id: "v1", title: "SUV", proce: 89 }` assigned to `Vehicle` — why does this error? | **`proce` is misspelled; missing `price`** | The object doesn't match `Vehicle`'s shape — `price` is absent and `proce` isn't a known field. |
| 2 | Why does TS catch this typo but plain JS wouldn't? | **TS checks shapes before code runs** | TypeScript reads and checks shapes at edit/compile time; JavaScript has no such check and would just leave `price` as `undefined`. |
| 3 | `<VehicleCard title="SUV" price="89" />` where `price` is typed `number` — what happens? | **TypeScript flags `price` as wrong type** | Caught in the editor as a type mismatch before the page ever runs — nothing throws at runtime here. |

## Chat Q&A Recap (code-review style bug-spotting)

**Q1 — Does `const v: Vehicle = { id: "v4", title: "Minivan", price: 74, seats: 7 }` compile?**
No — but not for the reason first guessed. Semicolons vs. commas as separators in a type literal (`{ id: string; title: string }` vs. `{ id: string, title: string }`) are **both valid TypeScript** — that was a real misconception to correct, since flagging it in an actual review would be a wrong comment. The actual bug: `seats` isn't a field on `Vehicle`. Assigning a fresh object literal directly to a `Vehicle`-typed variable triggers an **excess property check** — any field not in the type gets flagged, not just missing/misspelled ones.
→ Corrected after redirect.

**Q2 — `VehicleCard` typed `{ title, price }: Vehicle`, called as `<VehicleCard key={vehicle.id} title={vehicle.title} prices={vehicle.price} />` inside `.map()` — does it compile?**
No — two errors at once: `prices` is an unrecognized prop (should be `price`), and the required `price` is missing entirely.
→ Correctly caught the `prices`/`price` mismatch, but initially also flagged `key={vehicle.id}` as wrong. `key` is **not** part of `Vehicle` or `VehicleCard`'s prop type at all — it's a React-only list-identity prop (from Lesson 0003), and `vehicle.id` is exactly the right value for it. Corrected after redirect — a resurfacing of the Lesson 0003 `key` confusion, this time as "must match the type" rather than "belongs in the data."

**Q3 — With the Q2 bug shipped and type-checking skipped (types stripped, never checked), what shows on the page when `VehicleCard` renders, and why?**
The props object built from the JSX has no `price` key (only `prices`), so destructuring `{ price }` returns `undefined` — JavaScript never errors on a missing object key. React treats `undefined` (like `null` and booleans) as a child that renders as **nothing at all**, not the literal text "undefined." So the page shows `USD ` — the string plus a blank — with no exception and no console error anywhere. Nothing signals that anything is wrong.
→ Correct on retry, full chain traced unprompted: prop mismatch → `undefined` → React's silent-render-nothing behavior → no error thrown.

### Linked Sources

**"object types describe the shape of an object"** — [https://www.typescriptlang.org/docs/handbook/2/objects.html](https://www.typescriptlang.org/docs/handbook/2/objects.html)
**Everyday Types** — [https://www.typescriptlang.org/docs/handbook/2/everyday-types.html](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

Official TypeScript Handbook pages on object type shapes, property/type annotations, and (implicitly, via the excess-property behavior demonstrated in Q1) how object literals are checked more strictly than values passed through a variable.
