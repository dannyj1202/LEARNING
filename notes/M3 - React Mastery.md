# The Modern React Mastery Guide

### From Zero to Production-Ready: A Practical Journey Through react.dev

## Executive Summary

This guide exists to do one thing: help you build a **rock-solid mental model of modern React** — not just memorize syntax, but understand *why* React behaves the way it does. That "why" is what turns a developer who copies Stack Overflow snippets into one who can debug a gnarly `useEffect` bug with confidence.

### The Core Mental Model

> [!tip]
> React is a function of state. `UI = f(state)`. You don't tell React *how* to change the DOM step-by-step (imperative). You describe *what* the UI should look like for any given state, and React figures out the DOM mutations for you (declarative).

Every concept in this guide — components, props, hooks, effects — is in service of that one idea. Components are just JavaScript functions that take data in (`props`) and return a description of UI (JSX). When data changes (`state`), React re-runs the function and reconciles the difference.

### The Roadmap

| Phase | Focus | Core Question It Answers |
|---|---|---|
| **1. Describing the UI** | JSX, props, conditionals, lists, purity | "How do I express what the screen should show?" |
| **2. Adding Interactivity** | Events, state, immutability, batching | "How do I make the screen respond to the user?" |
| **3. Managing State** | State structure, lifting state, reducers, context | "How do I organize state as my app grows?" |
| **4. Escape Hatches** | Refs, effects, synchronization | "How do I step outside React when I truly need to?" |

By the end, you won't just know React — you'll know when *not* to reach for a hook, why your component re-rendered when it shouldn't have, and how to structure state so bugs don't happen in the first place.

---

## Phase 1: Describing the UI

### 1.1 Components: The Atomic Unit

A React component is just a JavaScript function whose name starts with a **capital letter** and that returns markup (JSX).

```jsx
function WelcomeBanner() {
  return <h1>Welcome back!</h1>;
}
```

No classes, no magic — just a function. The capitalization matters because it's how React (and JSX) distinguishes your custom components (`<WelcomeBanner />`) from built-in HTML tags (`<div>`).

> [!warning] Common Pitfall
> Never define a component *inside* another component's function body. Doing so recreates that component's identity on every render, causing React to unmount and remount it (losing all its state) every single time the parent re-renders.

```jsx
// Bad: ChildForm is redefined every render
function ParentPage() {
  function ChildForm() { return <input />; }
  return <ChildForm />;
}

// Good: defined once, at the top level
function ChildForm() { return <input />; }
function ParentPage() {
  return <ChildForm />;
}
```

### 1.2 JSX Rules You Must Internalize

JSX looks like HTML but compiles to `React.createElement()` calls under the hood, so it has stricter rules than HTML:

| Rule | Why |
|---|---|
| Must return **one root element** (or a `<>...</>` Fragment) | A function can only return one value; JSX must reflect that |
| All tags must be **closed** (`<img />`, `<br />`) | XML-like syntax needs unambiguous parsing |
| Attributes are **camelCase** (`className`, `onClick`, `tabIndex`) | JS reserves `class` and dashes aren't valid identifiers |
| JS expressions go inside `{ }` | This is how you "escape" from markup back into JavaScript |

```jsx
function ProfileCard({ user }) {
  return (
    <>
      <img className="avatar" src={user.imageUrl} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.isOnline ? 'Online now' : 'Offline'}</p>
    </>
  );
}
```

> [!tip]
> Curly braces `{}` in JSX only accept **expressions**, not statements. `{if (x) {...}}` will throw an error — use ternaries or logical operators instead (see 1.4).

### 1.3 Passing Props

Props are how data flows **down** from parent to child — a one-way street. Think of them as function arguments.

```jsx
function Avatar({ person, size = 100 }) {
  return (
    <img
      className="avatar"
      src={person.imageUrl}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function ProfilePage() {
  return <Avatar person={{ name: 'Ada Lovelace', imageUrl: '/ada.jpg' }} size={80} />;
}
```

Key habits to build: destructure props in the function signature (`{ person, size }`) rather than accessing `props.person` everywhere; use default values (`size = 100`) for optional props instead of littering your JSX with fallback logic; and remember props are **read-only** — a component must never mutate its own props, and if a value needs to change, that change belongs in state, owned by whoever should control it.

> [!warning] Common Pitfall
> "Prop drilling" — passing a prop through five layers of components that don't actually use it, just to get it to a deeply nested child. This is a smell that usually means you want Context (Phase 3) or better composition.

### 1.4 Conditional Rendering

There's no special "if" syntax in JSX — you just use normal JavaScript.

```jsx
function StatusBadge({ isLoggedIn }) {
  // Option 1: if/else before the return (great for complex branching)
  if (isLoggedIn) {
    return <span className="badge green">Online</span>;
  }
  return <span className="badge gray">Offline</span>;
}

function Notification({ count }) {
  return (
    <div>
      {/* Option 2: ternary, for inline either/or */}
      {count > 0 ? <Badge count={count} /> : <EmptyIcon />}
      {/* Option 3: && for "render only if true" */}
      {count > 99 && <span>Wow, that's a lot!</span>}
    </div>
  );
}
```

> [!warning] Common Pitfall
> `{count && <Badge />}` — if `count` is `0`, JSX renders the literal number **`0`** on the screen, because `0` is falsy but still a renderable value. Always coerce to a boolean when using `&&` with numbers: `{count > 0 && <Badge />}`.

### 1.5 Rendering Lists (and the Truth About `key`)

Use `.map()` to turn arrays of data into arrays of elements.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**Why `key` matters:** React doesn't diff your list by looking at content — it uses `key` to match elements between renders. A stable, unique key (usually a database ID) tells React "this is the *same* logical item as before, just maybe reordered," letting React preserve that item's DOM node and internal state instead of destroying and recreating it.

> [!warning] Common Pitfall
> Using the array `index` as a key works visually but breaks badly the moment items are reordered, inserted, or deleted, because the index no longer maps to the "same" logical item — causing state (like an input's typed text) to attach to the wrong row. Only use index as a key for lists that are fully static and never reorder.

```jsx
// Fragile if the list can reorder or filter
{todos.map((todo, index) => <li key={index}>{todo.text}</li>)}

// Stable across reorders/filters
{todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}
```

### 1.6 Keeping Components Pure

This is the rule that underpins *everything* React does, including future optimizations like concurrent rendering: **a component's render logic must be a pure function of its props and state.**

Pure means: given the same inputs, always return the same JSX, with **zero side effects** during rendering (no mutating variables outside the function, no network calls, no writing to `localStorage`, no mutating props/state directly).

```jsx
// Impure: mutates an external variable during render
let renderCount = 0;
function Counter() {
  renderCount++; // side effect during render!
  return <p>Rendered {renderCount} times</p>;
}

// Pure: all data comes from props/state, no external mutation
function Counter({ count }) {
  return <p>Count is {count}</p>;
}
```

> [!tip]
> Why does React care so much about purity? React may call your component function multiple times (Strict Mode double-invokes renders in development specifically to catch this), pause rendering, or re-render without committing to the DOM. If your render logic has side effects, you'll get inconsistent, hard-to-debug behavior. Side effects belong in event handlers or `useEffect`, never in the render body itself.

**Test your understanding:**

Bug hunt —

```jsx
function ShoppingCart({ items }) {
  items.push({ id: 99, name: 'Free Sample' });
  return (
    <ul>
      {items.map((item) => <li>{item.name}</li>)}
    </ul>
  );
}
```

Two bugs: `items.push(...)` mutates the `items` prop directly during render — a purity violation that can cause duplicate items to pile up on every re-render — and the `<li>` is missing a `key` prop. Fixed version:

```jsx
function ShoppingCart({ items }) {
  const displayItems = [...items, { id: 99, name: 'Free Sample' }];
  return (
    <ul>
      {displayItems.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

Quiz — why might using array `index` as a `key` cause a checkbox's checked state to "jump" to the wrong row when you delete an item from the middle of the list? Because React matches elements across renders by `key`, not by content. If keys are indices, deleting item #2 shifts items #3, #4... up to indices #2, #3... — React thinks "the element at key=2 is still there" and reuses its DOM node (including any uncontrolled checked state), but the underlying data it represents has changed. A stable ID key avoids this because the key travels with the actual data item, not its position.

---

## Phase 2: Adding Interactivity

### 2.1 Handling Events

Event handlers are functions you pass (not call!) to JSX attributes.

```jsx
function AlertButton({ message }) {
  function handleClick() {
    alert(message);
  }
  return <button onClick={handleClick}>Click me</button>;
}
```

> [!warning] Common Pitfall
> `onClick={handleClick()}` calls the function immediately during render instead of passing it as a reference. You almost always want `onClick={handleClick}`, or `onClick={() => handleClick(arg)}` if you need to pass arguments.

### 2.2 State: A Component's Memory

Regular variables reset every render and changing them doesn't trigger a re-render. `useState` solves both problems.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

Calling `setCount` does two things: it schedules the new value to be used, and it tells React "please re-render this component." Each component instance gets its **own isolated** state — two `<Counter />`s on the page don't share a count.

> [!tip]
> Hooks (functions starting with `use`) can only be called at the **top level** of a component or another hook — never inside conditions, loops, or nested functions. React relies on hooks being called in the *exact same order* every render to correctly match state to the right `useState` call.

### 2.3 State as a Snapshot (The Concept That Trips Everyone Up)

> [!tip]
> Calling `setState` does **not** mutate the current variable — it schedules a re-render with a new value. Inside the *current* render's event handler, the state variable is a constant, frozen "snapshot" of what it was when that render started. It will not change mid-function, no matter how many times you read it.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // count is 0 here (snapshot)
    setCount(count + 1); // count is STILL 0 here — same snapshot!
    setCount(count + 1); // still 0
    // Result: count becomes 1, not 3!
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

Every `setCount(count + 1)` call above reads the same frozen `count` (which is `0`), so all three calls are equivalent to `setCount(1)`. Fix with the **updater function** form, which receives the latest pending state rather than the stale snapshot:

```jsx
function handleClick() {
  setCount((c) => c + 1); // 0 -> 1
  setCount((c) => c + 1); // 1 -> 2
  setCount((c) => c + 1); // 2 -> 3
  // Result: count becomes 3
}
```

### 2.4 Batching

React groups (batches) multiple `setState` calls triggered within the same event handler into a **single** re-render, for performance. This is exactly why the snapshot behavior above matters — the DOM doesn't update three times, it updates once, after the handler finishes.

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React re-renders ONCE with both updates applied, not twice
}
```

> [!tip]
> Since React 18, this automatic batching happens everywhere — not just in event handlers, but also inside promises, `setTimeout`, and native event handlers. Before React 18, batching only occurred inside React's own event handlers.

### 2.5 Updating Objects and Arrays Immutably

State containing objects or arrays must **never be mutated directly**. Always create a new object/array — React detects changes with a cheap `Object.is` reference comparison, so mutating in place means React sees the *same reference* and assumes nothing changed, silently skipping your re-render.

```jsx
// Mutation — React won't detect this change
function handleMove(e) {
  position.x = e.clientX;
  setPosition(position); // same reference, no re-render!
}

// New object — React sees a new reference and re-renders
function handleMove(e) {
  setPosition({ ...position, x: e.clientX });
}
```

The same rule applies to arrays:

| Operation | Mutating (avoid) | Immutable (use instead) |
|---|---|---|
| Add to end | `arr.push(x)` | `[...arr, x]` |
| Add to start | `arr.unshift(x)` | `[x, ...arr]` |
| Remove item | `arr.splice(i, 1)` | `arr.filter((_, idx) => idx !== i)` |
| Replace item | `arr[i] = x` | `arr.map((item, idx) => idx === i ? x : item)` |
| Insert in middle | `arr.splice(i, 0, x)` | `[...arr.slice(0, i), x, ...arr.slice(i)]` |
| Sort/reverse | `arr.sort()` / `arr.reverse()` | `[...arr].sort()` / `[...arr].reverse()` |
| Update nested object | `obj.nested.value = x` | `{...obj, nested: {...obj.nested, value: x}}` |

> [!warning] Common Pitfall
> For deeply nested state, spreading gets ugly fast (`{...obj, a: {...obj.a, b: {...obj.a.b, c: 1}}}`). This is a strong signal to either flatten your state shape or reach for a helper library like **Immer**, which lets you "mutate" a draft while it produces an immutable result behind the scenes.

**Test your understanding:**

Bug hunt — this "add to cart" button should increment quantity by 3 when clicked once, but only increments by 1:

```jsx
function handleAddThree() {
  setQuantity(quantity + 1);
  setQuantity(quantity + 1);
  setQuantity(quantity + 1);
}
```

Classic stale-snapshot bug: all three calls read the same `quantity` value captured at render time. Fix with updater functions: `setQuantity(q => q + 1)` three times.

Bug hunt — why doesn't the checkbox toggle visually, even though `console.log` shows the state object changing?

```jsx
const [settings, setSettings] = useState({ darkMode: false });
function toggleDarkMode() {
  settings.darkMode = !settings.darkMode; // mutation!
  setSettings(settings);
  console.log(settings); // shows the new value... but UI doesn't update
}
```

`settings` is mutated in place, so `setSettings(settings)` passes the same object reference React already has. React's `Object.is` comparison sees no difference and bails out of re-rendering. Fix: `setSettings({ ...settings, darkMode: !settings.darkMode })`.

---

## Phase 3: Managing State

### 3.1 Reacting to Input with State (Declarative Thinking)

The biggest mindset shift coming from imperative UI (jQuery-style DOM manipulation) is: stop thinking "when X happens, go find element Y and change it," and start thinking "what are all the possible *visual states* this component can be in, and what state variable(s) determine which one is shown?"

```jsx
function LoginForm() {
  const [status, setStatus] = useState('typing'); // 'typing' | 'submitting' | 'success' | 'error'

  if (status === 'success') return <p>Logged in!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input disabled={status === 'submitting'} />
      <button disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Logging in...' : 'Log in'}
      </button>
      {status === 'error' && <p>Something went wrong.</p>}
    </form>
  );
}
```

> [!tip]
> Sketch out every visual state on paper *before* writing code (empty, loading, error, success, partial data...). This upfront step eliminates entire categories of "impossible state" bugs like showing a spinner and an error message at the same time.

### 3.2 Choosing State Structure

Good state design prevents bugs before they happen:

| Principle | What It Means |
|---|---|
| Avoid redundant state | If a value can be *calculated* from existing props/state during render, don't store it in state — just compute it. |
| Avoid contradictions | Don't use two separate booleans (`isLoading`, `isError`) that could accidentally both be `true`. Use one status enum instead. |
| Avoid duplication | Don't store the same piece of data in two different state variables (or nested in two places) — update one, and the other silently goes stale. |
| Avoid deep nesting | Flat state is easier to update immutably. Consider normalizing lists/trees into flat lookup objects keyed by ID. |

```jsx
// Derived state stored redundantly — can go out of sync
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0); // must remember to update this everywhere!

// Derived value computed during render — always correct
const [items, setItems] = useState([]);
const total = items.reduce((sum, item) => sum + item.price, 0);
```

> [!warning] Common Pitfall
> This "store everything in state" habit is one of the most common sources of bugs in React apps. If you find yourself calling `setX` and `setY` together every single time, ask whether `Y` should just be derived from `X` on the fly instead.

### 3.3 Sharing State Between Components (Lifting State Up)

When two sibling components need to reflect or control the same data, move (**lift**) the state to their closest common parent, then pass it back down as props plus a callback to update it.

```jsx
function FilterableList() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox query={query} onQueryChange={setQuery} />
      <ResultsList query={query} />
    </>
  );
}
```

Now `SearchBox` and `ResultsList` are both "dumb" — they don't own the state, they just receive it and report changes upward. This is the foundation of predictable data flow in React: **state lives in exactly one place**, and everything else reflects it.

### 3.4 Preserving and Resetting State

React preserves a component's state as long as it's rendered **at the same position in the tree with the same type**. This explains behavior that often feels surprising:

```jsx
// Same component type at the same JSX "slot" → state is PRESERVED across the toggle
{isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}

// Different key → React treats them as different instances → state RESETS
<Counter key={playerId} />
```

> [!tip]
> To intentionally *reset* a component's state (e.g., clearing a form when switching between editing different users), give it a `key` tied to the identity of what it represents, like `key={user.id}`. Changing the key tells React "this is a brand new instance," so it throws away the old state and starts fresh.

> [!warning] Common Pitfall
> Conditionally rendering different component *types* in the same JSX position (e.g., `<div>` vs `<section>`, or `<LoginForm>` vs `<div><LoginForm /></div>`) resets state even if you didn't intend it to, because React sees a different type at that tree position.

### 3.5 Extracting State Logic with Reducers

When a component has many state updates spread across many event handlers, all touching related state, a `useReducer` can centralize that logic into one predictable function.

```jsx
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':
      return [...tasks, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'deleted':
      return tasks.filter((t) => t.id !== action.id);
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  function handleAdd(text) {
    dispatch({ type: 'added', id: nextId++, text });
  }
  // ...
}
```

Reducers shine when state updates are complex/interrelated, the same action can be triggered from many places, or you want update logic to be easily testable in isolation (a reducer is just a pure function — `(state, action) => newState` — trivial to unit test).

### 3.6 Sharing State Globally with Context

Context solves prop drilling: it lets a parent component make a value available to *any* descendant, no matter how deep, without threading it through every intermediate component's props.

```jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Page /> {/* Page and all its descendants can read theme */}
    </ThemeContext.Provider>
  );
}

function DeeplyNestedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

> [!warning] Common Pitfall
> Context is not a global state management replacement for everything — it's specifically for values that are truly "ambient" to a whole subtree (theme, current user, locale). Overusing Context for frequently-changing, narrowly-scoped state can cause unnecessary re-renders across your whole subtree, since **every** consumer re-renders when the context value changes.

> [!tip]
> The classic combo is **`useReducer` + `Context`** — dispatch and state live in one place via a reducer, and Context makes both available anywhere in the tree without prop drilling. This is a lightweight alternative to external state libraries for small-to-medium apps.

**Test your understanding:**

Architecture quiz — you have a `<Parent>` rendering two siblings, `<TemperatureInput scale="celsius">` and `<TemperatureInput scale="fahrenheit">`, and you want them to always stay in sync. Where should the temperature value live? In `<Parent>` — neither sibling can directly influence the other, so state must be lifted to their closest common ancestor, which passes the current value and an `onChange` handler down to both.

Bug hunt — a settings panel resets its "unsaved changes" every time the user switches tabs, even though it shouldn't:

```jsx
{activeTab === 'profile' && <SettingsForm key="form" />}
{activeTab === 'billing' && <SettingsForm key="form" />}
```

Here the `key` is the same string for both branches, so if this pattern were used to *reset* per-tab (intending different data per tab), it would fail because they share the same key and React treats them as the same instance, preserving state incorrectly. The fix depends on intent: use `key={activeTab}` if you *want* a fresh form per tab, or keep both forms mounted (just toggle visibility with CSS) if you want to preserve unsaved edits across tab switches.

---

## Phase 4: Escape Hatches

These tools let you step **outside** React's declarative model when you truly need to — to remember a value without re-rendering, touch the real DOM, or sync with something outside React's control (a browser API, a subscription, a timer). Reach for them sparingly.

### 4.1 Referencing Values with `useRef`

A ref is a mutable "box" (`{ current: value }`) that persists across renders **without** causing a re-render when it changes. Compare to state, which always triggers a re-render.

```jsx
function StopwatchButton() {
  const clickCount = useRef(0);

  function handleClick() {
    clickCount.current++;
    console.log(`Clicked ${clickCount.current} times`);
    // No re-render happens — the UI won't reflect this number unless
    // you also put it in state.
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render on change? | Yes | No |
| Value persists across renders? | Yes | Yes |
| Mutable directly (`.current =`)? | No (immutable updates only) | Yes |
| Use for | Anything shown in the UI | Timers, DOM nodes, "instance variables" that don't affect rendering |

> [!warning] Common Pitfall
> Never read or write `ref.current` during rendering (i.e., in the component body, not inside an event handler or effect). Refs are an escape hatch specifically *because* they're excluded from React's render/re-render tracking — reading them during render breaks the "pure function of props/state" model and produces unpredictable results.

### 4.2 Manipulating the DOM with Refs

Attach a ref to a JSX element to get a direct handle to its actual DOM node — useful for things React doesn't have a built-in declarative API for, like calling `.focus()`, measuring size, or scrolling into view.

> [!note]
> The source material stopped mid-sentence here. Nothing beyond this point was part of the original guide — worth picking up in the "Manipulating the DOM with Refs" section of react.dev, and likely also covers `useEffect` and synchronizing with external systems, which the original roadmap listed under Phase 4 but the pasted text never reached.
