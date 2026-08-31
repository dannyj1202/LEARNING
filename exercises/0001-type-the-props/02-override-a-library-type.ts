/* ═══════════════════════════════════════════════════════════════════════
   EXERCISE 2 of 3 — Override one field of someone else's type
   ═══════════════════════════════════════════════════════════════════════

   This is the pattern from TypedSearchInputField.tsx, and it is the single
   most repo-specific typing convention you'll meet. The situation:

     The design system's `Cell` component declares `primaryText: string`.
     In practice this app passes a rich node there — highlighted text, a
     styled placeholder. You can't edit the design system.

   Write a Props type that is `CellProps` in every respect EXCEPT that
   `primaryText` becomes optional and accepts a ReactNode.

   Do NOT retype the other three fields by hand. If `CellProps` gains a
   field next release, your type should gain it for free. That constraint
   is the whole point of the exercise.

   Run ./check.sh to grade.
   ═══════════════════════════════════════════════════════════════════════ */

// ── Stubs standing in for react + the design system ─────────────────────
type ReactNode = string | number | boolean | null | undefined | { __brand: 'element' };

type CellProps = {
  primaryText: string;
  secondaryText?: string;
  onClick: () => void;
  testId: string;
};

// ── ✏️  YOUR ANSWER GOES HERE ───────────────────────────────────────────

type Props = Omit<CellProps, 'primaryText'> & {
  primaryText? : ReactNode;
}; // ← replace

// ── Assertions. Don't edit these. ───────────────────────────────────────
declare const node: { __brand: 'element' };

// MUST compile — a rich node where the library demanded a string
const a: Props = { primaryText: node, onClick: () => {}, testId: 't' };

// MUST compile — primaryText left out entirely
const b: Props = { onClick: () => {}, testId: 't' };

// MUST compile — the fields you didn't touch still work as before
const c: Props = { secondaryText: 's', onClick: () => {}, testId: 't' };

// MUST FAIL — testId is still required; you only changed one field
// @ts-expect-error
const d: Props = { onClick: () => {} };

// MUST FAIL — secondaryText is still a string. Only primaryText was widened.
// @ts-expect-error
const e: Props = { secondaryText: node, onClick: () => {}, testId: 't' };

export { a, b, c, d, e };
