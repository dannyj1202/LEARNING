# Notes

## Preferences / context
- Concrete visual target: Almosafer vehicle results page (filters sidebar + vehicle cards + sort + Book now)
- Screenshot saved at workspace assets path from Cursor project
- Prefers building toward the real page over abstract demos
- Timeboxed: ~30 hours over 2 weeks — keep lessons short, mission-tied, high signal

## Teaching posture
- Start from HTML/CSS/JS baseline; introduce React concepts mapped onto pieces of the vehicle page
- Prefer Emotion styled-components patterns early enough to match the success stack
- Mock vehicle data; no real booking backend in scope
- User wants mastery, explicitly framed as code-review fluency ("spot bugs in code review and understand what's truly happening") — pitch skill-check questions as bug-spotting / code-review realism (a snippet, what's wrong and why) rather than plain definition recall, across JS, TypeScript, and React alike
- User has personal field guides at `/Users/daniel.varghese/Desktop/Almosafer/Almosafer/07 Learning Block/Study/` — `TypeScript Field Guide.md` and `React Mastery Guide.md`. Whenever a lesson would cite a "Primary source (read next)," check these files first and cite/ground the lesson in them instead of (or alongside) official docs — standing instruction, not a one-off. When a topic isn't covered there (e.g. Emotion — it's a styling library, not TS/React fundamentals), official docs are the right fallback; say so explicitly in the lesson rather than silently skipping the guides.
- After Lesson 0005 (Emotion), user said they expect to understand things better once they start actually coding the MISSION.md project, rather than purely through more lessons. Worth raising explicitly once the current lesson arc reaches a natural pause point (e.g. after 0006/0007) — consider shifting toward hands-on project scaffolding sooner rather than lesson after lesson.

- The user works against a second real repo at `/Users/daniel.varghese/Desktop/ct-web-transport/ct-web-transport` (the work codebase, `packages/app` + `packages/sdk`). Their onboarding dashboard has its own task list ("typescript (basics)", etc.) with a definition of done. When a /teach session maps onto a dashboard task, ground the lesson in that repo's real files and close the task's DoD explicitly. Repo-wide `"strict": false` — see learning record 0011.
- **Embed the source, don't link to it.** User asked for real repo files to be pasted into the reference doc itself — line-numbered, annotated, tabbed — because switching between an editor and a lesson breaks the reading flow. Applies to any reference doc built from real code: the code goes in the page. Generate the panels with a script (`scratchpad/build_source_sections.py` pattern) rather than hand-copying, so line numbers stay honest and escaping is right.
- Verify tooling claims by running the tool. The repo ships its own `tsc` at `ct-web-transport/node_modules/.bin/tsc` (4.9.5); a two-line scratch `.ts` file compiled with and without `--strict` turns a plausible claim into a citable one. Pasting the real command + real error code into the lesson is worth the two minutes.

## Curriculum decisions
- Lesson 08 is a pair: **08a** React lifting state up (canonical, required), then **08b** MobX store sub-lesson (same filters/sort page, store-owned state) as the bridge to Rides SDK stores
- Do not teach MobX before the learner can lift state and derive a filtered list in React
- Core mission stack stays Next.js 16 + TypeScript + Emotion; MobX is transfer learning for work, not the default page implementation
