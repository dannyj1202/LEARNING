# Lesson 0004 cleared — excess-property checks and type-erasure traced correctly, one syntax misconception corrected

User initially misdiagnosed a real bug-spotting exercise: believed semicolons vs. commas as type-literal separators was a compile error ("`{ id: string; title: string; price: number }` is supposed to use commas"). This is false — TypeScript accepts either separator in object type literals — and was corrected directly since misapplying it in a real review would be a wrong comment. Once redirected, correctly identified the actual bug (an excess `seats` field not in `Vehicle`, flagged because it's a fresh object literal assigned directly to a typed variable).

On a combined `.map()` + typed-props bug-spot (`prices={vehicle.price}` typo alongside `key={vehicle.id}`), correctly caught the `prices`/`price` mismatch but initially also flagged `key` as wrong — a resurfacing of the Lesson 0003 `key` confusion ([[0005-lesson-03-map-solid-key-vs-index-needs-reinforcement]]), this time as "key must match the type" rather than "key belongs in the data." Corrected: `key` is a React-only identity prop outside the component's own prop type entirely.

On the runtime-erasure question, correctly traced the full chain unprompted on retry: prop name mismatch → destructuring returns `undefined` → React renders `undefined` children as nothing (not the literal text "undefined") → no error is thrown anywhere. This is genuine mastery-level tracing, matching the newly stated [[0006-mission-expanded-to-code-review-fluency]] bar.

## Implications
- Do not let "compare against the type letter-by-letter" instinct override known special cases — `key` (and later, `children`) are recurring candidates for false-positive bug flags. Worth an explicit callout next time `key` appears in a typed-props exercise.
- The comma/semicolon-in-type-literals non-issue is now corrected; no need to re-teach, but watch for it resurfacing in `interface` syntax specifically (trailing commas/semicolons differ slightly there and haven't been taught yet).
- Ready to move to Lesson 0005 (Emotion) — TypeScript floor, including excess-property checks and erasure-at-runtime, is solid.
