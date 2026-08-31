/* ═══════════════════════════════════════════════════════════════════════
   EXERCISE 1 of 3 — Props for a real component
   ═══════════════════════════════════════════════════════════════════════

   This is MultiSelectFilter, the component the task card names as the
   "type it yourself first" exercise. Its Props type has been deleted.

   Below the stubs you'll find the component's real body, unchanged. That
   body is your only evidence: every prop it destructures, every way each
   one gets used. Read it and write the Props type from that alone.

   RULES (from the task card): attempt this without AI. Don't open the real
   file. Don't ask your teacher for the answer until you've submitted one.

   HOW YOU KNOW YOU'RE RIGHT: run ./check.sh — it type-checks this file.
   The assertions at the bottom pass only if your type is exactly right:
   too loose and the "must fail" cases stop failing; too tight and the
   "must compile" cases break. It will error until you fill this in.
   ═══════════════════════════════════════════════════════════════════════ */

// ── Stubs standing in for the real SDK imports ──────────────────────────
export type TransportFilterSelectableItem = { key: string; name: string; selected: boolean };

export interface StringMultiselectFilter {
  uncommittedState: TransportFilterSelectableItem[];
  toggle(key: string): void;
}

// ── ✏️  YOUR ANSWER GOES HERE ───────────────────────────────────────────
// Replace this line with the real thing.

type Props = {
  testIdPrefix : string;
  title : string;
  filter : StringMultiselectFilter;
  onFilterChange :() => void;
  isDesktop? : boolean;
}; // ← delete this and write `type Props = { ... }`

// ── The component body, exactly as it is in the repo ────────────────────
// (JSX stripped to plain calls so this file type-checks without React.)
declare function render(...args: unknown[]): void;

export function MultiSelectFilter({
  testIdPrefix,
  title,
  filter,
  onFilterChange,
  isDesktop = false,
}: Props) {
  function handleToggle(key: string): void {
    filter.toggle(key);
    onFilterChange();
  }

  render(testIdPrefix);
  render(title, isDesktop ? 'HEADING3SEMBLD' : 'HEADING2');

  filter.uncommittedState.map((item: TransportFilterSelectableItem, index: number) =>
    render(item.key, item.selected, item.name, index, () => handleToggle(item.key))
  );
}

// ── Assertions. Don't edit these. ───────────────────────────────────────
declare const f: StringMultiselectFilter;

// MUST compile — all required props, optional one left out
const a: Props = { testIdPrefix: 'x', title: 'y', filter: f, onFilterChange: () => {} };

// MUST compile — optional one supplied
const b: Props = { testIdPrefix: 'x', title: 'y', filter: f, onFilterChange: () => {}, isDesktop: true };

// MUST FAIL — title is required
// @ts-expect-error
const c: Props = { testIdPrefix: 'x', filter: f, onFilterChange: () => {} };

// MUST FAIL — onFilterChange has to be callable
// @ts-expect-error
const d: Props = { testIdPrefix: 'x', title: 'y', filter: f, onFilterChange: 'nope' };

// MUST FAIL — isDesktop is a boolean
// @ts-expect-error
const e: Props = { testIdPrefix: 'x', title: 'y', filter: f, onFilterChange: () => {}, isDesktop: 'yes' };

// MUST FAIL — no such prop
// @ts-expect-error
const g: Props = { testIdPrefix: 'x', title: 'y', filter: f, onFilterChange: () => {}, colour: 'red' };

export { a, b, c, d, e, g };
