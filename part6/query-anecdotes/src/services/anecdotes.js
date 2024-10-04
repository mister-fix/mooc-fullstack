import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = () => {
	return axios
		.get(baseUrl)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error("Error:", err.message);
			throw new Error("Failed to fetch anecdotes");
		});
};

export const createAnecdote = (newAnecdote) => {
	return axios
		.post(baseUrl, newAnecdote)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error("Error:", err.message);
			throw new Error("Failed to create new anecdote");
		});
};

export const voteForAnecdote = async (id) => {
	const anecdotes = await getAnecdotes();
	const anecdoteToUpdate = anecdotes.find((anecdote) => anecdote.id === id);
	const updatedAnecdote = {
		...anecdoteToUpdate,
		votes: anecdoteToUpdate.votes + 1,
	};

	return axios
		.put(`${baseUrl}/${id}`, updatedAnecdote)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error("Error:", err.message);
			throw new Error("Failed to update anecdote");
		});
};
