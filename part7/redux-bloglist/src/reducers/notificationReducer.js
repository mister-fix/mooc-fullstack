import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null, // No notification by default
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    // Dispatch the action to set the notification message
    dispatch(showNotification(message));

    // Set a timeout to clear the notification after 'duration' seconds
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000); // Convert seconds to milliseconds
  };
};

export default notificationSlice.reducer;
