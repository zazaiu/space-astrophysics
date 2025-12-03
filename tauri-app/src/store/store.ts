// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from './filtersSlice'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
  devTools: import.meta.env.MODE !== 'production', // Исправлено для Vite
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch