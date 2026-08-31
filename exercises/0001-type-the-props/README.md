# Exercise 0001 — Type the props (and the state)

Companion to [Lesson 0007 — Derive, don't duplicate](../../lessons/0007-derive-dont-duplicate.html).
This is the hands-on half of the dashboard's **typescript (depth)** card.

## The rules

The card says **"Attempt typing without AI first."** That's the point of the whole
task — the definition of done is *"props/state typed correctly without major
correction needed,"* which only means something if the first attempt is yours.

So:

- Don't ask me for the answer until you've submitted one.
- Don't open the real files in `ct-web-transport` to peek.
- Asking for a *hint* is fine and doesn't spoil anything.

## Run it

```bash
cd ~/Desktop/learning/exercises/0001-type-the-props
./check.sh
```

Fill in each `type … = never;` and re-run until all three pass.

| File | What you're typing | Real source |
|---|---|---|
| `01-multiselect-props.ts` | A component's props, from its body alone | `app-common/components/MultiSelectFilter/` |
| `02-override-a-library-type.ts` | Overriding one field of a type you don't control | `app-common/components/TypedSearchInputField/` |
| `03-store-initial-state.ts` | Store state, the repo's convention | `sdk/src/stores/api/*.store.ts` |

## How the grading works

Each file has assertions at the bottom. Some **must compile**; others are marked
`@ts-expect-error` and **must fail**. An unused `@ts-expect-error` is itself a
compile error — so a type that's too permissive fails just as loudly as one
that's too strict. There's no passing this by writing `any`.

The grader shells out to the work repo's own TypeScript (4.9.5) with
`--strict false`, matching what ct-web-transport actually compiles under, so
what passes here would pass there.

### Reading the errors

| Error | Means |
|---|---|
| `TS2578: Unused '@ts-expect-error' directive` | Your type is too **loose** — it accepted something it should have rejected. |
| Any error on a `MUST compile` line | Your type is too **tight** — it rejected something legitimate. |
| `Type '{...}' is not assignable to type 'never'` | You haven't filled that one in yet. |

## When all three pass

Come back to chat. The card's second deliverable is a short *"typing patterns we
use"* note — the conventions in this repo that differ from the generic React
TypeScript Cheatsheet. Read the cheatsheet **after** your attempt, so the
comparison is real, then write the note in your own words.
