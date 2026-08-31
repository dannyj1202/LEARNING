/**
 * NEXT.JS + MOBX — MobX route (app/rides/page.tsx → URL: /rides)
 * ---------------------------------------------------------------
 * Same UI as RidesResultsPage, but filter state lives in VehicleResultsStore.
 *
 * - "use client" → hooks + MobX observer need the browser
 * - observer() → re-render when store observables used in JSX change
 * - useEffect still fetches data (network is external to MobX)
 */
"use client";

import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import VehicleCard from "@/components/VehicleCard";
import FiltersPanel from "@/components/FiltersPanel";
import { fetchVehicles } from "@/lib/fetchVehicles";
import { VehicleResultsStore, type SortBy } from "@/stores/vehicleResultsStore";

const Page = styled.main`
  min-height: 100vh;
  background: #f3f4f6;
  color: #1a1a1a;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
`;

const TopBar = styled.header`
  background: #0b3d45;
  color: #fff;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const TopMeta = styled.span`
  font-size: 0.8125rem;
  opacity: 0.85;
`;

const Shell = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 3rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Results = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ResultsToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.15rem;
`;

const ResultsCount = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #444;
`;

const SortSelect = styled.select`
  font-size: 0.8125rem;
  color: #0a6e78;
  background: #e8f4f5;
  border: 1px solid #c5e4e7;
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #0a6e78;
    outline-offset: 2px;
  }
`;

const EmptyMessage = styled.p`
  margin: 2rem 0;
  padding: 1.25rem;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #555;
  background: #fff;
  border: 1px dashed #d0d0d0;
  border-radius: 12px;
`;

// MOBX observer — wraps component so it re-renders when store fields it reads change
const RidesMobXPage = observer(function RidesMobXPage() {
  // One store instance per page visit (lazy init — not recreated every render)
  const [store] = useState(() => new VehicleResultsStore());

  // Fetch still in useEffect — API is outside React/MobX
  useEffect(() => {
    let cancelled = false;
    fetchVehicles().then((data) => {
      if (!cancelled) store.setVehicles(data); // MobX action updates observables
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  return (
    <Page>
      <TopBar>
        <Brand>Almosafer</Brand>
        <TopMeta>Learning rebuild · not production · MobX</TopMeta>
      </TopBar>
      <Shell>
        {/* Store-backed controlled props — same FiltersPanel as lift version */}
        <FiltersPanel
          freeCancel={store.freeCancel}
          onFreeCancelChange={store.setFreeCancel}
          selectedServices={store.selectedServices}
          onSelectedServicesChange={store.setSelectedServices}
          selectedCarClass={store.selectedCarClass}
          onSelectedCarClassChange={store.setSelectedCarClass}
          selectedCarType={store.selectedCarType}
          onSelectedCarTypeChange={store.setSelectedCarType}
          luggage={store.luggage}
          onLuggageChange={store.setLuggage}
        />
        <Results>
          {!store.isLoading && (
            <ResultsToolbar>
              <ResultsCount>
                {/* visibleVehicles = MobX computed (replaces `visible` in lift version) */}
                {store.visibleVehicles.length} out of {store.vehicles.length}{" "}
                options
              </ResultsCount>
              <SortSelect
                value={store.sortBy}
                aria-label="Sort vehicles"
                onChange={(e) => store.setSortBy(e.target.value as SortBy)}
              >
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </SortSelect>
            </ResultsToolbar>
          )}
          {store.isLoading ? (
            <EmptyMessage>Loading rides…</EmptyMessage>
          ) : store.vehicles.length === 0 ? (
            <EmptyMessage>No vehicles available.</EmptyMessage>
          ) : store.visibleVehicles.length === 0 ? (
            <>
              <EmptyMessage>No vehicles match your filters.</EmptyMessage>
              <button type="button" onClick={() => store.clearFilters()}>
                Clear filters
              </button>
            </>
          ) : (
            store.visibleVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))
          )}
        </Results>
      </Shell>
    </Page>
  );
});

export default RidesMobXPage;
