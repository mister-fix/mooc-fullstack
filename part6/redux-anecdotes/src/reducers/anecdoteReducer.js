import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
	name: "anecdote",
	initialState: [],
	reducers: {
		// Removed 'createAnecdote' definition from here!
		// Removed 'voteFotAnecdote' definition from here!
		// Add 'setAnecdotes' action creator
		setAnecdotes(state, action) {
			return action.payload;
		},
		// Add 'appendAnecdote' action creator
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
	},
});

// Export the action creators that were automatically generated
export const { setAnecdotes, appendAnecdote } = anecdoteSlice.actions;

// Define async 'initializeAnecdotes' function to initialize anecdotes to the state
export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		await dispatch(setAnecdotes(anecdotes));
	};
};

// Define async 'createAnecdote' action creator to create new anecdotes and append them to the state
export const createAnecdote = (content) => {
	return async (dispatch) => {
		const newNote = await anecdoteService.createNew(content);
		dispatch(appendAnecdote(newNote));
	};
};

// Define async 'voteForAnecdote' action creator to modify selected anecdotes votes and update the state
// to reflect the incremented votes for the modified anecdotes
export const voteForAnecdote = (id) => {
	return async (dispatch, getState) => {
		// Get the updated anecdote from the backend after voting
		const updatedAnecdote = await anecdoteService.vote(id);
		// Get the current anecdotes state
		const anecdotes = getState().anecdotes;
		// Create a new array with the updated anecdote
		const updatedAnecdotes = anecdotes.map((anecdote) =>
			anecdote.id !== id ? anecdote : updatedAnecdote
		);

		// Dispatch an action to update the state
		dispatch(setAnecdotes(updatedAnecdotes));
	};
};

// Export the reducer to be used in the store
export default anecdoteSlice.reducer;
