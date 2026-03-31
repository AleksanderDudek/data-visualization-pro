import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  regionFilter: string | null;
  searchQuery: string;
  launchSuccessFilter: "all" | "success" | "failure" | "upcoming";
  pokemonTypeFilter: string | null;
  sortField: string | null;
  sortDirection: "asc" | "desc";
}

const initialState: FiltersState = {
  regionFilter: null,
  searchQuery: "",
  launchSuccessFilter: "all",
  pokemonTypeFilter: null,
  sortField: null,
  sortDirection: "desc",
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setRegionFilter: (state, action: PayloadAction<string | null>) => {
      state.regionFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLaunchSuccessFilter: (
      state,
      action: PayloadAction<FiltersState["launchSuccessFilter"]>
    ) => {
      state.launchSuccessFilter = action.payload;
    },
    setPokemonTypeFilter: (state, action: PayloadAction<string | null>) => {
      state.pokemonTypeFilter = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<{ field: string; direction: "asc" | "desc" }>
    ) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setRegionFilter,
  setSearchQuery,
  setLaunchSuccessFilter,
  setPokemonTypeFilter,
  setSort,
  resetFilters,
} = filtersSlice.actions;
