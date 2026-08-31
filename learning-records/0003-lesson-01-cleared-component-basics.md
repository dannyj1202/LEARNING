# Lesson 0001 cleared — component tree recall solid, two gaps corrected

User recalled the full vehicle-page component tree from memory unprompted (ResultsPage → SearchSummary/FiltersPanel/ResultsList, VehicleCard's children) — genuine retrieval, not just quiz recognition. Two related misconceptions were surfaced and corrected in the same session: (1) conflated *where a UI element renders* with *where its state lives* — placed a hypothetical "Compare" checkbox in `ResultsList` rather than seeing it renders per-card inside `VehicleCard` while the cross-card selection state belongs higher up; (2) explained the capital-letter component rule as "just React syntax" rather than the actual JSX compilation mechanism (lowercase → string/host-tag lookup, capital → variable reference call).

## Implications
- Floor is solid for Lesson 0002 (props).
- The UI-vs-state-location gap from Q2 is a natural callback when teaching **08a** (lifting state up) — reuse the Compare-checkbox example.
- No need to re-explain JSX capitalization mechanism again once stated once, but watch for it resurfacing when TypeScript/generic component typing is introduced.
