One-line summary: `@emotion/styled` turns a tag plus a CSS template literal into a real React component; a prop can drive that CSS directly via a function inside `${ }`. Emotion already filters custom props off the DOM by default for HTML tags — the real gotcha is a custom prop name that happens to collide with a genuine (even legacy) HTML attribute, like `color`.

> [!warning] Correction (post-lesson)
> The lesson originally taught that *any* prop not consumed by Emotion leaks onto the DOM by default. That was wrong — checked against the actual Emotion docs after this session and corrected below, in the lesson file, and in the chat Q&A. The error was in the teaching, not in anything misunderstood.

## Context

- **Mission tie-in:** every lesson through 0004 was about correctness — the right data, in the right shape, in the right place. None of that was visible yet. Emotion is how `VehicleCard`'s border, the price color, and the pill-shaped Book button actually appear, matching the reference screenshot.
- **Next up:** `useState` — making the filter sidebar respond to clicks, now that it can look right when it does.

## A Styled Component Is a Real Component

```tsx
import styled from "@emotion/styled";

const Card = styled.article`
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 1rem;
`;
```

`Card` isn't a helper that applies styling — it **is** the component. Use it exactly like `<article>`, anywhere in JSX.

## Styling From a Prop — Traced Step by Step

```tsx
const Chip = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#0a6e78" : "white")};
`;
```

- Inside `${ }` you can put a **function**, not just a string. Emotion calls it every render with the same props object the component itself receives (same mechanism as Lesson 0002's props, just consumed by a CSS function instead of JSX).
- `<{ active: boolean }>` is a TypeScript **generic argument**, not JSX — it tells `styled.button` "the props object my CSS function receives will include `active: boolean`." Same job as `: Vehicle` on `VehicleCard`'s parameter, just written in a different spot because `styled.button` is a factory function.

Traced: `<Chip active={true}>` → `props = { active: true }` → ternary picks `"#0a6e78"` → generated CSS is `background: #0a6e78;`. `<Chip active={false}>` → generated CSS is `background: white;`. Two different real stylesheets, one per chip, purely from the prop.

## The Real Prop-Forwarding Gotcha

Official docs, verbatim: *"Emotion passes all props (except for `theme`) to custom components and only props that are valid html attributes for string tags."* For a DOM tag like `styled.button` or `styled.p`, Emotion already filters to real HTML attribute names automatically — a made-up name like `active` is filtered out and never reaches the DOM, no extra code needed.

The filter only knows attribute **names**, not intent. If a style-only prop's name happens to coincide with a genuine (even legacy) HTML attribute, it passes the filter and lands on the DOM anyway:

```tsx
const PriceTag = styled.p<{ color: string }>`
  color: ${(props) => props.color};
`;

<PriceTag color="red">USD 29 (sale!)</PriceTag>
// renders: <p color="red" class="css-xyz">USD 29 (sale!)</p>
```

`color` is a genuine, if legacy, HTML attribute (`<font color="red">`), so the default filter treats it as legitimate and forwards it. Renaming it to something that isn't a real attribute (`highlightColor`) fixes it automatically. If the name must stay `color` (API consistency), the documented fix:

```tsx
import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";

const PriceTag = styled("p", {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "color",
})<{ color: string }>`
  color: ${(props) => props.color};
`;
```

Note `styled.p` → `styled("p", { ... })` — the options object only exists on the function-call form — and `isPropValid` (from `@emotion/is-prop-valid`) is the same check Emotion runs internally by default; this composes on top of it rather than replacing it.

## Quiz Recap (in-lesson, corrected)

| # | Question | Correct Answer | Reasoning |
|---|----------|-----------------|-----------|
| 1 | `<PriceTag color="red">USD 29</PriceTag>` where `color: string` — does `color` end up on the DOM `<p>`? | **Yes, `color` is a real HTML attribute** | `color` is a genuine (legacy) HTML attribute name, so the default filter treats it as valid and forwards it. |
| 2 | Same idea renamed to `highlightColor` — does it leak? | **No, it is not a real attribute** | The default filter only forwards names that actually exist as HTML attributes; `highlightColor` doesn't match one. |
| 3 | Must keep the prop named `color` — what's the actual fix? | **Switch to `styled('p', { shouldForwardProp })`** | The options object (with `shouldForwardProp` composed on top of `isPropValid`) only exists on the function-call form of `styled`. |

## Chat Q&A Recap (code-review style bug-spotting)

**Q1 — Trace: `<Chip active={false}>SUV</Chip>` — what's the actual `background` value generated?**
`white` — the ternary picks the `false` branch.
→ Correct on the first try.

**Q2 — Why does `<{ active: boolean }>` need to be there at all?**
It tells TypeScript the shape of the props object the CSS function receives, so `props.active` can be checked as a real `boolean` inside `${(props) => ...}`. Without it, TypeScript has no way to know what `.active` even is — same reasoning as typing `VehicleCard`'s props with `: Vehicle` in Lesson 0004, just applied to a styled-component factory instead of a component you define directly.
→ Correct on the core idea, phrased a little loosely.

**Q3 — Code review: a PR uses `styled.button<{ active: boolean }>` with no `shouldForwardProp` anywhere. What would you flag?**
→ **This question's premise was wrong** (my error, not a gap in understanding) — `active` isn't a real HTML attribute, so it's already filtered off the DOM by default; there's nothing to flag here, and no `shouldForwardProp` is needed. The answer given at the time matched what was taught, but the teaching was the bug. See the corrected gotcha above: the real flag-worthy case is a custom prop whose name *coincides* with a genuine HTML attribute (e.g. `color`), asked and answered correctly as Q1/Q3 in the lesson's corrected quiz.

## Primary Source (read next)

This one isn't in the personal field guides — they're TypeScript/React fundamentals, not styling libraries. Work through [Emotion: Introduction](https://emotion.sh/docs/introduction) and [`@emotion/styled`](https://emotion.sh/docs/styled) on emotion.sh, including the prop-forwarding section — those are the canonical text this lesson compresses.
