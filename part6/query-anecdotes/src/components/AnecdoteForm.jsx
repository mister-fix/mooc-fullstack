import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../services/anecdotes";
import { useNotification } from "../NotificationContext";

const AnecdoteForm = () => {
	// Initialized 'useQueryClient' function
	const queryClient = useQueryClient();
	const { showNotification } = useNotification();

	// New anecdote mutation: saves new anecdote to backend and ensures it's rendered in frontend
	const newAnecdoteMutation = useMutation({
		mutationFn: createAnecdote,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData(["anecdotes"]);
			queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
			// queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
			showNotification(`added anecdote: '${newAnecdote.content}'`, 5);
		},
	});

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		event.target.anecdote.value = "";
		console.log("new anecdote:", content);
		// Calling new anecdote mutation
		newAnecdoteMutation.mutate({ content, votes: 0 });
	};

	return (
		<div>
			{/* <Notification /> */}
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
