# The JavaScript Mastery Guide

Each phase builds on the last. Resist the urge to skip to async before closures make sense — it *will* bite you later.

---

## Phase 1: JS Fundamentals & Data Types

### 1.1 Variables & Declarations

| Keyword | Scope | Re-declarable? | Hoisted? | Initial value before assignment |
|---|---|---|---|---|
| `var` | Function scope | Yes | Yes (to `undefined`) | `undefined` |
| `let` | Block scope | No | Yes (but in "Temporal Dead Zone") | ReferenceError if accessed |
| `const` | Block scope | No | Yes (TDZ too) | ReferenceError if accessed |

> [!warning] Common Pitfall
> The classic `var` loop bug.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0, 1, 2
}
```

**Why?** `var` has *one* binding shared across all loop iterations (function-scoped), so by the time the callbacks run, `i` has already reached `3`. `let` creates a **fresh binding per iteration** (block-scoped), so each closure captures its own snapshot.

> [!tip]
> Default to `const`. Switch to `let` only when you *know* you'll reassign. Avoid `var` entirely in modern code.

### 1.2 Execution Context & Scope Chains

Every time a function is called, the engine creates an **Execution Context**: a record containing the local variables, the value of `this`, and a reference to the **outer lexical environment**. Chain these outer references together and you get the **scope chain** — the mechanism the engine uses to resolve any variable name by walking outward until it finds it (or throws a `ReferenceError`).

```javascript
function outer() {
  const secret = "cookie";
  function inner() {
    console.log(secret); // found via the scope chain, not "in" inner
  }
  inner();
}
outer();
```

This lexical lookup — decided at **write-time**, not run-time — is exactly what makes closures possible (more in Phase 2).

### 1.3 Type Conversion vs. Type Coercion

- **Conversion**: You *explicitly* change a type: `Number("42")`, `String(42)`, `Boolean(0)`.
- **Coercion**: JavaScript *implicitly* changes a type for you, usually inside operators like `+`, `==`, or in `if` conditions.

```javascript
"5" + 3     // "53"   (number coerced to string, + prefers concatenation)
"5" - 3     // 2      (string coerced to number, - has no string meaning)
"5" * "2"   // 10
[] + []     // ""     (arrays → strings → concatenated empty strings)
[] + {}     // "[object Object]"
```

> [!warning] Common Pitfall
> The `==` operator triggers coercion; `===` never does. Always prefer `===` unless you have an explicit, documented reason.

| Expression | Result | Reason |
|---|---|---|
| `null == undefined` | `true` | Special case rule |
| `null === undefined` | `false` | Different types |
| `0 == false` | `true` | Both coerce to `0` |
| `"" == false` | `true` | Empty string coerces to `0` |
| `NaN == NaN` | `false` | `NaN` never equals anything, even itself |

```javascript
Number.isNaN(NaN);       // true — the safe way to check
Object.is(NaN, NaN);     // true
```

### 1.4 Primitives vs. Objects

| | Primitives (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) | Objects (`{}`, `[]`, functions) |
|---|---|---|
| Stored as | Value, directly | Reference (pointer to heap) |
| Copied by | Value | Reference |
| Mutable? | No (immutable) | Yes |
| Compared by | Value | Reference identity |

```javascript
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — untouched, primitives copy by value

let obj1 = { count: 10 };
let obj2 = obj1;
obj2.count = 20;
console.log(obj1.count); // 20 — same object in memory!
```

> [!warning] Common Pitfall — Mutability trap

```javascript
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] — const stops reassignment, NOT mutation!
```

`const` only guarantees the *variable binding* can't be reassigned — it says nothing about the *contents* of an object or array. For real immutability, use `Object.freeze()` (shallow) or spread/copy patterns.

### 1.5 Arrays, Iterables & Destructuring

```javascript
const nums = [1, 2, 3, 4, 5];

// Destructuring with defaults & rest
const [first, second, ...rest] = nums;
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Object destructuring with renaming & defaults
const user = { name: "Dan", role: "dev" };
const { name: username, level = "junior" } = user;
console.log(username, level); // Dan junior
```

Any object implementing the **iterable protocol** (has a `[Symbol.iterator]` method) works in `for...of`, spread `...`, and destructuring — this includes arrays, strings, `Map`, `Set`, and NodeLists, but **not** plain objects by default.

### 1.6 Map, Set & JSON

| Structure | Keys | Use when |
|---|---|---|
| `Object` | Strings/Symbols only | Simple records, JSON interop |
| `Map` | **Any** value (objects, functions, etc.) | Frequent add/remove, key type flexibility |
| `Set` | N/A — unique values only | Deduplication, membership tests |

```javascript
const map = new Map();
const objKey = {};
map.set(objKey, "value for an object key!");
map.set("str", "value for a string key");
console.log(map.size); // 2

const uniqueTags = new Set(["js", "css", "js", "html"]);
console.log(uniqueTags); // Set(3) {'js', 'css', 'html'}
```

```javascript
const data = { name: "Dan", skills: ["JS", "CSS"] };
const json = JSON.stringify(data);       // '{"name":"Dan","skills":["JS","CSS"]}'
const parsed = JSON.parse(json);         // back to an object
```

> [!warning] Common Pitfall
> `JSON.stringify` silently **drops** `undefined`, functions, and `Symbol` values, and throws on circular references.

**Test your understanding:**

```javascript
console.log(1 + "1");
console.log(1 + +"1");
console.log([1,2] + [3,4]);
console.log(typeof NaN);
console.log(typeof null);
```

Answers: `"11"`, `2`, `"1,23,4"`, `"number"`, `"object"` (a famous historical JS bug!)

---

## Phase 2: Advanced Functions & Objects

### 2.1 Objects Are Passed by Reference

```javascript
function grow(userObj) {
  userObj.age++;
}
const person = { age: 30 };
grow(person);
console.log(person.age); // 31 — the function mutated the original
```

> [!tip]
> If you don't want a function to mutate your input, clone it first: `{ ...obj }` (shallow) or `structuredClone(obj)` (deep, modern browsers/Node 17+).

### 2.2 The `this` Keyword: Execution Rules, Not Definition Rules

`this` is **not** determined by where a function is *written* — it's determined by **how it's called**. There are four binding rules, in order of precedence:

| Rule | Trigger | Example |
|---|---|---|
| `new` binding | Called with `new` | `new Foo()` → `this` = new object |
| Explicit binding | `.call()`, `.apply()`, `.bind()` | `fn.call(obj)` → `this` = `obj` |
| Implicit binding | Called as a method | `obj.fn()` → `this` = `obj` |
| Default binding | Plain function call | `fn()` → `this` = `undefined` (strict mode) or global object |

```javascript
const counter = {
  count: 0,
  increment() {
    this.count++;
  }
};

const detached = counter.increment;
// detached(); // Error — "this" is undefined, not "counter"!
counter.increment(); // works — implicit binding
```

> [!warning] Common Pitfall
> Passing an object method as a callback loses its `this`.

```javascript
class Timer {
  constructor() { this.seconds = 0; }
  tick() { this.seconds++; console.log(this.seconds); }
}
const t = new Timer();
setTimeout(t.tick, 1000); // TypeError: this.seconds is undefined-ish

// Fixes:
setTimeout(() => t.tick(), 1000);      // arrow wraps it, this stays lexical
setTimeout(t.tick.bind(t), 1000);      // explicit binding
```

### 2.3 Arrow Functions vs. Regular Functions

| | Regular function | Arrow function |
|---|---|---|
| Has its own `this`? | Yes (set at call-time) | No — inherits `this` from enclosing scope (lexical) |
| Has `arguments` object? | Yes | No |
| Can be a constructor (`new`)? | Yes | No — throws |
| Good for | Object methods, constructors | Callbacks, preserving outer `this` |

```javascript
const obj = {
  name: "Widget",
  regularMethod() { console.log(this.name); },   // "Widget"
  arrowMethod: () => { console.log(this.name); } // undefined! (this = outer scope, not obj)
};
obj.regularMethod();
obj.arrowMethod();
```

> [!warning] Common Pitfall
> Never use arrow functions to define object methods that need `this` to point to the object.

### 2.4 Function Binding: `call`, `apply`, `bind`

```javascript
function greet(greeting) { console.log(`${greeting}, ${this.name}`); }
const user = { name: "Dan" };

greet.call(user, "Hi");              // Hi, Dan — invokes immediately, args listed
greet.apply(user, ["Hi"]);           // Hi, Dan — invokes immediately, args as array

const boundGreet = greet.bind(user); // returns a NEW function, permanently bound
boundGreet("Hey");                    // Hey, Dan
```

### 2.5 Closures — The Feature Behind "Private" Data

> A closure is a function bundled together with references to its **surrounding lexical scope**. The function "remembers" the environment it was created in, even after that outer function has returned.

```javascript
function makeCounter() {
  let count = 0; // private — inaccessible from outside
  return {
    increment: () => ++count,
    reset: () => (count = 0)
  };
}

const counter = makeCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.reset();     // 0
```

**Under the hood:** normally, when `makeCounter` finishes executing, its execution context would be popped off the call stack and its variables garbage collected. But because `increment` and `reset` still hold a live reference to `count`, the garbage collector can't reclaim it — the closure keeps it alive in the heap.

### 2.6 Garbage Collection & Memory Leaks

JS engines use **mark-and-sweep**: starting from "roots" (global objects, currently-running functions), the engine marks everything reachable, then sweeps away anything unreachable. If your code keeps a reference alive that you no longer need, you leak memory.

> [!warning] Common Pitfall — memory leak via closures/listeners

```javascript
function attachHandler() {
  const hugeData = new Array(1_000_000).fill("data");
  document.getElementById("btn").addEventListener("click", () => {
    console.log(hugeData.length); // keeps hugeData alive forever
  });
}
```

**Fix:** remove listeners when done (`removeEventListener`), null out large references you no longer need, and be wary of long-lived closures capturing big data unnecessarily.

### 2.7 Rest & Spread

```javascript
function sum(...nums) {           // rest — gathers args into an array
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6

const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 }; // spread — expands into a new object
console.log(extended); // { a: 1, b: 2, c: 3 }
```

> [!tip]
> Spread is your best friend for immutable updates: `const updated = { ...state, loading: true }`.

**Bug hunt:**

```javascript
const user = {
  name: "Dan",
  hobbies: ["chess", "reading"],
  greet: function () {
    setTimeout(function () {
      console.log(`Hi, I'm ${this.name} and I like ${this.hobbies[0]}`);
    }, 100);
  }
};
user.greet(); // Bug: logs "Hi, I'm undefined and I like ..." → TypeError
```

The inner `function` loses `this` because it's called plainly by `setTimeout` (default binding). Fix with an arrow function: `setTimeout(() => { console.log(...) }, 100);` — arrows inherit `this` lexically from `greet`.

---

## Phase 3: Prototypes & Classes

### 3.1 Prototypal Inheritance — The Real Mechanism

Every object has an internal link, `[[Prototype]]`, accessible via `Object.getPrototypeOf(obj)` or the legacy `__proto__`. When you access a property, the engine checks the object itself first, then walks up the **prototype chain** until it finds the property or hits `null`.

```javascript
const animal = {
  eats: true,
  walk() { console.log("Animal walks"); }
};

const rabbit = Object.create(animal); // rabbit's [[Prototype]] = animal
rabbit.jumps = true;

console.log(rabbit.eats);  // true (found on prototype)
rabbit.walk();             // "Animal walks" (inherited method)
```

> [!tip]
> This is why JS is called *prototypal* rather than *classical* — inheritance is about **live object links**, not blueprint copying.

### 3.2 The `prototype` Property (Functions Only)

```javascript
function Dog(name) { this.name = name; }
Dog.prototype.bark = function () { console.log(`${this.name} says Woof!`); };

const rex = new Dog("Rex");
rex.bark(); // Rex says Woof! — found via Dog.prototype
```

`new Dog("Rex")` does three things: creates a new empty object, sets its `[[Prototype]]` to `Dog.prototype`, and runs `Dog` with `this` bound to that new object.

### 3.3 Class Syntax — Syntactic Sugar Over Prototypes

```javascript
class Animal {
  #energy = 100; // truly private field (not just convention)
  constructor(name) {
    this.name = name;
  }
  eat() {
    this.#energy += 10;
    return `${this.name} has ${this.#energy} energy`;
  }
}

class Dog extends Animal {
  bark() { return `${this.name} says Woof!`; }
}

const rex = new Dog("Rex");
console.log(rex.bark());        // Rex says Woof!
console.log(rex.eat());         // Rex has 110 energy
console.log(rex.#energy);       // SyntaxError — truly private, not accessible outside the class
```

| Feature | Syntax | Accessible outside class? |
|---|---|---|
| Public field | `name` | Yes |
| Private field | `#energy` | No — enforced by the engine |
| "Protected" (convention only) | `_energy` | Technically yes, but treat as off-limits |

> [!warning] Common Pitfall
> JS has no real "protected" access modifier — the underscore prefix (`_field`) is purely a *social contract*, not enforced. Only `#field` is truly private.

### 3.4 Inheritance Under the Hood

```javascript
class Base {
  constructor() { console.log("Base ctor"); }
  greet() { console.log("Hi from Base"); }
}

class Child extends Base {
  constructor() {
    super(); // MUST call before using "this" — sets up the prototype chain link
    console.log("Child ctor");
  }
  greet() {
    super.greet(); // explicitly calls the parent version
    console.log("Hi from Child");
  }
}

new Child().greet();
// Base ctor
// Child ctor
// Hi from Base
// Hi from Child
```

`extends` sets `Child.prototype`'s `[[Prototype]]` to `Base.prototype`, chaining lookups exactly like the manual `Object.create` example earlier — classes are prototypes wearing a friendlier syntax.

**Output prediction:**

```javascript
function Bird() {}
Bird.prototype.fly = function () { return "flying"; };
const tweety = new Bird();
Bird.prototype.fly = function () { return "soaring"; };
console.log(tweety.fly());
```

Answer: `"soaring"` — `tweety` doesn't own a `fly` method; it looks it up live on `Bird.prototype` every call, so reassigning the prototype method affects all existing instances too.

---

## Phase 4: Asynchronous JavaScript

### 4.1 Callbacks & "Callback Hell"

```javascript
getUser(1, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments); // deeply nested — hard to read/maintain
    });
  });
});
```

### 4.2 Promises — A Container for a Future Value

A Promise has three states: **pending → fulfilled** or **pending → rejected** (once settled, it never changes again).

```javascript
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    success ? resolve("Data loaded") : reject(new Error("Failed"));
  }, 1000);
});

fetchData
  .then(result => console.log(result))
  .catch(err => console.error(err.message))
  .finally(() => console.log("Done, regardless of outcome"));
```

### 4.3 Promise Chaining

```javascript
getUser(1)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error("Something failed:", err.message));
```

> [!tip]
> Each `.then()` returns a **new promise**. Returning a promise from inside `.then()` automatically flattens/chains it — no manual nesting required.

### 4.4 `async`/`await` — Syntactic Sugar Over Promises

```javascript
async function loadUserData() {
  try {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error("Something failed:", err.message);
  }
}
```

`await` pauses the `async` function (without blocking the whole thread!) until the promise settles. An `async` function *always* returns a promise, even if you `return` a plain value.

> [!warning] Common Pitfall — unhandled promise rejection

```javascript
async function risky() {
  throw new Error("boom");
}
risky(); // UnhandledPromiseRejection — no one caught it!

// Fixes:
risky().catch(err => console.error(err));      // works
// or wrap the await in try/catch inside an async caller
```

> [!warning] Common Pitfall — sequential vs. parallel awaits

```javascript
// Slow: each await blocks the next from starting
const a = await taskA(); // waits fully
const b = await taskB(); // then starts

// Fast: run independent tasks in parallel
const [a, b] = await Promise.all([taskA(), taskB()]);
```

| Promise combinator | Behavior |
|---|---|
| `Promise.all()` | Waits for all; rejects immediately if **any** rejects |
| `Promise.allSettled()` | Waits for all; never rejects, gives status of each |
| `Promise.race()` | Settles as soon as the **first** promise settles (win or lose) |
| `Promise.any()` | Settles as soon as the **first** one fulfills; ignores rejections unless all reject |

### 4.5 The Event Loop, Macrotasks & Microtasks

This is the single most-tested JS interview concept — let's nail it.

- **Call stack**: runs synchronous code, one frame at a time.
- **Microtask queue**: holds `.then()`/`.catch()` callbacks and `queueMicrotask()` — **always drained completely** before the next macrotask.
- **Macrotask queue**: holds `setTimeout`, `setInterval`, I/O, UI rendering callbacks.

**The loop's rule:** after each macrotask finishes, the engine drains the *entire* microtask queue before picking up the next macrotask.

```javascript
console.log("1: sync");
setTimeout(() => console.log("2: macrotask (setTimeout)"), 0);
Promise.resolve().then(() => console.log("3: microtask (promise)"));
console.log("4: sync");

// Output order:
// 1: sync
// 4: sync
// 3: microtask (promise)
// 2: macrotask (setTimeout)
```

> [!tip]
> Microtasks *always* win against macrotasks, even if the macrotask was scheduled first with a `0ms` delay. This is a favorite "gotcha" interview question.

**Output prediction:**

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));
console.log("E");
```

Answer: `A, E, C, D, B` — synchronous code first, then the full microtask chain (C then D), then finally the macrotask (B).

---

## Phase 5: Cheatsheet & Interactive Challenge Bank

### 5.1 Quick Reference Cheatsheet

| Concept | One-line reminder |
|---|---|
| `var` vs `let`/`const` | `var` leaks to function scope; `let`/`const` respect blocks |
| `==` vs `===` | `===` never coerces types — prefer it always |
| Primitives vs Objects | Copied by value vs. copied by reference |
| Arrow `this` | Lexical — inherited from where it's *defined*, not called |
| Closures | Inner function "remembers" outer variables even after outer returns |
| Prototype chain | Property lookup walks up `[[Prototype]]` links until found or `null` |
| `#private` fields | Enforced privacy — not just naming convention like `_field` |
| Microtasks vs Macrotasks | Microtasks (promises) always drain before the next macrotask (`setTimeout`) |
| `Promise.all` vs `allSettled` | `all` fails fast; `allSettled` always resolves with per-item status |

### 5.2 Tricky Output-Prediction Challenges

```javascript
// Challenge 1
console.log([1, 2, 3] == "1,2,3");

// Challenge 2
let x = { valueOf: () => 5 };
console.log(x + 1);

// Challenge 3
function Foo() { this.val = 1; }
const f1 = new Foo();
const f2 = Foo();
console.log(f1.val, f2);

// Challenge 4
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(arr.flat(Infinity));
```

Answers:

1. `true` — array is coerced to the string `"1,2,3"`, then compared as strings.
2. `6` — `valueOf` is invoked during the `+` operation's numeric coercion.
3. `1 undefined` — `f1` is a proper instance; calling `Foo()` without `new` runs it as a plain function, returning `undefined`, and (in non-strict mode) would pollute the global object with `val`.
4. `[1, 2, 3, 4, 5, 6]` — `flat(Infinity)` fully flattens any nesting depth.

### 5.3 Bug-Hunting Exercises

```javascript
// Bug A: Off-by-reference mutation
function addItem(cart, item) {
  cart.items.push(item);
  return cart;
}
const originalCart = { items: [] };
const newCart = addItem(originalCart, "apple");
// Problem: originalCart.items now also contains "apple" — was this intended?

// Bug B: Forgotten await
async function getTotal() {
  const price = getPrice(); // returns a Promise, not a number!
  return price + 10; // "[object Promise]10" or NaN
}

// Bug C: Loop variable capture
const buttons = document.querySelectorAll("button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () { console.log("Clicked button " + i); };
}
// Clicking ANY button logs the same, final value of i
```

Fixes:

- **A:** Clone before mutating: `const newCart = addItem({ items: [...originalCart.items] }, "apple");` if the original shouldn't change.
- **B:** Add `await`: `const price = await getPrice();`
- **C:** Swap `var` for `let` (block-scoped, fresh binding per iteration), or wrap in a closure-generating IIFE.
