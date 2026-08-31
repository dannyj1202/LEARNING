
One-line summary: a single `VehicleCard` function can render six visually different cards because each instance receives different **props** (image, title, capacity, features, price) instead of the component being duplicated six times.

## Context

- **Mission tie-in:** Lesson 0001 named `VehicleCard` as one reusable piece. This lesson shows *how* that one function displays different data (e.g. "Standard Sedan / USD 39" vs "Luxury Sedan / USD 168") in different places.
- **Next up:** rendering a list — turning an array of vehicle data into six `VehicleCard` instances with `.map()`.

## What a Prop Is

Props are how a parent component passes data into a child, the same way an HTML tag takes attributes. In JSX, whatever you write as attributes on a component becomes a single object argument inside the function.

```jsx
function VehicleCard({ title, price }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>USD {price}</p>
    </article>
  );
}
```

The same function renders two different cards just by changing what's passed in:

```jsx
<VehicleCard title="Standard Sedan" price={39} />
<VehicleCard title="Luxury Sedan" price={168} />
```

## Quotes vs. Curly Braces

> [!tip] Rule to remember
> Quotes (`title="Standard Sedan"`) pass a string. Curly braces (`price={168}`) pass a JavaScript value — a number, variable, or expression. Mixing them up is the most common first prop bug.

## Props Flow One Way

Data flows parent → child only. `VehicleCard` can read `title` and `price`, but it cannot change the values it was given — those belong to whoever rendered it. If a value needs to change over time (like a stepper count), that calls for a different tool — **state** — which is a later lesson, not props.

## The Six-Card Target

Every card on the reference screenshot is the same `VehicleCard` component. Only the props differ: `image`, `title`, `capacity`, `features`, `price`. That's the entire mechanism behind six visually distinct cards coming from one function.

## Quiz Recap

| # | Question | Correct Answer | Reasoning |
|---|----------|-----------------|-----------|
| 1 | Given `<VehicleCard title="Luxury Sedan" price={168} />`, what renders inside the `h2`? | **Luxury Sedan** | The `title` prop's value is passed straight through to `{title}` inside the `<h2>`; JSX attribute values render verbatim as the prop's content, they aren't transformed or relabeled. |
| 2 | Which JSX correctly passes the number `168` as the `price` prop? | **`price={168}`** | Curly braces tell JSX to evaluate a JavaScript expression, so `168` stays a number. `price="168"` would pass the string `"168"` instead, which is the classic quotes-vs-braces bug called out in the Rule to Remember. |
| 3 | Inside `VehicleCard`, can the component change the `price` value it received? | **No, props are read-only inside** | Props flow one way (parent → child). A component can read its props but cannot reassign or mutate them; changing a value over time requires state, not props. |

### Linked Sources

**"a parent component passes data to a child through props"** — [https://react.dev/learn/passing-props-to-a-component](https://react.dev/learn/passing-props-to-a-component)

This React docs page explains that props are how a parent passes information to a child component, and that unlike HTML attributes, props can carry any JavaScript value — objects, arrays, even functions. It walks through the two-step pattern of writing props onto a JSX tag and then reading them via destructuring in the component's function signature, and also covers extras like default prop values, forwarding everything with `{...props}` spread syntax, and passing nested JSX through the special `children` prop. It closes by stressing that props are read-only snapshots in time: a component can't change its own props, and must instead rely on a parent to pass new ones — which is what makes state a distinct, later concept.

*Note: the lesson also references react.dev in a couple of other spots (an inline "(react.dev recap)" mention and the "Primary source" link at the end), which likely point to this same page, but I couldn't verify their exact `href` targets without direct access to the page's DOM.*

---
Here's the recap for this round:

**Q1 — What does `VehicleCard` actually receive?**
One single **object** argument: `{ title: "Luxury Sedan", price: 168 }`. The destructured signature `function VehicleCard({ title, price })` just unpacks keys off that one object — it is not two separate parameters.
→ You correctly identified string-vs-number, but missed that it's bundled into one object rather than passed as two arguments.

**Q2 — Write `FilterChip` with a label and a selected/active prop**
```js
function FilterChip({ label, active }) {
  return (
    <article>
      <h2>{label}</h2>
      <p>{active ? "Selected" : "Not selected"}</p>
    </article>
  );
}

<FilterChip label="SUV" active={true} />
```
→ You had the right shape (destructured props, one for text, one for a boolean) but the JSX was unclosed, the boolean prop was named in snake_case (`currently_selected`) instead of camelCase (`active`), and you weren't sure how to *use* a boolean inside JSX — the answer is a ternary: `{active ? "Selected" : "Not selected"}`.

**Q3 — Why is `price = price - 10` inside `VehicleCard` the wrong way to apply a discount?**
Because reassigning a destructured parameter only changes a local variable for that one function call — it doesn't change anything the parent owns. On the *next* render (say, a filter changes and the parent re-renders `VehicleCard`), the parent passes `price` fresh again, and the "discount" is gone — it never persisted anywhere real. The correct fix: compute the discounted value where the decision actually lives (in the parent, before passing it down: `<VehicleCard price={168 - 10} />`), or as a separate derived value in JSX (`{price - 10}`) without ever reassigning the prop itself.
→ Your answer ("it should be `{price}`?") addressed JSX syntax, not the actual question, so this one's still open — happy to go through it again if you want before moving on.