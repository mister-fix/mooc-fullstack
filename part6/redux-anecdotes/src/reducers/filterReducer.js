import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
	name: "filter",
	initialState: "",
	reducers: {
		filterChange(state, action) {
			return action.payload; // Update the filter with the new input value
		},
	},
});

// Export the action creators that were automatically generated
export const { filterChange } = filterSlice.actions;

// Export the reducer to be used in the store
export default filterSlice.reducer;
