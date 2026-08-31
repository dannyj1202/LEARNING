# Lesson 0002 cleared — props direction and quote-vs-brace syntax solid

User correctly explained props unprompted (parent→child, JSX attributes become one object argument) and spotted a `price="168"` vs `price={168}` bug in an unseen snippet — genuine recall, not quiz recognition. Also, in this session I asked a third question (does reassigning `price` inside the component survive re-render) that lesson 0002 never covered — it explicitly deferred mutation/state to a later lesson — so the user's frustrated "you never taught this" was a fair catch of a bad question, not a knowledge gap. Gave a short preview answer (components are functions, React re-invokes with fresh props each render) but did not test on it.

## Implications
- Floor is solid for Lesson 0003 (rendering lists with `.map()`), per lesson 0002's own stated next step.
- Do not quiz on render/reassignment mechanics until the `useState` lesson (07) actually teaches it — keep skill checks scoped to what the current lesson covered.
