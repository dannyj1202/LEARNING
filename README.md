# reactlearning

A guided course, written for you, with one target: **rebuild the Almosafer vehicle-results page in Next.js 16 + TypeScript + Emotion.**

This is not a tutorial repo and not a sandbox to poke at. It's a course with _state_ — it remembers your mission, your level, and where you stopped. Close it, come back in three days, and pick up mid-sentence.

---

## Start here (5 minutes)

1. Read [MISSION.md](MISSION.md) — what you're building and what "done" means.
2. Open `assets/vehicle-results-target.png` — that's the page. The definition of done is visual.
3. Open the current lesson in your browser: `lessons/0001-see-the-page-as-components.html`
4. Keep `reference/0001-vehicle-page-component-map.html` open beside it — it's the blueprint.
5. When you're done, or stuck, say so in the chat.

To find out where you are at any time:

```
/teach where are we
```

---

## The deal

**Say when you're stuck.** Within 30 minutes of being blocked — not after an evening of grinding. This isn't politeness, it's mechanics: the teacher re-plans lessons based on what you report. Suffer quietly and you get a course calibrated to a person who doesn't exist.

**Do the quizzes.** They're not filler. They're how the teacher finds out what actually landed versus what you nodded along to.

**Defend every line.** Use AI freely — that's the standing rule at work too — but you must be able to walk through any line you didn't write yourself and say why it's there. A lesson you can't explain isn't finished.

**Ship it, don't perfect it.** Two weeks. A half-finished page you can explain beats a polished one you can't.

---

## What's in here

| Path                               | What it is                                                                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MISSION.md`                       | The why, success criteria, constraints, out-of-scope. Every lesson is graded against this — it's what stops the course drifting into generic React content.        |
| `lessons/`                         | Self-contained HTML lessons with inline quizzes. Open them in a browser.                                                                                           |
| `reference/`                       | Artifacts you keep open while building. Right now: the component map for the target page.                                                                          |
| `learning-records/`                | What the teacher knows about your actual level. This is why lessons don't over-explain what you already know, or assume what you don't.                            |
| `RESOURCES.md`                     | Curated high-trust sources only — react.dev, nextjs.org, emotion.sh — each with a one-line "use this for X". Also tracks **Gaps**: things we haven't verified yet. |
| `NOTES.md`                         | Teaching posture and preferences. Build-first over abstract demos.                                                                                                 |
| `assets/`                          | The target screenshot, shared lesson stylesheet, quiz script.                                                                                                      |
| `.claude/`, `.cursor/`, `.agents/` | The `teach` and `grill-me` skills. You don't need to read these.                                                                                                   |

**During side-project hours, `RESOURCES.md` wins.** You'll also have a reading list on the main skill tracker — that one is for the work repo. Don't run both at once; you'll drown in tabs and learn less.

---

## The plan — 10 sessions, ~3h each

Lesson `0001` exists today. The rest is the expected arc, **not a contract** — the teacher re-plans from how you actually do. If a lesson takes two sessions, that's information, not failure.

| #   | Lesson                       | You'll be able to                                                  |
| --- | ---------------------------- | ------------------------------------------------------------------ |
| 01  | See the page as components   | Name every piece of the UI and say which contains which            |
| 02  | JSX and your first component | Render a static `VehicleCard`                                      |
| 03  | Props                        | Drive one card from outside — six vehicles, one component          |
| 04  | TypeScript                   | Type the `Vehicle` model and its props                             |
| 05  | Lists and keys               | **Checkpoint (end wk 1)** — the whole list renders from data       |
| 06  | Emotion                      | Style card, chips and Book button to match the screenshot          |
| 07  | `useState`                   | Make the filter sidebar respond to clicks                          |
| 08  | Lifting state up             | **The pivotal one** — filters actually filter, sort actually sorts |
| 09  | `useEffect` and edge states  | Loading, empty, no-match-for-these-filters                         |
| 10  | Next.js routing              | **Checkpoint (end wk 2)** — it's a real page, demo it              |

### Two checkpoints

- **End of week 1 (after 05)** — demo the list rendering from mock data, walk through your component tree. What's being checked is whether you can _justify the split_, not whether it looks good.
- **End of week 2 (after 10)** — demo filters filtering and sort sorting, then name three App-Router-only things that wouldn't work in the Rides repo. That second half is what proves the learning transferred.

### Lesson 08 deserves a warning

It's the one worth slowing down on. Filter state can't live in the sidebar — the results list needs it too — so it moves up to the common parent and the visible list becomes _derived_ rather than stored.

That's also the exact problem the real Rides codebase solves with an SDK store instead. Two correct answers to one question, at different scales. Ask for the hour with Ali on this lesson; it's the fastest onboarding in the whole plan.

---

## How this connects to the real repo

The reference screenshot **is** our production search-results page. That's deliberate — everything here transfers to `ct-web-transport` on day one.

| Here                             | In ct-web-transport                                                           |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Carving the page into components | `app-mweb/containers/SearchResultsPage/` vs `app-common/components/*`         |
| Props into a `VehicleCard`       | `app-common/components/InfoRow/` — the 3-file folder convention               |
| Rendering a list from mock data  | `sdk/src/factories/transport-result.factory.ts`                               |
| "Where does filter state live?"  | `sdk/src/stores/api/transport-filter.store.ts` + `hooks/useStateOfFilters.ts` |
| Emotion styled components        | `app-common/components/RouteSearchWidget/RouteSearchWidget.styled.tsx`        |
| Sort dropdown / price slider     | `hooks/useStateOfSort.ts` · `app-common/components/PriceFilter/`              |

**Finish a lesson → go read the mapped file.** The lesson teaches the concept; the repo file shows what it looks like under real constraints.

---

## Two things that do NOT transfer

Roughly 80% of what you learn here is just React and moves over untouched. Two things don't, and they'll mislead you if nobody says so up front.

**1. This project is App Router. Rides is the pages router.**

| Here (Next 16 App Router)           | Rides (pages router)                                          |
| ----------------------------------- | ------------------------------------------------------------- |
| `app/transports/page.tsx` folders   | `pages/mweb/transports/[...search].tsx` — a file _is_ a route |
| `app/layout.tsx`, auto-nested       | `pages/_app.tsx` + `_document.tsx` + our own `layouts/`       |
| Server Components, `'use client'`   | Don't exist. Everything is a client component.                |
| `async` components, `fetch` caching | `getServerSideProps` / `getStaticProps`, then SDK stores      |
| `useRouter` from `next/navigation`  | `useRouter` from `next/router` — same name, different API     |
| `metadata` export                   | `next/head`                                                   |

> Rule of thumb: if something you read or an AI generates mentions `app/`, `'use client'`, or `next/navigation`, it is **not** about our repo. Public docs now default to App Router, so this will happen constantly.

**2. Local `useState` is right here. In Rides that state often belongs in an SDK store.**

Ephemeral, one-component UI state stays local even in the real repo (`useStepper.ts`, `useSearchFlightDrawer.ts`). Shared, persisted, or server-derived state goes to the SDK. Being able to argue which is which is worth more than either answer.

---

## Using AI on this project

Same 3-pillar prompt as the main tracker — **Goal, Process, Output**:

```
GOAL
I'm on lesson <N>. By the end of this I need to be able to <capability>,
and explain it without looking it up.

CONTEXT
Building an Almosafer-style vehicle results page in Next.js 16 + TypeScript
+ Emotion. Here's my current code: <paste it>

PROCESS
- Teach from my pasted code only. Don't rewrite it for me.
- One step at a time. Ask me a question after each step and wait.
- If I'm wrong, tell me where, not what.

OUTPUT
Finish with <the artifact — a trace, a diagram, a short note>.
Then list the 3 things I still can't explain on my own.
```

A prompt ending in "write it for me" has already failed the defend-every-line rule.

---

## Stack

Next.js 16 (App Router) · TypeScript · React 19 · `@emotion/styled` · mock data, no backend.
