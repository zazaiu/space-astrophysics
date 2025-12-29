import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
};
// Реальный API логин
export const loginAsync = createAsyncThunk('auth/login', async (credentials) => {
    const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok)
        throw new Error('Ошибка авторизации');
    return await response.json();
});
// Реальная регистрация
export const registerAsync = createAsyncThunk('auth/register', async (userData) => {
    const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok)
        throw new Error('Ошибка регистрации');
    return await response.json();
});
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(loginAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        })
            .addCase(loginAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Ошибка входа';
        })
            .addCase(registerAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(registerAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        })
            .addCase(registerAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Ошибка регистрации';
        });
    },
});
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
