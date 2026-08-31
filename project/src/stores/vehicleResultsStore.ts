/**
 * MOBX — VehicleResultsStore (lesson 0012 / 08b)
 * -----------------------------------------------
 * Same filter/sort problem as RidesResultsPage, but state lives in a store
 * instead of useState in a React component. Mirrors work-repo filter stores.
 *
 * - observable fields → MobX tracks reads/writes
 * - get visibleVehicles → computed (like deriving `visible` during render)
 * - arrow actions → keep `this` bound when passed as callbacks to children
 */
import { makeAutoObservable } from "mobx";
import type { Vehicle } from "@/components/VehicleCard";

// TS: union type — sortBy can only be one of these two string literals
export type SortBy = "price-asc" | "price-desc";

export class VehicleResultsStore {
  // --- Observable state (MobX re-renders observer components when these change) ---
  vehicles: Vehicle[] = [];
  isLoading = true;

  freeCancel = false;
  selectedServices: string[] = [];
  selectedCarClass: string[] = [];
  selectedCarType: string[] = [];
  luggage = 0;
  sortBy: SortBy = "price-asc";

  constructor() {
    // One call: fields → observables, getters → computed, methods → actions
    makeAutoObservable(this);
  }

  /**
   * MOBX computed — equivalent to `const visible = vehicles.filter(...).sort(...)`
   * in RidesResultsPage. Re-runs when any observable it reads changes.
   */
  get visibleVehicles() {
    return this.vehicles
      .filter((vehicle) => {
        if (this.freeCancel && !vehicle.hasFreeCancellation) return false;
        if (
          this.selectedServices.includes("Meet & Greet") &&
          !vehicle.hasMeetAndGreet
        )
          return false;
        if (
          this.selectedCarClass.length > 0 &&
          !this.selectedCarClass.includes(vehicle.carClass)
        )
          return false;
        if (
          this.selectedCarType.length > 0 &&
          !this.selectedCarType.includes(vehicle.carType)
        )
          return false;
        if (this.luggage > 0 && vehicle.luggage < this.luggage) return false;
        return true;
      })
      .sort((a, b) =>
        this.sortBy === "price-asc" ? a.price - b.price : b.price - a.price
      );
  }

  // --- Actions: the only way UI should mutate store fields ---
  // Arrow syntax so `this` stays bound when passed as onFreeCancelChange={store.setFreeCancel}

  setVehicles = (data: Vehicle[]) => {
    this.vehicles = data;
    this.isLoading = false;
  };

  setFreeCancel = (next: boolean) => {
    this.freeCancel = next;
  };

  setSelectedServices = (next: string[]) => {
    this.selectedServices = next;
  };

  setSelectedCarClass = (next: string[]) => {
    this.selectedCarClass = next;
  };

  setSelectedCarType = (next: string[]) => {
    this.selectedCarType = next;
  };

  setLuggage = (next: number) => {
    this.luggage = next;
  };

  setSortBy = (next: SortBy) => {
    this.sortBy = next;
  };

  clearFilters = () => {
    this.freeCancel = false;
    this.selectedServices = [];
    this.selectedCarClass = [];
    this.selectedCarType = [];
    this.luggage = 0;
  };
}
