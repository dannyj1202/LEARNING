/**
 * REACT — FilterChipGroup (controlled multi-select chips)
 * ------------------------------------------------------
 * selected array lives in parent. onClick builds a new array (immutable update)
 * and calls onSelectedChange — React/MobX detect change by reference.
 */
"use client";

import styled from "@emotion/styled";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid #eee;
`;

const Heading = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #666;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const Chip = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#0a6e78" : "#fff")};
  border: 1px solid ${(props) => (props.active ? "#0a6e78" : "#ddd")};
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => (props.active ? "#fff" : "#333")};
  cursor: pointer;

  &:hover {
    border-color: #0a6e78;
  }

  &:focus-visible {
    outline: 2px solid #0a6e78;
    outline-offset: 2px;
  }
`;

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onSelectedChange: (next: string[]) => void;
};

export default function FilterChipGroup({
  title,
  options,
  selected,
  onSelectedChange,
}: Props) {
  return (
    <Section>
      <Heading>{title}</Heading>
      <ChipRow>
        {options.map((option) => {
          const isActive = selected.includes(option);
          return (
            <Chip
              key={option} // key on stable option string, not array index
              type="button"
              active={isActive}
              aria-pressed={isActive}
              onClick={() =>
                onSelectedChange(
                  isActive
                    ? selected.filter((item) => item !== option) // remove chip
                    : [...selected, option] // add chip (spread = new array)
                )
              }
            >
              {option}
            </Chip>
          );
        })}
      </ChipRow>
    </Section>
  );
}
