import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';

// const initialState = {
//   user: null,
// };

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload; // Store user data
    },
    clearUser(state) {
      state.user = null; // Clear the user on logout
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loginUser = () => {
  return async (dispatch) => {
    await loginService.login();
  };
};

export default userSlice.reducer;
