import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Planet } from '../services/api/generated/models/Planet';
import { PlanetsService } from '../services/api/generated/services/PlanetsService';

interface PlanetsState {
  planets: Planet[];
  draftPlanet: Planet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlanetsState = {
  planets: [],
  draftPlanet: null,
  isLoading: false,
  error: null,
};

// Thunks
export const fetchPlanets = createAsyncThunk('planets/fetchPlanets', async () => {
  return await PlanetsService.getPlanets();
});

export const createPlanet = createAsyncThunk('planets/createPlanet', async () => {
  const response = await PlanetsService.postPlanets();
  return response as Planet;
});

export const updatePlanet = createAsyncThunk(
  'planets/updatePlanet',
  async ({ id }: { id: number }) => {
    const response = await PlanetsService.putPlanets(id);
    return response as Planet;
  }
);

export const deletePlanet = createAsyncThunk(
  'planets/deletePlanet',
  async ({ id }: { id: number }) => {
    await PlanetsService.deletePlanets(id);
    return id;
  }
);

const planetsSlice = createSlice({
  name: 'planets',
  initialState,
  reducers: {
    setDraftPlanet: (state, action: PayloadAction<Planet>) => {
      state.draftPlanet = action.payload;
    },
    clearDraftPlanet: (state) => {
      state.draftPlanet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanets.fulfilled, (state, action: PayloadAction<Planet[]>) => {
        state.isLoading = false;
        state.planets = action.payload;
      })
      .addCase(fetchPlanets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки планет';
      })
      .addCase(createPlanet.fulfilled, (state, action: PayloadAction<Planet>) => {
        state.planets.push(action.payload);
        state.draftPlanet = action.payload;
      })
      .addCase(updatePlanet.fulfilled, (state, action: PayloadAction<Planet>) => {
        const index = state.planets.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.planets[index] = action.payload;
        }
        if (state.draftPlanet?.id === action.payload.id) {
          state.draftPlanet = action.payload;
        }
      })
      .addCase(deletePlanet.fulfilled, (state, action: PayloadAction<number>) => {
        state.planets = state.planets.filter(p => p.id !== action.payload);
        if (state.draftPlanet?.id === action.payload) {
          state.draftPlanet = null;
        }
      });
  },
});

export const { setDraftPlanet, clearDraftPlanet } = planetsSlice.actions;
export default planetsSlice.reducer;
