---
status: partially superseded by [[0010-lesson-05-correction-prop-forwarding-was-taught-wrong]]
---

# Lesson 0005 cleared — prop-driven styled components and the forwarding gotcha solid on first try

> [!note] Partial correction
> The Q3 "forwarding gotcha" finding below was based on a lesson claim that turned out to be factually wrong (see [[0010-lesson-05-correction-prop-forwarding-was-taught-wrong]]) — a teaching error, not a gap in the user's understanding. Q1 and Q2 (CSS trace, generic-argument reasoning) are unaffected and still stand.

User correctly traced the generated CSS for `active={false}` (white), correctly identified why `<{ active: boolean }>` is needed (lets TypeScript check `.active` inside the CSS function — same reasoning as typing `VehicleCard`'s props in Lesson 0004, applied to a factory function instead of a component definition), and correctly flagged the missing `shouldForwardProp` as a real review comment, unprompted. No corrections needed this round — clean pass across all three, including the code-review-framed question.

## Implications
- Emotion floor (styled components, prop-driven CSS via a function in `${ }`, prop forwarding to the DOM) is solid for Lesson 0006 (`useState`) and beyond.
- User explicitly said they expect to understand things better once actually coding the mission project rather than through more lessons — noted in `[[NOTES.md]]` to revisit after 0006/0007, since that's the natural point the course starts feeling like real interactive UI work rather than isolated concepts.
