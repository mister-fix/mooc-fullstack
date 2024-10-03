import { createSlice, current } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
	name: "anecdote",
	initialState: [],
	reducers: {
		// Modified: only push action.payload and votes as server will handle ID generation
		createAnecdote(state, action) {
			state.push(action.payload); // Adds a new anecdote
			console.log(current(state));
		},
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
		// Add 'appendAnecdote' action creator
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
		// Add 'setAnecdotes' action creator
		setAnecdotes(state, action) {
			return action.payload;
		},
	},
});

// Export the action creators that were automatically generated
export const { createAnecdote, voteForAnecdote, setAnecdotes } =
	anecdoteSlice.actions;

// Export the reducer to be used in the store
export default anecdoteSlice.reducer;
