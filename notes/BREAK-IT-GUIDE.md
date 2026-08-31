# Break-It Guide: What Does This Team Actually Treat as Non-Negotiable?

This is a throwaway exploration branch (`explore/break-it-on-purpose`, off `develop`).
Nothing here is meant to be merged. The point is to make four small, deliberate
breakages — one at a time — in real Rides guest-details code, observe what actually
happens (build error? lint failure? test failure? silent visual bug?), and revert.

> **Part 2 (`browser-devtools` task) is at the bottom of this file.** Part 1 below asks
> *"what does this team treat as non-negotiable?"* and answers it by breaking things and
> watching the tooling stay silent. Part 2 asks the opposite question — *"given a broken
> page, how do I find the cause?"* — on the search-results path, and ends in a reusable
> playbook. Part 1's four breakages are deliberately poor devtools practice (they're
> silent and visual); Part 2 uses its own injection menu.

Before you start, two verified facts about this repo's actual safety net, because they
change what you should expect to observe:

- **CI's `Tests` workflow (`.github/workflows/test.yml`) only runs `npm run test:sdk`.**
It does not run any test against `packages/app` at all.
- **There are zero Cypress specs and zero component tests in `packages/app`** (only one
unrelated unit test exists in the whole package: `packages/app/utils/__tests__/helpers.utils.test.ts`).
`cypress` is a listed devDependency but no `.cy.ts(x)` files or `cypress/` directory
exist in this repo.
- `**lint.yml` runs ESLint only** (no `tsc`/`check-types` step in any workflow).

So for all four breakages below, "will CI catch this?" mostly resolves to "only if it's
a TypeScript or ESLint violation" — most of what follows isn't.

All four files are confirmed to exist at the stated paths/lines as of this branch's
base commit (`develop`, `6edd508`).

---

## 1. Translation / i18n call removal

**File:** `packages/app/app-mweb/containers/ContactDetails/components/TitleField/TitleField.tsx`
**Line:** 40

**Current code:**

```tsx
<Chips
  key={title.key}
  type="choice"
  label={t(title.translationKey)}
  ...
```

`t(title.translationKey)` resolves the i18n key (e.g. `ContactForm.TitleField_Mr`) to
the localized display string ("Mr" in English, its Arabic equivalent when the locale
is `ar`) via `react-i18next`'s `useTranslation`.

**Edit to make:** remove the `t()` wrapper so the raw key is passed straight through:

```tsx
label={title.translationKey}
```

**Predicted outcome:** Nothing breaks mechanically. `title.translationKey` is already
a `string`, so this still type-checks — **no build error**. No runtime crash. ESLint
has no rule enforcing i18n key usage in this repo (confirmed: no i18n/translation rule
in `@tajawal/eslint-config-web`), so **no lint failure** either. What you'll actually
see: every title chip on the guest-details form renders the literal key text —
`ContactForm.TitleField_Mr`, `ContactForm.TitleField_Ms`, `ContactForm.TitleField_Mrs`
— instead of "Mr"/"Ms"/"Mrs", in **every locale**, English included (since we didn't
break translation *lookup*, we removed the *call* entirely). This is a pure silent
visual bug — the kind that only a human looking at the rendered page (or a screenshot
diff) would catch.

**Revert:** restore the line to `label={t(title.translationKey)}`, or:

```
git checkout -- packages/app/app-mweb/containers/ContactDetails/components/TitleField/TitleField.tsx
```

---

## 2. Test hook (`data-testid`) removal

**File:** `packages/app/app-desktop/containers/TransportGuest/components/TitleField/TitleField.tsx`
**Line:** 32 (this is the desktop counterpart of the file above — kept in a separate
file from category 1 so the two breakages don't collide if you're doing them in
sequence)

**Current code:**

```tsx
<Styled.Wrapper data-testid={testIdPrefix} error={hasError}>
```

**Edit to make:** delete the `data-testid={testIdPrefix}` attribute:

```tsx
<Styled.Wrapper error={hasError}>
```

**Predicted outcome:** Honestly — **nothing observable in this repo.** No build error
(removing a JSX attribute is always valid), no runtime crash, no visual change (the
attribute isn't rendered on screen), and — because there are no Cypress specs and no
component tests anywhere in `packages/app` — **no test failure either**, because
nothing here exercises this selector. The only reason this line exists is the
`buildTestId`/`testid-standards` convention (`.claude/skills/testid-standards`) that
assumes some *external* QA automation suite (not present in this repo) selects DOM
nodes by `data-testid`. If that external suite exists, this breaks it silently; from
inside this repo, you'll see nothing at all. That gap — a convention with no local
enforcement — is itself worth noting for your "what's non-negotiable" question.

**Revert:** restore the line to `<Styled.Wrapper data-testid={testIdPrefix} error={hasError}>`, or:

```
git checkout -- packages/app/app-desktop/containers/TransportGuest/components/TitleField/TitleField.tsx
```

---

## 3. Forced RTL layout override

**File:** `packages/app/app-desktop/containers/PickupDateTimeDrawer/components/DateAndCalendarField.tsx`
**Line:** 132

**Current code:**

```tsx
<DayPicker
  mode="single"
  dir={getLocale().code === 'ar' ? 'rtl' : 'ltr'}
  ...
```

This sets the pickup-date calendar's reading direction based on the active locale —
`rtl` for Arabic, `ltr` otherwise. `react-day-picker` uses `dir` to decide which side
the "previous/next month" arrows sit on and which direction the week/day grid flows.

**Edit to make:** hardcode it to always force RTL, regardless of locale:

```tsx
dir="rtl"
```

**Predicted outcome:** No build error, no crash — this is purely a rendering/layout
change. For English-locale (`en`) users, the calendar's day grid and its
previous/next-month arrows will mirror: the grid flows right-to-left and the arrow
that used to mean "next month" now visually points the opposite way, while every date
label and translated string around it still reads LTR. It's a **visible layout bug**,
not silent — but it's confined to the calendar widget inside the pickup-date drawer,
so you'd only catch it by actually opening that drawer. No lint or test in this repo
checks calendar directionality.

**Revert:** restore the line to `dir={getLocale().code === 'ar' ? 'rtl' : 'ltr'}`, or:

```
git checkout -- packages/app/app-desktop/containers/PickupDateTimeDrawer/components/DateAndCalendarField.tsx
```

---

## 4. Chosen fourth category: breaking the locale-safe price direction lock

**File:** `packages/app/app-common/components/VehicleCardPrice/VehicleCardPrice.tsx`
**Line:** 21

**Current code:**

```tsx
<Styled.Wrapper dir="ltr" data-testid={testId}>
  {hasDiscount && (
    <Typography ... strike>{discountedPrice}</Typography>
  )}
  <Styled.CurrencySymbolWrapper>
    <CurrencySymbol currency={currency} ... />
  </Styled.CurrencySymbolWrapper>
  <Typography ...>{price}</Typography>
</Styled.Wrapper>
```

This component renders the vehicle price on the search-results vehicle card — struck-
through original price, currency symbol, final price. Unlike the calendar in category
3, it does **not** switch direction with locale: it hardcodes `dir="ltr"` unconditionally,
even when the surrounding page is Arabic/RTL.

**Edit to make:** remove the direction lock (or flip it to follow the ambient RTL context):

```tsx
<Styled.Wrapper data-testid={testId}>
```

**Predicted outcome:** No build error, no crash. In an Arabic (RTL) session, the
`Wrapper` will now inherit `dir="rtl"` from the surrounding page instead of staying
locked to `ltr`. Because this wrapper lays out discounted-price, currency symbol, and
final price as sibling elements in source order, an RTL context reverses their visual
order — e.g. the currency symbol could end up on the opposite side of the number from
where users expect it, and the struck-through original price and final price could
swap visual positions. Digits themselves don't mirror (Arabic numerals used here are
still LTR runs), but their *surrounding layout* does. This is a silent-until-you-look
visual bug, and it's the one category on this list where getting it wrong has direct
business consequences: a price that's laid out ambiguously is a price that can be
misread on a booking/payment flow, even though this edit itself only touches display
markup, not any price calculation, payment, or gateway logic.

**Why I picked this as the fourth category:** I looked for a pattern that recurs
independently (not a one-off) and is specific to what a booking/travel platform's
frontend can't get wrong. This one qualifies on both counts:

- **It's duplicated, not a one-off.** There are two independent `VehicleCardPrice.tsx`
files in this repo — `app-common/components/VehicleCardPrice/` (the one used by
`app-desktop/components/VehicleCard/VehicleCard.tsx`) and
`app-common/components/VehicleCard/components/VehicleCardPrice/` — and both contain
the exact same `dir="ltr"` lock, byte-for-byte identical (`diff` between them is
empty). Two separately-maintained implementations independently landing on the same
defensive line is a strong signal this is a deliberate convention, not an accident.
- **It's a different failure class than category 3.** Category 3 forces RTL where
locale-following RTL is otherwise correct (a layout preference). This one guards
against RTL context bleeding into a place where numeric/monetary content must stay
visually unambiguous regardless of locale — a correctness property, not a style
preference. There's no lint rule or test enforcing it (consistent with everything
else in this guide), so the only thing currently protecting it is the fact that two
different authors both wrote the same guard independently.

**Revert:** restore the line to `<Styled.Wrapper dir="ltr" data-testid={testId}>`, or:

```
git checkout -- packages/app/app-common/components/VehicleCardPrice/VehicleCardPrice.tsx
```

---

## Why these four

The brief already fixed three categories (i18n, test hooks, RTL); I picked the fourth
by looking for a pattern that shows up more than once, independently, in real Rides
code — a stronger signal of "the team enforces this" than any single line could be. I
avoided payment/auth/session code entirely, per the constraint, which ruled out some
otherwise-plausible candidates I checked first: the `handleCTAClick`/`handleFormSubmit`
submission paths in the guest pages, and anything in `updateSaleInfo`.

The common thread across all four, and probably the most useful thing this exercise
will teach you empirically: **none of these four is actually protected by an automated
gate in this repo.** No test exercises any of these files (CI's test job only runs the
SDK's tests), and no ESLint rule fires on any of the four edits. The only line of
defense is code review and repetition of convention (the duplicated `VehicleCardPrice`
files being the clearest evidence of that). That's a meaningfully different answer
than "these are non-negotiable because CI blocks them" — they're non-negotiable
because reviewers and repeated practice treat them that way, not because tooling does.

---

---

# Part 2 — `browser-devtools`: diagnosing a broken page

**Goal:** debug what you can see, using devtools alone.
**Output:** a one-line diagnosis of an injected failure + a playbook someone else could
follow on a *different* bug.

**Read order matters.** Section A is the injection menu — file, line, exact edit, nothing
else. Section B is the playbook — safe to read, it's the deliverable. Section C is the
answer key and it spoils the exercise; don't open it until you've written your diagnosis
down.

> **Best setup for the "diagnoses without hints" checkbox:** hand Section A to someone
> else and have them pick and apply one without telling you. If you're doing it solo,
> apply one, then go do something else for an hour before opening devtools — you want to
> be reading signals, not recalling your own edit.

**Where this lives.** All four candidates sit on the search-results path:


| File                                                                       | Role                                                       |
| -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `packages/app/pages/mweb/transports/[...search].tsx`                       | Route. SSR builds `transportSearchPayload`, passes it down |
| `packages/app/app-mweb/containers/SearchResultsPage/SearchResultsPage.tsx` | Container. Owns every render gate                          |
| `packages/app/hooks/useFetchSearchResults.ts`                              | Kicks off the search; owns the console error strings       |
| `packages/sdk/src/clients/transport-search.client.ts`                      | The HTTP you'll see in Network                             |


Run it at `http://almosafer.com.local:3000/mweb` and do a search to land on the results
page. Two of the four candidates live in `packages/sdk`, so `npm run dev` (which runs app

- SDK in parallel) needs to be up, not just the app.

---

## Section A — Injection menu

Pick **one**. Each has a deliberately different devtools signature; no two are found the
same way. Revert with `git checkout -- <path>` when you're done.

### A1 · Starve the page of its payload

**File:** `packages/app/pages/mweb/transports/[...search].tsx` **line 16**

```tsx
transportSearchPayload={props.transportSearchPayload}   // before
transportSearchPayload={null}                           // after
```

> The task card suggests *deleting* the prop. Don't — `Props.transportSearchPayload` is a
> required field, so deletion is a TypeScript error and the Next dev overlay hands you the
> answer for free. The prop's type is `TransportSearchPayload | null`, so passing `null`
> type-checks cleanly and fails at runtime instead. Same failure, no free hint.

### A2 · Point the search API at nothing

**File:** `packages/sdk/src/constants/api.constants.ts` **line 6**

```ts
TRANSPORT_SEARCH_ASYNC: '/api/transport/search/async',    // before
TRANSPORT_SEARCH_ASYNC: '/api/transport/search/asyncc',   // after
```

### A3 · Make the poll loop never finish

**File:** `packages/sdk/src/clients/transport-search.client.ts` **line 85**

```ts
if (response.searchStatus === 'COMPLETED_SUCCESSFULLY') {   // before
if (response.searchStatus === 'COMPLETED_SUCCESSFULY') {    // after (one L)
```

### A4 · Lie about the document direction

**File:** `packages/app/pages/_document.tsx` **line 57**

```tsx
<Html lang={language} dir={dir} className={dir}>     // before
<Html lang={language} dir="rtl" className={dir}>     // after
```

---

## Section B — How I diagnose a broken page

The order is the point. Each step is cheap and eliminates a whole class of cause, so you
never start by reading source.

### Step 0 — Say what you expected, out loud

One sentence: *"I expected a list of vehicle cards; I got a spinner that never stops."*
Skipping this is how people spend twenty minutes confirming things that were never broken.
Also note **which locale and viewport** you're in — half the bugs in this repo are only
visible in one of them.

### Step 1 — Console (5 seconds)

Look for a red stack trace first — if the page crashed, nothing after this matters.

Then filter the console for `SEARCH_RESULTS`. This path logs four distinct strings, and
each one tells you exactly how far the flow got before dying:


| Console string                        | Meaning                                        | Source                        |
| ------------------------------------- | ---------------------------------------------- | ----------------------------- |
| `SEARCH_RESULTS_FETCH_ERROR`          | The initial POST failed                        | `useFetchSearchResults.ts:42` |
| `SEARCH_RESULTS_MISSING_SID`          | POST succeeded but returned no `sId`           | `useFetchSearchResults.ts:48` |
| `SEARCH_RESULTS_POLLING_ERROR`        | Init worked; a poll failed or came back failed | `useFetchSearchResults.ts:55` |
| `SEARCH_RESULTS_INITIALIZATION_ERROR` | Something threw around the whole sequence      | `useFetchSearchResults.ts:61` |


**Silence is a finding, not a dead end.** If the page is visibly broken and none of these
fired, the search never started — jump straight to Step 3, because there'll be nothing in
Network either.

### Step 2 — Network

Filter to **Fetch/XHR**. A healthy search looks like exactly this:

1. One **POST** `/api/transport/search/async` → returns `{ sId, delayInMillis }`
2. Then repeated **GET** `/api/transport/search/poll/{sId}?sortBy=PRICE&sortOrder=ASC`,
  one every `delayInMillis` (defaults to 500ms), until `searchStatus` comes back
   `COMPLETED_SUCCESSFULLY`

Read it as a sequence and ask three questions in order:

- **Did the POST happen at all?** No POST = the failure is upstream of the network layer.
Nothing is wrong with the API; the code never asked. → Step 3.
- **Did the POST succeed?** Check status *and* the response body — a 200 with no `sId` is
a different bug from a 404, and both surface as "no results".
- **Do the polls terminate?** Polls that keep firing past a few seconds mean the loop's
exit condition never matched. Click the last poll and read `searchStatus` in the
response — if it says `COMPLETED_SUCCESSFULLY` but the page is still polling, the bug is
in the comparison, not the API.

> Polling means a *correct* page also shows a burst of repeated GETs. "Lots of requests"
> is only a symptom if they never stop.

### Step 3 — React DevTools ⚛️

Reach for this when Console and Network are both quiet — that combination means the data
never left the component tree.

Select `**SearchResultsPage*`* in the Components tab and read its **props**:

- `transportSearchPayload: null` → SSR gave the page nothing, or the route dropped it.
Everything downstream is dead by design: `useFetchSearchResults.ts:20` early-returns on
a falsy payload, which is *why* Network is empty and the console is silent.
- Then walk **up** to the route component to see whether the payload was `null` on arrival
or was nulled on the way down. That one hop is the whole diagnosis.

> **Rule out the URL before you blame the code.** A `null` payload has two causes, and
> they look identical in React DevTools. `parseTransportSearchPayload`
> (`utils/transport-search-url.utils.ts:273`) returns `null` whenever the catch-all route
> has **fewer than 5 path segments** — the URL shape is
> `/mweb/transports/<origin>/<destination>/<date>/<time>/<passengers>?o…&d…`, and the
> location details ride in the query string, not the path. So a hand-typed or truncated
> URL produces exactly the same dead page as a genuine code bug. Count the segments in the
> address bar *first*; only if the URL is well-formed is the payload's `null` a real
> defect. This is the single most likely way to waste an hour on this page.

Two repo-specific things that will confuse you otherwise:

- **There are no `observer()` wrappers.** This app doesn't use `mobx-react` in the UI
layer. Store data reaches components through the ten `useStateOf`* hooks, which wrap
`useMapStoreStateToClientState`. So don't hunt for a MobX wrapper component — select the
container and read its **hooks** panel, where the projected store state shows up as
hook state.
- **Props are the fast path.** Because containers project store → plain object, a `null`
or empty value on a container's props/hooks is usually the whole story.

### Step 4 — Elements

Use this for "it renders, but wrong", and to tell *"the component didn't render"* apart
from *"it rendered and is invisible"*.

- Search the DOM for the page's test id — `TransportSearchResults` — then narrow to
`TransportSearchResultsError` (error/empty state) or `TransportQuickFiltersBar`. Which
test id is present tells you which render gate won, without reading any code.
- The gates all live together at `SearchResultsPage.tsx:109–118` (`showInitialSkeleton`,
`showError`, `showEmpty`, `showResults`). Note `showError` fires on `!sId` alone — so a
search that never started renders the *same* error state as a search that failed. The
DOM can't tell those apart; Network can.
- **RTL check:** inspect `<html>` and read its `dir` attribute. It's set from middleware
at `_document.tsx:57` and should be `rtl` **only** on `/ar`. If `dir="rtl"` on an
English page, the layout bug you're chasing is document-level, not component-level.
Toggle locales by switching the URL (`/mweb` vs the `ar` locale) and re-read the
attribute — that's the toggle, there's no in-app switch.
- Mobile emulation lives in the device-toolbar (⌘⇧M). The mweb routes are built for it;
some layout bugs only exist at desktop widths on `/mweb` and are not real.

### Step 5 — Only now, read the source

By this point you should have a file in mind rather than a folder. Confirm the mechanism,
then write the one-liner: **what broke, where, and why the symptom looks the way it does.**

### The short version

```
expectation → console → network → react devtools → elements → source
              (crash?)  (asked?)   (has data?)     (rendered?)
```

Rule of thumb: **absence is evidence.** No console error and no request is not "no
information" — it's a positive signal that the failure is above the network layer, and it
skips you straight to Step 3.

---

## Section C — Answer key 🔒

*Stop. Write your diagnosis down first.*

Expected devtools signature for each injection

**A1 — `transportSearchPayload={null}`**
Console silent. Network shows **zero** transport requests. Page renders the error/empty
state (`showError` is true via `!sId`, `SearchResultsPage.tsx:117`) with an empty summary
header — origin/destination/date read through optional chaining, so there's no crash, just
blanks. React DevTools shows `transportSearchPayload: null` on `SearchResultsPage`.
*One-liner: the route passed `null` instead of the SSR payload, so `useFetchSearchResults`
early-returned and the search never started.*

**A2 — bad endpoint**
Network shows the POST to `/api/transport/search/asyncc` failing (404). Console logs
`SEARCH_RESULTS_FETCH_ERROR`. No polls follow. Error state renders.
*Found in Network, one step.*

**A3 — typo'd success status**
POST succeeds, polls fire forever at `delayInMillis` intervals and never stop. The
progress bar never goes away (`showProgressBar` stays true because `isCompleted` never
flips). Console is silent — nothing threw. The last poll's response body clearly says
`searchStatus: "COMPLETED_SUCCESSFULLY"`, which is the tell: the API said done, the client
didn't agree.
*Only visible in Network. This is the one that punishes skipping Step 2.*

**A4 — forced RTL**
No console error, no network anomaly, nothing wrong in React DevTools — the tree and data
are perfect. The whole page mirrors in English. Only Elements finds it: `<html dir="rtl">`
on an `en` page, while `className` still says `ltr` — the two disagreeing is the smoking
gun.
*The one that proves why Elements stays on the list even when the data layer is clean.*



---

## Definition of done

- [x] Diagnosed without hints — Section C matches what you'd already written down
- [x] Navigated React DevTools and toggled RTL unaided (A1 and A4 each force one)
- [x] Playbook is concrete enough for someone else on a different bug

On the third box: Section B is written to be portable, but it's currently *your* draft.
The honest test is to hand it to someone on a bug you didn't inject and see whether the
order of operations survives contact. Trim what they skipped, and promote whatever they
had to ask you about. Then it's ready to move to the wiki as
**"How I diagnose a broken page"** — Sections A and C stay behind on this branch.