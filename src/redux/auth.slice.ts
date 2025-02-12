import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLogin: boolean;
}

const initialState: AuthState = {
  isLogin: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    }
  }
});

export const { login, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
