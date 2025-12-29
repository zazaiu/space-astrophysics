import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import worldsReducer from './worldsSlice';
import planetsReducer from './planetsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    worlds: worldsReducer,
    planets: planetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
