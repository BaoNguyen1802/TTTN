import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
        user: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.user = action.payload.user
        },
        clearToken: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null

        },
        setUser: (state, action) => {
            state.user = action.payload; // Cập nhật thông tin user riêng biệt
        },
    },
});

export const { setToken, clearToken, setUser } = authSlice.actions;

export default authSlice.reducer;