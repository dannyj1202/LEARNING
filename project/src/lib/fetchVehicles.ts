/**
 * Mock fetch — simulates an API call (lesson 0010).
 * Lives outside React because the network is an "external system".
 * Components call this from useEffect, then store results in state/MobX.
 */
import type { Vehicle } from "@/components/VehicleCard";
import { MOCK_VEHICLES } from "./mockVehicles";

// Returns a Promise (like real fetch). delayMs lets us see loading UI in dev.
export function fetchVehicles(delayMs = 800): Promise<Vehicle[]> {
  return new Promise((resolve) => {
    // setTimeout = async; resolves after delay with mock data
  // Use resolve([]) only when testing the "empty catalog" UI state
    setTimeout(() => resolve(MOCK_VEHICLES), delayMs);
  });
}
