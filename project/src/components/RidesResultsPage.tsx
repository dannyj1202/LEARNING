/**
 * REACT — Lift-state vehicle results page (lesson 0009 / 08a)
 * ------------------------------------------------------------
 * Used by /rides-lift. All filter state lives HERE (lifted parent).
 * Children are controlled: value + onChange props, no local filter state.
 *
 * "use client" required: useState, useEffect, and click handlers need a Client Component.
 */
"use client";

import styled from "@emotion/styled";
import VehicleCard, { Vehicle } from "@/components/VehicleCard";
import FiltersPanel from "@/components/FiltersPanel";
import { useState, useEffect } from "react";
import { fetchVehicles } from "@/lib/fetchVehicles";

// Emotion styled components — CSS-in-JS; $prefix props are not forwarded to DOM
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

export default function RidesResultsPage() {
  // REACT useState — single source of truth for all filter + fetch state (lift pattern)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // TS generic: array of Vehicle
  const [isLoading, setIsLoading] = useState(true);
  const [freeCancel, setFreeCancel] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCarClass, setSelectedCarClass] = useState<string[]>([]);
  const [selectedCarType, setSelectedCarType] = useState<string[]>([]);
  const [luggage, setLuggage] = useState(0);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc">("price-asc");

  // REACT useEffect — sync with external system (mock API). NOT for filtering.
  useEffect(() => {
    let cancelled = false; // cleanup flag: ignore late responses if user navigates away
    setIsLoading(true);
    fetchVehicles().then((data) => {
      if (!cancelled) {
        setVehicles(data);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true; // cleanup runs on unmount
    };
  }, []); // [] = run once after mount

  // REACT derive during render — do NOT put this in useEffect or useState
  const visible = vehicles
    .filter((vehicle) => {
      if (freeCancel && !vehicle.hasFreeCancellation) return false;
      if (selectedServices.includes("Meet & Greet") && !vehicle.hasMeetAndGreet) {
        return false;
      }
      if (selectedCarClass.length > 0 && !selectedCarClass.includes(vehicle.carClass)) {
        return false;
      }
      if (selectedCarType.length > 0 && !selectedCarType.includes(vehicle.carType)) {
        return false;
      }
      if (luggage > 0 && vehicle.luggage < luggage) return false;
      return true;
    })
    .sort((a, b) =>
      sortBy === "price-asc" ? a.price - b.price : b.price - a.price
    );

  // Event handler — resets filter state (not an Effect)
  function clearFilters() {
    setFreeCancel(false);
    setSelectedServices([]);
    setSelectedCarClass([]);
    setSelectedCarType([]);
    setLuggage(0);
  }

  return (
    <Page>
      <TopBar>
        <Brand>Almosafer</Brand>
        <TopMeta>Learning rebuild · not production</TopMeta>
      </TopBar>
      <Shell>
        {/* Controlled children: parent owns state, passes value + setter */}
        <FiltersPanel
          freeCancel={freeCancel}
          onFreeCancelChange={setFreeCancel}
          selectedServices={selectedServices}
          onSelectedServicesChange={setSelectedServices}
          selectedCarClass={selectedCarClass}
          onSelectedCarClassChange={setSelectedCarClass}
          selectedCarType={selectedCarType}
          onSelectedCarTypeChange={setSelectedCarType}
          luggage={luggage}
          onLuggageChange={setLuggage}
        />
        <Results>
          {!isLoading && (
            <ResultsToolbar>
              <ResultsCount>
                {visible.length} out of {vehicles.length} options
              </ResultsCount>
              <SortSelect
                value={sortBy}
                aria-label="Sort vehicles"
                onChange={(e) =>
                  // TS assertion: tell compiler e.target.value is our union type
                  setSortBy(e.target.value as "price-asc" | "price-desc")
                }
              >
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </SortSelect>
            </ResultsToolbar>
          )}
          {/* Edge states — order matters: loading → empty catalog → no matches → list */}
          {isLoading ? (
            <EmptyMessage>Loading rides…</EmptyMessage>
          ) : vehicles.length === 0 ? (
            <EmptyMessage>No vehicles available.</EmptyMessage>
          ) : visible.length === 0 ? (
            <>
              <EmptyMessage>No vehicles match your filters.</EmptyMessage>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </>
          ) : (
            visible.map((vehicle) => (
              // key = React list identity (lesson 0003); {...vehicle} spreads props into VehicleCard
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))
          )}
        </Results>
      </Shell>
    </Page>
  );
}
