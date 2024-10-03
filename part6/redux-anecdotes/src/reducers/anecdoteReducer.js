import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
	name: "anecdote",
	initialState: [],
	reducers: {
		// Removed 'createAnecdote' definition from here!
		voteForAnecdote(state, action) {
			const id = action.payload;
			const anecdoteToChange = state.find((anecdote) => anecdote.id === id);
			const changedAnecdote = {
				...anecdoteToChange,
				votes: anecdoteToChange.votes + 1,
			};

			return state.map((anecdote) =>
				anecdote.id !== id ? anecdote : changedAnecdote
			);
		},
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
export const { voteForAnecdote, setAnecdotes, appendAnecdote } =
	anecdoteSlice.actions;

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

// Export the reducer to be used in the store
export default anecdoteSlice.reducer;
