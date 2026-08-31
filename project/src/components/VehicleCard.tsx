/**
 * REACT + TS — VehicleCard (lesson 0002–0006)
 * -------------------------------------------
 * Presentational component: receives data via props, no state.
 * Vehicle type is the shared domain model used by mock data, store, and filters.
 */
"use client";

import styled from "@emotion/styled";

// TS: exported type — single source of truth for vehicle shape across the app
export type Vehicle = {
  id: string;
  title: string;
  price: number;
  seats: number;
  luggage: number;
  subtitle: string;
  features: string;
  image: string;
  // TS union literals — only these exact strings are allowed
  carClass: "Luxury" | "Premium" | "Standard" | "Economy";
  carType: "Sedan" | "SUV" | "Van";
  hasFreeCancellation: boolean;
  hasMeetAndGreet: boolean;
};

const Card = styled.article`
  display: grid;
  grid-template-columns: 180px 1fr auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
`;

const Photo = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: #888;
`;

const Capacity = styled.div`
  display: flex;
  gap: 0.85rem;
  font-size: 0.8125rem;
  color: #555;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0.35rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const FeatureItem = styled.li`
  font-size: 0.8125rem;
  color: #2d6a4f;
  display: flex;
  align-items: center;
  gap: 0.35rem;

  &::before {
    content: "✓";
    font-weight: 700;
  }
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const Price = styled.p`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const BookButton = styled.button`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  background: #0a6e78;
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.35rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #085a62;
  }
`;

// TS: destructuring props typed as Vehicle — parent must pass all required fields
export default function VehicleCard({
  title,
  price,
  seats,
  luggage,
  subtitle,
  features,
  image,
}: Vehicle) {
  // Derive display list from comma-separated features string
  const featureParts = features.split(",").map((part) => part.trim());

  return (
    <Card>
      <Photo src={image} alt={title} />
      <Body>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <Capacity>
          <span>👤 {seats}</span>
          <span>🧳 {luggage}</span>
        </Capacity>
        <FeatureList>
          {featureParts.map((feature) => (
            <FeatureItem key={feature}>{feature}</FeatureItem>
          ))}
        </FeatureList>
      </Body>
      <Action>
        <Price>USD {price}</Price>
        {/* Stub — checkout is out of scope per MISSION.md */}
        <BookButton type="button">Book now</BookButton>
      </Action>
    </Card>
  );
}
