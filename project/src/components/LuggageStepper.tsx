/**
 * REACT — LuggageStepper (controlled number input)
 * -------------------------------------------------
 * count comes from parent; onChange reports the next value.
 * No useState — lifted to RidesResultsPage or MobX store.
 */
"use client";

import styled from "@emotion/styled";

const Row = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 0;
`;

const Label = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const StepButton = styled.button<{ $primary?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${(props) => (props.$primary ? "#0a6e78" : "#ccc")};
  background: ${(props) => (props.$primary ? "#0a6e78" : "#fff")};
  color: ${(props) => (props.$primary ? "#fff" : "#333")};
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #0a6e78;
    outline-offset: 2px;
  }
`;

const Count = styled.span`
  min-width: 1.25rem;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
`;

type Props = {
  count: number;
  onChange: (next: number) => void;
};

export default function LuggageStepper({ count, onChange }: Props) {
  return (
    <Row>
      <Label>Number of luggage</Label>
      <Controls>
        <StepButton
          type="button"
          aria-label="Decrease luggage"
          disabled={count === 0}
          onClick={() => onChange(count - 1)}
        >
          −
        </StepButton>
        <Count aria-live="polite">{count}</Count>
        <StepButton
          type="button"
          $primary
          aria-label="Increase luggage"
          onClick={() => onChange(count + 1)}
        >
          +
        </StepButton>
      </Controls>
    </Row>
  );
}
