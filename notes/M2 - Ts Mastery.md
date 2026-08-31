# The TypeScript Field Guide: From "Why Bother?" to "I Get It Now"

## Welcome & Executive Summary

If you already know JavaScript and you're looking at TypeScript wondering "why do I need this extra layer of ceremony?" — this guide is for you. TypeScript isn't a new language you learn from scratch. It's JavaScript with a **safety net and a documentation system built directly into your editor**.

Roadmap, mirroring the official [TypeScript Handbook](https://www.typescriptlang.org/docs/) but reorganized into a progressive skill tree:

| Phase | Focus | You'll walk away being able to... |
|---|---|---|
| **Phase 1** | Core Mental Model & Everyday Types | Annotate variables, functions, and objects confidently |
| **Phase 2** | Mastering the Type System | Narrow types like a detective and banish `any` |
| **Phase 3** | Advanced Types & Generics | Write reusable, type-safe utilities and understand library code |
| **Phase 4** | TypeScript in the Real World | Configure `tsconfig.json`, use TS in React/Node, and decode scary errors |

> [!tip] Use the Playground
> Open the [TypeScript Playground](https://www.typescriptlang.org/play) and paste, break, and fix every snippet here yourself.

**The one mental model to hold onto throughout this entire guide:**

> TypeScript adds a **compile-time layer** that checks your code's shape and logic *before* it runs. It disappears completely at runtime — it compiles down to plain JavaScript. It's not about making JavaScript "stricter" for its own sake; it's about **catching the mistakes you'd otherwise only find in production, from a user's bug report.**

---

## Phase 1: The Core Mental Model & Everyday Types

### 1.1 Why Does TypeScript Even Exist?

JavaScript is **dynamically typed** — a variable can hold a string today and a number tomorrow, and JS won't complain until something breaks at runtime.

```javascript
// Vanilla JavaScript — this runs, but the inputs make no sense
function calculateTotal(price, quantity) {
  return price * quantity;
}
calculateTotal(undefined, 3); // NaN, silently, with no warning until a customer complains
```

```typescript
// TypeScript — the mistake is caught while you're still typing
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
calculateTotal("29.99", 3);
// Compile Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

That red squiggly line is the entire value proposition of TypeScript: **it moves bug discovery from "customer support ticket" to "red squiggle in your editor, five seconds after you made the typo."**

> [!tip] Aha! Moment
> TypeScript's type checker reads your code and asks "if I traced every possible path through this program, could this ever break?" JavaScript can't answer that until code actually runs. TypeScript answers it statically, without running anything.

### 1.2 The Mental Model: Types Describe "Shape," Not "Class"

Coming from Java or C#, people assume TypeScript's type system is about rigid class hierarchies. It's not. TypeScript uses a **structural type system** ("duck typing"): if it walks like a duck and quacks like a duck, TypeScript treats it as a duck — regardless of what it's *named*.

```typescript
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

const myObject = { x: 10, y: 20, z: 30 }; // extra property, no explicit "Point" label
printPoint(myObject); // fine — it HAS the required shape
```

> [!tip]
> This is different from nominal typing (matching by declared name). In TypeScript, two differently-named types are compatible if their **shapes** match. This explains most "why did TypeScript accept/reject this?" confusion later.

### 1.3 Primitive Types

```typescript
let username: string = "ada_lovelace";
let age: number = 36;
let isActive: boolean = true;
let nothingHere: null = null;
let notAssignedYet: undefined = undefined;
let bigNumber: bigint = 100n;
let uniqueId: symbol = Symbol("id");
```

> [!tip]
> In practice you'll rarely write `let age: number = 36`. TypeScript infers the type automatically. Only annotate when the type isn't obvious from context (like function parameters).

```typescript
let age = 36; // inferred as `number` automatically — no annotation needed
```

**Quiz — guess the inferred type before checking:**

```typescript
let a = "hello";
let b = [1, 2, 3];
let c = { name: "Sam" };
let d = (x: number) => x * 2;
```

Answers: `a: string` · `b: number[]` · `c: { name: string }` · `d: (x: number) => number`

### 1.4 Arrays and Tuples

```typescript
const scores: number[] = [90, 85, 77];
const names: Array<string> = ["Grace", "Alan"]; // equivalent generic syntax
```

**Tuples** are TypeScript's answer to "an array where position *means* something" — a fixed-length record.

```javascript
// Vanilla JS — this pair is just an array, nothing stops misuse
function makeCoordinate() {
  return [40.7128, -74.006];
}
const coord = makeCoordinate();
coord.push("oops"); // allowed, silently corrupts the data
```

```typescript
// TypeScript tuple — enforces exact length and per-position types
function makeCoordinate(): [latitude: number, longitude: number] {
  return [40.7128, -74.006];
}
const coord = makeCoordinate();
coord.push("oops"); // Error: 'string' is not assignable to parameter of type 'number'
```

> [!warning] Common Pitfall
> `push()` on tuples is a known TypeScript blind spot — it doesn't fully block pushes the way indexed access is blocked. Don't rely on tuples to prevent *all* mutation; use `readonly` tuples (`readonly [number, number]`) for that guarantee.

### 1.5 Objects and Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // optional property
  readonly createdAt: Date; // cannot be reassigned after creation
}

function greet(user: User) {
  console.log(`Hi ${user.name}`);
}
```

### 1.6 Functions

```javascript
// Vanilla JS — no indication of what "options" should contain
function createUser(name, options) {
  return { name, role: options.role || "member" };
}
```

```typescript
// TypeScript — the function signature IS the documentation
function createUser(
  name: string,
  options: { role?: string }
): { name: string; role: string } {
  return { name, role: options.role ?? "member" };
}
```

> [!tip] Aha! Moment
> A well-typed function signature means you never have to open the function body to know what it expects or returns. Your editor shows it on hover — documentation that **cannot go out of date**, because the compiler enforces it.

**Function types as values:**

```typescript
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
```

### 1.7 Union & Intersection Types

Unions represent "this OR that." Intersections represent "this AND that, combined."

```typescript
// Union: a value that can be one of several types
type Status = "loading" | "success" | "error";

function renderStatus(status: Status) {
  if (status === "loading") return "loading";
  if (status === "success") return "success";
  return "error";
}

// Intersection: merge multiple shapes into one
type Timestamped = { createdAt: Date };
type Named = { name: string };
type Record = Timestamped & Named; // must have BOTH createdAt and name
```

> [!warning] Common Pitfall
> New TypeScript users often reach for a `string` type where a **union of string literals** would be far safer.

```typescript
// Loose — allows any string, including typos like "sucess"
function setStatus(status: string) {}

// Tight — only these exact values are allowed, typos are caught instantly
function setStatus(status: "loading" | "success" | "error") {}
```

### 1.8 Type Aliases vs. Interfaces

| Feature | `type` | `interface` |
|---|---|---|
| Object shapes | Yes | Yes |
| Unions / primitives / tuples | Yes | No |
| Declaration merging (re-opening later) | No | Yes |
| Extending another shape | via `&` intersection | via `extends` |
| Best for | unions, function types, mapped/conditional types | public API shapes, class contracts |

```typescript
// interface: extends cleanly, can be merged/re-opened by libraries
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// type: needed for unions, and works fine for objects too
type ID = string | number;
type Point = { x: number; y: number };
```

> [!tip] Best Practice (Production Reality)
> Most teams default to `interface` for object shapes (especially public-facing ones, like component props or API contracts) because the error messages are cleaner and it supports declaration merging. Reach for `type` when you need unions, tuples, or advanced type manipulation (Phase 3). Consistency matters more than the specific choice — pick a convention with your team and stick to it.

**Fix the bug:**

```typescript
interface Product {
  id: number;
  price: number;
}

function applyDiscount(product: Product, percentage: number) {
  return product.price - (product.price * percentage);
}

applyDiscount({ id: 1, price: 100 }, "10");
```

`percentage` is typed as `number`, but `"10"` (a string) is passed in — TypeScript flags this at the call site. Fix: pass `0.10` (a number), or if you intend to accept percentage strings from user input, explicitly convert with `Number(percentage)` before calling.

---

## Phase 2: Mastering the Type System

### 2.1 Literal Types

Literal types work for numbers and booleans too, and they're the backbone of precise APIs.

```typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type Alignment = "left" | "center" | "right";
```

> [!tip]
> `as const` locks a value's type down to its literal form instead of widening it to `string`/`number`.

```typescript
let a = "left";          // type: string (widened)
let b = "left" as const; // type: "left" (literal, exact)

const config = { align: "center" } as const;
// config.align is now type "center", not string
```

### 2.2 Narrowing — TypeScript's Detective Mode

**Narrowing** is how TypeScript progressively figures out a more specific type within a block of code, based on runtime checks you've already written.

```javascript
// Vanilla JS — you have to trust yourself that `id` really is a string here
function printId(id) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2)); // works, but easy to forget this branch exists
  }
}
```

```typescript
// TypeScript — inside each branch, the type is automatically narrowed
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // TS knows: id is `string` here
  } else {
    console.log(id.toFixed(2)); // TS knows: id is `number` here
  }
}
```

> [!tip] Aha! Moment
> Narrowing means you rarely need to manually "cast" types. Just write the `if` check you'd naturally write to make your logic correct, and TypeScript rides along, updating its understanding of the type at every branch.

**Common narrowing techniques:**

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === "string") { /* value: string */ }
}

// truthiness guard
function printLength(value?: string) {
  if (value) { console.log(value.length); } // value: string
}

// instanceof guard
function handle(error: Error | TypeError) {
  if (error instanceof TypeError) { /* error: TypeError */ }
}

// "in" operator guard
type Cat = { meow: () => void };
type Dog = { bark: () => void };
function speak(animal: Cat | Dog) {
  if ("meow" in animal) { animal.meow(); } // animal: Cat
  else { animal.bark(); } // animal: Dog
}

// discriminated union guard (the MVP pattern for real-world apps)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape) {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
  }
}
```

> [!tip] Best Practice
> The **discriminated union** pattern (a shared literal "tag" property like `kind`) is one of the most powerful patterns in real-world TypeScript. It's how you model API responses (`{ status: "success", data }` vs `{ status: "error", message }`), Redux actions, form states, and more — all with full type safety in every branch.

### 2.3 Custom Type Guards

Sometimes the built-in narrowing tools aren't enough, so you write your own predicate function.

```typescript
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // narrowed to Fish
  } else {
    pet.fly(); // narrowed to Bird
  }
}
```

The `pet is Fish` return type is a **type predicate**: it tells TypeScript "if this function returns `true`, treat the argument as a `Fish` from that point onward."

### 2.4 `unknown` vs `any` — The Most Important Distinction in the Language

| | `any` | `unknown` |
|---|---|---|
| Turns off type checking | Yes, completely | No |
| Can call methods on it directly | Yes (unsafe!) | No — must narrow first |
| Assignable to other types without checks | Yes (unsafe!) | No |
| Use case | Legacy migration escape hatch (avoid!) | Genuinely unknown data (API responses, `JSON.parse`, catch blocks) |

```typescript
function handleAny(data: any) {
  data.toUpperCase(); // compiles, but explodes at runtime if data is a number
}

function handleUnknown(data: unknown) {
  data.toUpperCase(); // compile error — forces you to check first
  if (typeof data === "string") {
    data.toUpperCase(); // safe, narrowed
  }
}
```

> [!warning] Common Pitfall
> `any` is not "TypeScript's version of JavaScript" — it's a hole punched straight through your type safety net. Every `any` in a codebase is a spot where a bug can silently pass every check. **Prefer `unknown` for anything genuinely uncertain** and narrow it before use.

> [!tip] Best Practice
> Turn on `noImplicitAny` (bundled into `strict` mode — Phase 4) so TypeScript *forces* you to be intentional every time `any` sneaks in.

### 2.5 `never` — The Type of "This Should Be Impossible"

`never` represents a value that can literally never occur — a function that always throws, or a branch that's logically unreachable.

```typescript
function throwError(message: string): never {
  throw new Error(message);
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default:
      // If a new shape is added to the union and a case is missed above,
      // `shape` here won't be `never`, and TypeScript will flag it!
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
}
```

> [!tip] Aha! Moment
> This "exhaustiveness check" pattern is a superpower. When someone adds a new shape variant to your union six months from now and forgets to handle it in `area()`, this `default` case throws a **compile error**, not a silent runtime bug. `never` makes your future self's mistakes impossible.

**Narrowing quiz:**

```typescript
function formatValue(value: string | string[] | null) {
  // how do you safely handle all three cases?
}
```

Sample solution:

```typescript
function formatValue(value: string | string[] | null) {
  if (value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  return value.toUpperCase();
}
```

Note: `Array.isArray()` is itself a built-in type guard TypeScript understands.

---

## Phase 3: Advanced Types & Generics

### 3.1 Why Generics Exist

```javascript
// Vanilla JS — this function works for any type, but tells you nothing
function firstElement(arr) {
  return arr[0];
}
```

If you type this naively as `(arr: any[]) => any`, you lose all information about what's actually inside the array. Generics solve this: **they let a function be reusable across types while still preserving the type relationship between input and output.**

```typescript
function firstElement<T>(arr: T[]): T {
  return arr[0];
}

const num = firstElement([1, 2, 3]);  // num: number
const str = firstElement(["a", "b"]); // str: string
```

> [!tip] Aha! Moment
> Think of `<T>` as a placeholder variable — but for *types* instead of values. You're saying "whatever type goes in as the array's contents, that exact same type comes out." TypeScript solves for `T` at each call site.

### 3.2 Generic Constraints

Sometimes you need to say "T can be anything, *as long as* it has a certain shape."

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): T {
  console.log(item.length);
  return item;
}

logLength("hello");    // strings have .length
logLength([1, 2, 3]);  // arrays have .length
logLength(42);         // Error: numbers don't have .length
```

> [!warning] Common Pitfall
> Beginners often write `<T,>` generics with no constraint at all, then get frustrated that they can't access `.length` or `.id` on `T`. If you're accessing a property, you need `extends` to promise TypeScript that property will always exist.

### 3.3 Generic Interfaces

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

const userResponse: ApiResponse<{ name: string }> = {
  data: { name: "Ada" },
  status: 200,
};
```

### 3.4 `keyof` — Turning Object Shapes into Union Types

```typescript
interface Car {
  make: string;
  model: string;
  year: number;
}

type CarKey = keyof Car; // "make" | "model" | "year"

function getCarProperty<T, K extends keyof T>(car: T, key: K): T[K] {
  return car[key];
}

const myCar: Car = { make: "Toyota", model: "Corolla", year: 2022 };
const year = getCarProperty(myCar, "year"); // number
getCarProperty(myCar, "color"); // Error: "color" is not a key of Car
```

> [!tip] Aha! Moment
> `keyof` turns the *keys* of an object type into a union of string literal types. Combined with a generic constraint (`K extends keyof T`), functions like `getCarProperty` become impossible to call with a typo'd property name — the compiler catches it before you even run the code.

### 3.5 Mapped Types

Mapped types let you build a new type by transforming every property of an existing one.

```typescript
interface Car {
  make: string;
  model: string;
  year: number;
}

type ReadonlyCar = {
  readonly [K in keyof Car]: Car[K];
};

type OptionalCar = {
  [K in keyof Car]?: Car[K];
};
```

This is precisely how built-in utility types like `Readonly<T>` and `Partial<T>` (below) are implemented under the hood.

### 3.6 Conditional Types

Conditional types let a type "branch" based on a check, similar to a ternary — but at the type level.

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<"hello">; // "yes"
type B = IsString<42>;      // "no"
```

A more practical example — extracting a wrapped type without running anything:

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Result1 = UnwrapPromise<Promise<string>>; // string
type Result2 = UnwrapPromise<number>;          // number
```

> [!tip]
> `infer` lets you "capture" a type from within a larger structure. You don't need to master writing complex conditional types early on — but recognizing this pattern will help you read library type definitions (like React or Zod) without panicking.

### 3.7 The Utility Types You'll Actually Use Every Week

| Utility | What it does | Example |
|---|---|---|
| `Partial<T>` | Makes all properties optional | `Partial<User>` for PATCH update payloads |
| `Required<T>` | Makes all properties required | Enforcing a fully-filled config object |
| `Readonly<T>` | Makes all properties immutable | Protecting state objects from mutation |
| `Pick<T, K>` | Selects a subset of properties | `Pick<User, "id" \| "email">` for a lightweight DTO |
| `Omit<T, K>` | Removes a subset of properties | `Omit<User, "password">` before sending to the client |
| `Record<K, V>` | Builds an object type from key/value types | `Record<string, number>` for a lookup table |
| `ReturnType<T>` | Extracts a function's return type | Reusing a return shape without redeclaring it |

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UpdateUserDto = Partial<Omit<User, "id">>;
// { name?: string; email?: string; password?: string }

type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string }

type UserRolesMap = Record<"admin" | "editor" | "viewer", string[]>;
// { admin: string[]; editor: string[]; viewer: string[] }
```

> [!tip] Best Practice
> Reach for these utility types *before* hand-writing a near-duplicate interface. If you find yourself copy-pasting an interface and removing/adding a couple fields, use `Pick`, `Omit`, or `Partial` instead — it keeps both types linked, so if the base `User` interface changes, your derived type updates automatically.

**Generics challenge:** write a generic `pluck` that takes an array of objects and a key, returning an array of just that key's values.

```typescript
pluck([{ id: 1 }, { id: 2 }], "id"); // should return number[]
```

Sample solution:

```typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
```

---

## Phase 4: TypeScript in the Real World

### 4.1 `tsconfig.json` Essentials

Your `tsconfig.json` is the control panel for how strict and modern your TypeScript setup behaves. A solid, production-ready baseline:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",               // JS version to compile down to
    "module": "ESNext",               // module system (ESNext for bundlers)
    "moduleResolution": "Bundler",
    "strict": true,                   // turns on ALL strict checks (see below)
    "esModuleInterop": true,          // smooths over CommonJS/ESM import quirks
    "skipLibCheck": true,             // don't re-check .d.ts files in node_modules (faster builds)
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true, // arr[i] returns T | undefined, not just T
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

> [!tip]
> `"strict": true` is shorthand that enables a whole bundle of flags at once, including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and more. **Always start new projects with `strict: true`.** Turning it on later in a mature codebase is painful; turning it off later "because it's annoying" throws away most of TypeScript's value.

| Flag | What happens if it's OFF | Why turn it ON |
|---|---|---|
| `strictNullChecks` | `null`/`undefined` silently assignable anywhere | Catches the #1 cause of runtime crashes: "Cannot read property of undefined" |
| `noImplicitAny` | Untyped parameters silently become `any` | Forces intentional typing everywhere |
| `strictFunctionTypes` | Function parameter types checked loosely | Prevents unsound callback assignments |
| `noUncheckedIndexedAccess` | `arr[i]` is typed as `T`, ignoring out-of-bounds access | Forces you to handle `undefined` from array/object lookups |

> [!warning] Common Pitfall
> Many teams install TypeScript, get a wall of red errors, and immediately turn `strict` off "to unblock the sprint." This just defers the pain and lets bugs back in through the same door. Instead, use `// @ts-expect-error` with a comment on individual lines you genuinely need to unblock, and fix them incrementally.

### 4.2 React + TypeScript

```tsx
// Typing props with an interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{label}</button>;
}

// Typing useState — TS infers from the initial value, but be explicit for unions
const [count, setCount] = useState(0);              // inferred: number
const [user, setUser] = useState<User | null>(null); // explicit: needed because null gives no info
```

> [!tip]
> For `useState`, if your initial value doesn't fully describe future possible values (like starting at `null` but eventually holding a `User` object), always add the explicit generic: `useState<User | null>(null)`.

### 4.3 Node.js + TypeScript

```typescript
import { readFile } from "node:fs/promises";

interface Config {
  // (source note: the original guide was cut off here before defining
  // the Config shape and the rest of the Node.js section — nothing was
  // trimmed on purpose, this is simply where the pasted text ended)
}
```

> [!note]
> The source material stopped mid-section here. Nothing beyond this point was part of the original guide — worth flagging to Samvel or filling in yourself once you've gone through the Node.js + TypeScript chapter of the Handbook.
