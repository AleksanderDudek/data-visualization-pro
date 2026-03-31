import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardView } from "../../types";

export interface DashboardState {
  currentView: DashboardView;
  selectedCountryCode: string | null;
  selectedPokemonId: number | null;
  sidebarCollapsed: boolean;
}

const initialState: DashboardState = {
  currentView: "overview",
  selectedCountryCode: null,
  selectedPokemonId: null,
  sidebarCollapsed: false,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<DashboardView>) => {
      state.currentView = action.payload;
    },
    selectCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountryCode = action.payload;
    },
    selectPokemon: (state, action: PayloadAction<number | null>) => {
      state.selectedPokemonId = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setView, selectCountry, selectPokemon, toggleSidebar } =
  dashboardSlice.actions;
