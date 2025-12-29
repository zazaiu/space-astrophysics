import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { World } from '../services/api/generated/models/World';
import type { Planet } from '../services/api/generated/models/Planet';
import { WorldsService } from '../services/api/generated/services/WorldsService';

interface WorldsState {
  worlds: World[];
  draftWorld: World | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorldsState = {
  worlds: [],
  draftWorld: null,
  isLoading: false,
  error: null,
};

// Thunks
export const fetchWorlds = createAsyncThunk('worlds/fetchWorlds', async () => {
  return await WorldsService.getWorlds();
});

export const createDraftWorld = createAsyncThunk('worlds/createDraftWorld', async () => {
  const response = await WorldsService.postWorlds();
  return response as World;
});

export const updateWorld = createAsyncThunk(
  'worlds/updateWorld',
  async ({ id }: { id: number }) => {
    const response = await WorldsService.putWorlds(id);
    return response as World;
  }
);

export const completeWorld = createAsyncThunk(
  'worlds/completeWorld',
  async ({ id }: { id: number }) => {
    const response = await WorldsService.putWorldsComplete(id);
    return response as World;
  }
);

export const deleteWorld = createAsyncThunk(
  'worlds/deleteWorld',
  async ({ id }: { id: number }) => {
    await WorldsService.deleteWorlds(id);
    return id;
  }
);

const worldsSlice = createSlice({
  name: 'worlds',
  initialState,
  reducers: {
    setDraftWorld: (state, action: PayloadAction<World>) => {
      state.draftWorld = action.payload;
    },
    clearDraft: (state) => {
      state.draftWorld = null;
    },
    addPlanetToDraft: (state, action: PayloadAction<Planet>) => {
      if (!state.draftWorld) {
        state.draftWorld = { planets: [] } as World;
      }
      state.draftWorld.planets = state.draftWorld.planets || [];
      state.draftWorld.planets.push(action.payload);
    },
    removePlanetFromDraft: (state, action: PayloadAction<number>) => {
      if (!state.draftWorld?.planets) return;
      state.draftWorld.planets = state.draftWorld.planets.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorlds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorlds.fulfilled, (state, action: PayloadAction<World[]>) => {
        state.isLoading = false;
        state.worlds = action.payload;
      })
      .addCase(fetchWorlds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заявок';
      })
      .addCase(createDraftWorld.fulfilled, (state, action: PayloadAction<World>) => {
        state.draftWorld = action.payload;
        state.worlds.push(action.payload);
      })
      .addCase(updateWorld.fulfilled, (state, action: PayloadAction<World>) => {
        const index = state.worlds.findIndex(w => w.id === action.payload.id);
        if (index !== -1) state.worlds[index] = action.payload;
        if (state.draftWorld?.id === action.payload.id) state.draftWorld = action.payload;
      })
      .addCase(completeWorld.fulfilled, (state, action: PayloadAction<World>) => {
        const index = state.worlds.findIndex(w => w.id === action.payload.id);
        if (index !== -1) state.worlds[index] = action.payload;
        if (state.draftWorld?.id === action.payload.id) state.draftWorld = action.payload;
      })
      .addCase(deleteWorld.fulfilled, (state, action: PayloadAction<number>) => {
        state.worlds = state.worlds.filter(w => w.id !== action.payload);
        if (state.draftWorld?.id === action.payload) state.draftWorld = null;
      });
  },
});

export const { setDraftWorld, clearDraft, addPlanetToDraft, removePlanetFromDraft } = worldsSlice.actions;
export default worldsSlice.reducer;
  