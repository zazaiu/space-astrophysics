// src/store/filtersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    planetName: '',
};
const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setPlanetName: (state, action) => {
            state.planetName = action.payload;
        },
        resetFilters: (state) => {
            state.planetName = '';
        },
    },
});
export const { setPlanetName, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
