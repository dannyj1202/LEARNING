/**
 * REACT — FiltersPanel (controlled pass-through)
 * ----------------------------------------------
 * No useState here (lesson 0009). Parent or MobX store owns all filter values.
 * This component only forwards props to FilterToggle, FilterChipGroup, LuggageStepper.
 */
"use client";

import styled from "@emotion/styled";
import FilterToggle from "./FilterToggle";
import FilterChipGroup from "./FilterChipGroup";
import LuggageStepper from "./LuggageStepper";

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1rem 1.15rem 0.5rem;
  position: sticky;
  top: 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.15rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const Sub = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #888;
`;

// TS: Props type documents the controlled-component contract for the parent
type FiltersPanelProps = {
  freeCancel: boolean;
  onFreeCancelChange: (next: boolean) => void;
  selectedServices: string[];
  onSelectedServicesChange: (next: string[]) => void;
  selectedCarClass: string[];
  onSelectedCarClassChange: (next: string[]) => void;
  selectedCarType: string[];
  onSelectedCarTypeChange: (next: string[]) => void;
  luggage: number;
  onLuggageChange: (next: number) => void;
};

export default function FiltersPanel({
  freeCancel,
  onFreeCancelChange,
  selectedServices,
  onSelectedServicesChange,
  selectedCarClass,
  onSelectedCarClassChange,
  selectedCarType,
  onSelectedCarTypeChange,
  luggage,
  onLuggageChange,
}: FiltersPanelProps) {
  return (
    <Panel>
      <Header>
        <Title>Filters</Title>
      </Header>
      <FilterToggle on={freeCancel} onChange={onFreeCancelChange} />
      <FilterChipGroup
        title="Services"
        options={["Meet & Greet"]}
        selected={selectedServices}
        onSelectedChange={onSelectedServicesChange}
      />
      <FilterChipGroup
        title="Car class"
        options={["Luxury", "Premium", "Standard", "Economy"]}
        selected={selectedCarClass}
        onSelectedChange={onSelectedCarClassChange}
      />
      <FilterChipGroup
        title="Car type"
        options={["SUV", "Van", "Sedan"]}
        selected={selectedCarType}
        onSelectedChange={onSelectedCarTypeChange}
      />
      <LuggageStepper count={luggage} onChange={onLuggageChange} />
    </Panel>
  );
}
