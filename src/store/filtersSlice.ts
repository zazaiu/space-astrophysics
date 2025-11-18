// src/store/filtersSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit' // Тип только для импорта

interface FiltersState {
  planetName: string;
}

const initialState: FiltersState = {
  planetName: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlanetName: (state, action: PayloadAction<string>) => {
      state.planetName = action.payload
    },
    resetFilters: (state) => {
      state.planetName = ''
    },
  },
})

export const { setPlanetName, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer