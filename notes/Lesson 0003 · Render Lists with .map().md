One-line summary: instead of hand-writing one `<VehicleCard />` per vehicle, a plain JS array of vehicle data is turned into an array of `VehicleCard` elements with `.map()` — each one needs a stable, unique `key` so React can track it across re-renders.

## Context

- **Mission tie-in:** Lesson 0002 configured one `VehicleCard` by hand-writing its props twice. This lesson moves the six vehicles into a real array — the shape mock data will actually arrive in — and the cards come from that array instead of six lines typed by hand.
- **Next up:** TypeScript — giving the `vehicles` array and `VehicleCard`'s props a real `Vehicle` type, so a typo like `pryce` is caught before the page ever runs.

## The Problem With Writing It By Hand

Six repeated `<VehicleCard title="..." price={...} />` lines don't scale, and can't respond to real data — if the API returned eight vehicles tomorrow, nothing about hand-written JSX would change to match it.

## Array In, Elements Out

`.map()` isn't a React feature — it's plain JavaScript that runs a function over every array item and collects the results into a new array. React renders an array of JSX elements exactly like it renders one.

```jsx
const vehicles = [
  { id: "v1", title: "Standard Sedan", price: 39 },
  { id: "v2", title: "Luxury Sedan", price: 168 },
  { id: "v3", title: "SUV", price: 89 },
];

function ResultsList() {
  return (
    <div>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          title={vehicle.title}
          price={vehicle.price}
        />
      ))}
    </div>
  );
}
```

Add a vehicle to the array and a new card appears — nothing about `ResultsList` or `VehicleCard` has to change.

## Why `key` Is Not Optional

> [!tip] Rule to remember
> Prefer a stable id from the data (`vehicle.id`) over the array index. An index looks fine today, but once filtering/sorting (lesson 08a) reorders the array, index-as-key silently mismatches cards to the wrong data.

Each element in a rendered list needs a `key` — stable and unique among its siblings — so React can tell items apart across re-renders: which one moved, which one is new, which one was removed. Without it, React can only guess by position, and that guess breaks the moment the list is filtered, sorted, or reordered.

## Quiz Recap (in-lesson)

| # | Question | Correct Answer | Reasoning |
|---|----------|-----------------|-----------|
| 1 | Given `vehicles.map((v) => <VehicleCard key={v.id} title={v.title} />)`, what does this evaluate to? | **An array of elements** | `.map()` always returns a new array; here, one JSX element per vehicle. |
| 2 | Why does each item in a list need a unique `key` prop? | **So React tracks items across list changes** | `key` isn't about styling, closing tags, or sorting — it's how React matches list items across renders. |
| 3 | Which key is still safe once the list can be filtered or sorted? | **`key={vehicle.id}`, a stable id** | A stable id from the data survives reordering; array position (`index`) does not. |

## Chat Q&A Recap (retrieval practice)

**Q1 — Why is `vehicle.id` safer than `index` for *this* list, specifically?**
Because `id` stays attached to the same vehicle regardless of where it sits in the array. Once lesson 08a sorts the list, the vehicle that used to be at position 0 may end up at position 2 — an index key makes React think "the same item is still at position 0," mismatching state/DOM to the wrong vehicle. An id key correctly follows the vehicle when it moves.
→ First answer restated what `key` does in general, but didn't compare `id` vs `index` under reordering specifically — needed a follow-up prompt to land the comparison.

**Q2 — Spot the bug: `.map()` over vehicles rendering `<VehicleCard title={...} price={...} />` with no `key`.**
The `key` prop is missing entirely. React can't identify each item across renders without it, so it falls back to guessing by position.
→ Correct on the first try.

**Q3 — Transfer: render `<FilterChip label={...} />` from `["Meet & Greet", "Luxury", "SUV"]`, which has no `.id`.**
```jsx
categories.map((category) => (
  <FilterChip key={category} label={category} />
))
```
Since there's no id field, the string itself is the key — safe as long as no two categories in the list repeat.
→ First answer built a new array with a `key` field added to each item, rather than writing the `.map()` transformation. Revealed a mix-up: treating `key` as something you add to the data, instead of a prop you pass at render time. Worth watching for this pattern again when data modeling (TypeScript lesson) comes up.

### Linked Sources

**"use JavaScript's array `.map()`"** — [https://react.dev/learn/rendering-lists](https://react.dev/learn/rendering-lists)

Official React docs page on turning arrays of data into arrays of components with `.map()`, and the specific section on keeping list items in order with `key` — why keys need to be stable and unique among siblings, and what goes wrong (item identity mismatches) when they aren't.
