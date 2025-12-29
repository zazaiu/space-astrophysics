import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WorldsService } from '../services/api/generated/services/WorldsService';
const initialState = {
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
    return response;
});
export const updateWorld = createAsyncThunk('worlds/updateWorld', async ({ id }) => {
    const response = await WorldsService.putWorlds(id);
    return response;
});
export const completeWorld = createAsyncThunk('worlds/completeWorld', async ({ id }) => {
    const response = await WorldsService.putWorldsComplete(id);
    return response;
});
export const deleteWorld = createAsyncThunk('worlds/deleteWorld', async ({ id }) => {
    await WorldsService.deleteWorlds(id);
    return id;
});
const worldsSlice = createSlice({
    name: 'worlds',
    initialState,
    reducers: {
        setDraftWorld: (state, action) => {
            state.draftWorld = action.payload;
        },
        clearDraft: (state) => {
            state.draftWorld = null;
        },
        addPlanetToDraft: (state, action) => {
            if (!state.draftWorld) {
                state.draftWorld = { planets: [] };
            }
            state.draftWorld.planets = state.draftWorld.planets || [];
            state.draftWorld.planets.push(action.payload);
        },
        removePlanetFromDraft: (state, action) => {
            if (!state.draftWorld?.planets)
                return;
            state.draftWorld.planets = state.draftWorld.planets.filter(p => p.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorlds.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(fetchWorlds.fulfilled, (state, action) => {
            state.isLoading = false;
            state.worlds = action.payload;
        })
            .addCase(fetchWorlds.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Ошибка загрузки заявок';
        })
            .addCase(createDraftWorld.fulfilled, (state, action) => {
            state.draftWorld = action.payload;
            state.worlds.push(action.payload);
        })
            .addCase(updateWorld.fulfilled, (state, action) => {
            const index = state.worlds.findIndex(w => w.id === action.payload.id);
            if (index !== -1)
                state.worlds[index] = action.payload;
            if (state.draftWorld?.id === action.payload.id)
                state.draftWorld = action.payload;
        })
            .addCase(completeWorld.fulfilled, (state, action) => {
            const index = state.worlds.findIndex(w => w.id === action.payload.id);
            if (index !== -1)
                state.worlds[index] = action.payload;
            if (state.draftWorld?.id === action.payload.id)
                state.draftWorld = action.payload;
        })
            .addCase(deleteWorld.fulfilled, (state, action) => {
            state.worlds = state.worlds.filter(w => w.id !== action.payload);
            if (state.draftWorld?.id === action.payload)
                state.draftWorld = null;
        });
    },
});
export const { setDraftWorld, clearDraft, addPlanetToDraft, removePlanetFromDraft } = worldsSlice.actions;
export default worldsSlice.reducer;
