# Master Summary Report: Lesson 0001 · React Foundations

## 1. Executive Summary & Core Mental Models

React's central idea is that a user interface is not one monolithic block of markup, but a tree of independent, reusable pieces called components. Each component owns a small piece of the screen along with the logic needed to render it, and larger UIs are built by composing smaller components together — much like nesting HTML tags, except the "tags" are your own functions.

"Thinking in React" starts before any code is written: you look at a target UI and mentally carve it into named regions, going from the largest container down to the smallest repeatable unit. The key signal for "this should be its own component" is repetition — if a chunk of UI (like a card in a list) appears multiple times with different data, it's a strong candidate for a single reusable component rendered many times. Once the component tree is named, implementation becomes a matter of translating each named box into a JavaScript function that returns JSX.




## 3. Master Cheat Sheet & Rules Reference

- A component is a capitalized JavaScript function that returns JSX; lowercase names always refer to built-in HTML tags, never components.
- Components compose by nesting, the same way HTML tags nest, and can be reused as many times as needed with different data.
- Never define one component's function inside another component's body — always declare components at the top level, and pass shared data down via props instead.
- A component's `return` must yield exactly one root node; wrap multiple siblings in a `<div>` or an empty `<>...</>` Fragment.
- Every JSX tag must be explicitly closed, including self-closing elements (`<img />`, `<br />`).
- Most HTML/SVG attributes become camelCase in JSX (`strokeWidth`), and `class` becomes `className`; `aria-*`/`data-*` attributes keep their hyphens.
- Multi-line JSX returned from a function must be wrapped in parentheses after `return` to avoid it being silently dropped.
- Curly braces `{}` embed JavaScript expressions and variables into JSX markup and attributes.
- Conditional rendering uses ordinary JavaScript (`if`/ternary/`&&`) rather than special template syntax.
- Rendered lists need a unique `key` prop per item (usually a stable ID) so React can correctly track insertions, deletions, and reordering.
- Event handlers are passed as function references (`onClick={handleClick}`), never invoked directly within the JSX.
- The `useState` Hook gives a component memory across renders; state is local to each instance unless deliberately lifted to a shared parent and passed back down as props.
- When designing a component tree from a visual mockup, repetition (a chunk of UI appearing multiple times with varying data) is the strongest signal that it should become one reusable component.

---

![[Screenshot 2026-08-07 at 1.45.20 PM 1.png]]

**Q1: Why is `VehicleCard` one component instead of splitting into `CardImage` / `CardPrice` / `BookButton`?**
A: Those pieces never appear anywhere else on the page outside a card — they have no independent life. Splitting only pays off when a piece needs to exist on its own somewhere; these don't, so bundling them into one `VehicleCard` is the right grain.

**Q2: Why are `FilterToggle` and `FilterChip` separate components?**
A: `FilterToggle` is a one-off binary on/off control (Free Cancellation). `FilterChip` is the thing that repeats as a set (Meet & Greet, Luxury, SUV...) — repetition is what earns it its own reusable component. (You got this one right yourself.)

**Q3: Why is `SearchSummary` a sibling of `FiltersPanel`/`ResultsList`, not nested inside `ResultsList`?**
A: `SearchSummary` only needs route/date/passengers; `ResultsList` only needs the vehicle array and sort order — no data overlap. Nesting one inside the other would wrongly imply the search context is owned by / scoped to the results list, when really it exists independently and stays put regardless of sorting/filtering.

That's the full answer key for what we covered. When you're ready, try saying the component tree + these three reasons out loud once, cold — that's the actual mentor-defense rehearsal.


**Q1 — Component tree from memory**
Top-level: `ResultsPage → SearchSummary`, `FiltersPanel`, `ResultsList`. Inside `VehicleCard`: image, title, capacity, features, price, Book now.
→ Your answer was correct.

**Q2 — Where does a new "Compare" checkbox go?**
The checkbox *element* renders inside each `VehicleCard` (one per card, since every vehicle needs its own). But the *state* of "which vehicles are selected" lives higher up — in `ResultsList` or `ResultsPage` — because comparing requires seeing across multiple cards, and no single `VehicleCard` can know about its siblings.
→ Your answer got "not top-level" right, but placed the checkbox itself in `ResultsList` rather than distinguishing UI-location (in the card) from state-location (above the cards).

**Q3 — Why must component names start with a capital letter?**
JSX's compiler decides how to treat a tag based on case: lowercase (`<div>`) compiles to a **string**, so React looks it up as a built-in HTML element. Capitalized (`<VehicleCard>`) compiles to a **variable reference**, so React calls your actual function. Write `<vehicleCard />` and React never calls your function — it tries to render a literal HTML tag called `vehiclecard` instead.
→ Your answer ("React syntax just treats it as a component") named the rule but not the mechanism behind it.

Ready to log this and move to Lesson 0002 on props?

---
RideResultsPage
├── SiteHeader
│   ├── Logo (Almosafer)
│   ├── CurrencySelector (USD ▾)
│   ├── LanguageToggle (العربية)
│   ├── RetrieveTripLink
│   ├── SupportPhoneNumber (WhatsApp icon + number)
│   └── SignInButton
│
├── TripSummaryBar
│   ├── RouteSummary (origin → destination text)
│   ├── DateTimeChip (Aug 21 2026, 09:35 PM)
│   ├── PassengerCountChip (1 Passengers)
│   └── BookAnotherRideButton
│
└── ResultsLayout
    ├── FiltersSidebar
    │   ├── FiltersHeader (icon + "Filters" + "6 out of 6 options")
    │   ├── ToggleFilter ("Free Cancellation" + switch)
    │   ├── ChipGroupFilter ("Services" + [Meet & Greet])
    │   ├── RangeSliderFilter ("Price" + min/max labels + slider)
    │   ├── StepperFilter ("Luggage" + − count +)
    │   ├── ChipGroupFilter ("Car class" + [Luxury, Premium, Standard, Mini, Economy])
    │   └── ChipGroupFilter ("Car type" + [Suv, Van, Sedan])
    │
    └── ResultsPanel
        ├── SortControl ("Sort by" + "Lowest price ▾")
        └── RideList
            └── RideCard (repeated, one per vehicle: Standard Sedan, Mini Van, Premium Sedan, Economy Van, Premium Suv, Luxury Sedan…)
                ├── VehicleThumbnail
                ├── VehicleDetails
                │   ├── VehicleName ("Standard Sedan")
                │   ├── VehicleModelsNote ("Corolla, Toyota Prius or similar")
                │   ├── CapacityBadges (passenger icon+count, bag icon+count)
                │   ├── CancellationBadge (✓ "Free Cancellation up to 24 hours")
                │   └── ServiceBadge ("Meet & Greet")
                └── PriceAction
                    ├── PriceLabel ("USD 39")
                    └── BookNowButton