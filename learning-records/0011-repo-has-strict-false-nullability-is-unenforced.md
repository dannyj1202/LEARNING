---
name: repo-has-strict-false-nullability-is-unenforced
description: ct-web-transport sets "strict": false in both packages, so | null and ? annotations are documentation the compiler never enforces — verified, not assumed
metadata:
  type: project
  status: active
---

# ct-web-transport runs `strict: false` — nullability annotations are unenforced

Both `packages/sdk/tsconfig.json:4` and `packages/app/tsconfig.json:7` set `"strict": false`, which leaves `strictNullChecks` off across the whole repo. Verified empirically with the repo's own TypeScript 4.9.5 rather than assumed: `loc.city.toUpperCase()` where `city: string | null` compiles clean (exit 0) under `--strict false`, and fails with `TS18049: 'loc.city' is possibly 'null' or 'undefined'` under `--strict true`. Official docs corroborate — with the flag off, `null`/`undefined` are "effectively ignored by the language."

The scope of what's disabled was also verified, because the easy over-correction is "so the types mean nothing." They still mean plenty. Under `--strict false` the compiler **still** errors on: a missing required property (`TS2741`), a `string` where a `number` belongs (`TS2322`), an unknown extra key on a fresh object literal (excess property check, per [[0007-lesson-04-typescript-excess-property-and-runtime-erasure]]), and a wrong element type inside an array. Only the null/undefined family is switched off.

## Implications
- **This is the highest-value code-review rule found so far for the mission's "spot real bugs" goal.** In this repo, type files tell the truth about *shape* but the compiler does not enforce *nullability* — so an unguarded access on a `| null` field is a real crash that CI will not catch, and only a human reviewer will. Reuse this framing in future lessons: shape is machine-checked, nullability is human-checked.
- The user's own field guide (`M2 - Ts Mastery.md` §4.1) independently names `strictNullChecks`-off as "the #1 cause of runtime crashes" and warns against teams disabling `strict` — the repo is a live instance of exactly that warning. Good anchor: their trusted source predicted the landmine they then found in their own codebase.
- Do not suggest the user turn `strict: true` on. It's a large, cross-team change well outside a learner's remit; the useful posture is reading defensively, not fixing the config.
- Continues the practice set by [[0010-lesson-05-correction-prop-forwarding-was-taught-wrong]] — behavioral claims about tooling get verified by running the tool before they go into a lesson. Here that meant a scratch `.ts` probe compiled twice, which is what turned a plausible claim into a citable one.
