/* ═══════════════════════════════════════════════════════════════════════
   EXERCISE 3 of 3 — State, the way this repo types it
   ═══════════════════════════════════════════════════════════════════════

   Seven of the eight API stores in packages/sdk/src/stores/api/ open with
   the same three lines. This is that convention, with the type removed.

   A store is constructed with an initial state where EVERY field may be
   absent — the caller supplies whatever it happens to know, often nothing
   at all (`new AirportSearchStore({}, $env)`). But when a field IS given,
   it must be exactly right.

   Write `InitialState`. Do not hand-write two optional fields — express
   "all of these, all optional" in one move.

   Run ./check.sh to grade.
   ═══════════════════════════════════════════════════════════════════════ */

// ── Stubs standing in for the real SDK imports ──────────────────────────
type APIState = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR';
type RawGetAirportSearchResponse = { id: string; name: string }[];

// ── ✏️  YOUR ANSWER GOES HERE ───────────────────────────────────────────
// The store holds two things: `data` (the raw response) and `API_STATE`.

type InitialState = Partial<{
   data: RawGetAirportSearchResponse;
   API_STATE: APIState;
}>; // ← replace

// ── Assertions. Don't edit these. ───────────────────────────────────────

// MUST compile — the common case: caller knows nothing yet
const a: InitialState = {};

// MUST compile — one field known
const b: InitialState = { API_STATE: 'LOADING' };

// MUST compile — both known
const c: InitialState = { data: [], API_STATE: 'INITIAL' };

// MUST FAIL — 'PENDING' is not one of the four allowed states
// @ts-expect-error
const d: InitialState = { API_STATE: 'PENDING' };

// MUST FAIL — optional does not mean "anything goes"
// @ts-expect-error
const e: InitialState = { loading: true };

export { a, b, c, d, e };
