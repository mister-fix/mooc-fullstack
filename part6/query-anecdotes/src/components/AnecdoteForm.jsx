import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../services/anecdotes";
import { useNotification } from "../NotificationContext";

const AnecdoteForm = () => {
	const queryClient = useQueryClient();
	const { showNotification } = useNotification();

	const newAnecdoteMutation = useMutation({
		mutationFn: createAnecdote,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData(["anecdotes"]);
			queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
			showNotification(`added anecdote: '${newAnecdote.content}'`, 5); // Displaying added anecdote notification
		},
		onError: (error) => {
			showNotification(error.message, 5); // Displaying error message from server
		},
	});

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;

		newAnecdoteMutation.mutate({ content, votes: 0 });
		event.target.anecdote.value = ""; // Clear input field on successful submission
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
