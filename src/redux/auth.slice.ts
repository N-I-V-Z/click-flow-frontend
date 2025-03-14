import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLogin: boolean;
  role: string;
}

const initialState: AuthState = {
  isLogin: false,
  role: ''
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
    },
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    }
  }
});

export const { login, logout, setRole } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
