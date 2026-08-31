/**
 * REACT — FilterToggle (controlled component, lesson 0008 → 0009)
 * ----------------------------------------------------------------
 * No local useState. Parent passes `on` (value) and `onChange` (updater).
 * Same pattern as a controlled HTML checkbox.
 */
"use client";

import styled from "@emotion/styled";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid #eee;
`;

const Label = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
`;

// TS + Emotion: <$on> is a transient prop ($ = not passed to DOM as HTML attribute)
const Switch = styled.button<{ $on: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${(props) => (props.$on ? "#0a6e78" : "#d0d0d0")};
  transition: background 0.15s ease;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$on ? "22px" : "2px")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: left 0.15s ease;
  }

  &:focus-visible {
    outline: 2px solid #0a6e78;
    outline-offset: 2px;
  }
`;

type Props = {
  label?: string; // TS optional prop — defaults below if omitted
  on: boolean;
  onChange: (next: boolean) => void;
};

export default function FilterToggle({
  label = "Free Cancellation",
  on,
  onChange,
}: Props) {
  return (
    <Row>
      <Label>{label}</Label>
      <Switch
        type="button"
        $on={on}
        aria-pressed={on}
        aria-label={label}
        // Notify parent of new value — parent (or MobX store) owns state
        onClick={() => onChange(!on)}
      />
    </Row>
  );
}
