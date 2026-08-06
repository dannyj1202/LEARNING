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

## Curriculum decisions
- Lesson 08 is a pair: **08a** React lifting state up (canonical, required), then **08b** MobX store sub-lesson (same filters/sort page, store-owned state) as the bridge to Rides SDK stores
- Do not teach MobX before the learner can lift state and derive a filtered list in React
- Core mission stack stays Next.js 16 + TypeScript + Emotion; MobX is transfer learning for work, not the default page implementation
