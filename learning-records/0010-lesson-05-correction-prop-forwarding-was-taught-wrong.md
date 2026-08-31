---
name: lesson-05-correction-prop-forwarding-was-taught-wrong
description: Lesson 0005's prop-forwarding rule was factually wrong and has been corrected — teaching error, not a user gap
metadata:
  type: project
  status: active
---

# Lesson 0005's prop-forwarding rule was taught incorrectly — now corrected

Lesson 0005 originally claimed Emotion forwards *any* prop it doesn't consume straight onto the DOM element by default. This was never verified against the actual docs when the lesson was written, and it's wrong: for DOM tags (`styled.button`, `styled.p`, etc.), Emotion already filters to valid HTML attribute names automatically — confirmed via the official docs during this session (`"Emotion passes all props (except for theme) to custom components and only props that are valid html attributes for string tags."`). The real gotcha only fires when a custom style-only prop's name happens to collide with a genuine (even legacy) HTML attribute, like `color` — that's the actual documented example on emotion.sh.

Fixed in three places: the lesson HTML (`lessons/0005-style-with-emotion.html` — callout, examples, and all three quiz questions rewritten around the `color`/`highlightColor` collision case instead of the invented `active` leak), the notes file (`notes/Lesson 0005 · Style with Emotion.md`), and this record supersedes the affected parts of [[0009-lesson-05-emotion-prop-styling-and-forwarding-solid]] (that record's Q1/Q3 chat answers were "correct" relative to a false premise I taught — not evidence of a user misconception).

## Implications
- This was caught because the user asked to "explain shouldForwardProp properly with an actual example," which prompted an actual WebFetch against emotion.sh instead of relying on recalled knowledge — exactly the "never trust your parametric knowledge" rule this workspace is supposed to follow. Going forward, verify library-specific behavioral claims (not just cite docs links) before writing them into a lesson, especially for anything framed as a "bites you in code review" rule — those are exactly the claims a real reviewer would rely on.
- No change needed to the user's understanding of anything else in Lesson 0005 (styled-component mechanics, prop-driven CSS via a function, typing styled props) — those parts were accurate and remain solid.
