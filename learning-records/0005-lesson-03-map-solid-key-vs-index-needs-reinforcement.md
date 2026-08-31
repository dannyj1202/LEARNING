# Lesson 0003 cleared — .map() mechanics solid, key-as-prop vs key-as-data-field still shaky

User correctly explained `.map()` returning an array of elements and spotted a missing `key` prop in an unseen snippet on the first try — genuine recall of the core lesson mechanic. Two things need watching, though. First, on "why is `vehicle.id` safer than `index` specifically," the initial answer restated key's general purpose rather than the reorder scenario (position 0 → position 2 after sorting); only landed after a targeted follow-up. Second, and more notable: on a transfer question (render `FilterChip` from a plain string array with no `.id`), the user didn't write a `.map()` expression at all — instead built a new array literal with a `key` field baked into each item. This suggests `key` is currently understood as a data property to add, not a prop passed at render time inside the `.map()` call. I explained the correction but did not re-test it in this session.

## Implications
- Floor is solid for Lesson 0004 (TypeScript) on `.map()` itself.
- Before or during 08a (lifting state, filtering/sorting this exact list) and again when the `Vehicle`/category types are introduced in TypeScript, re-probe the key-as-render-prop-vs-data-field distinction with a fresh transfer example — don't assume the correction from this session generalized.
- The reorder-specific reasoning for id-vs-index (not just "key gives identity" in the abstract) needed prompting once; likely needs one more unprompted check before treating it as solid.
