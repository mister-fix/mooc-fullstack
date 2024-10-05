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
	if (newAnecdote.content < 5) {
		throw new Error("too short anecdote, must have a length 5 or more");
	}

	return axios
		.post(baseUrl, newAnecdote)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error("Error:", err.message);

			if (err.response && err.response.status === 400) {
				throw new Error(err.response.data.error);
			}

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
