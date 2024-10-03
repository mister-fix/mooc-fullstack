import { createSlice } from "@reduxjs/toolkit";

const generateId = () => (100000 * Math.random()).toFixed(0);

const anecdoteSlice = createSlice({
	name: "anecdote",
	initialState: [],
	reducers: {
		createAnecdote(state, action) {
			state.push({ content: action.payload, votes: 0, id: generateId() }); // Adds a new anecdote
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
