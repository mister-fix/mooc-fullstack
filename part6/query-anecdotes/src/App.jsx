import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, voteForAnecdote } from "./services/anecdotes";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotification } from "./NotificationContext";
const App = () => {
	const queryClient = useQueryClient();
	const { showNotification } = useNotification();

	const anecdoteVoteMutation = useMutation({
		mutationFn: voteForAnecdote,
		onSuccess: (updatedAnecdote) => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
			showNotification(`you voted for '${updatedAnecdote.content}'`, 5);
		},
	});

	const handleVote = (anecdote) => {
		console.log(`voted for anecdote: ${anecdote.id}`);
		anecdoteVoteMutation.mutate(anecdote.id);
	};

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["anecdotes"],
		queryFn: getAnecdotes,
		retry: false,
		refetchOnWindowFocus: false,
	});

	console.log("anecdotes:", data);

	if (isPending) {
		return <div>loading data...</div>;
	}

	if (isError) {
		console.error("Error:", error.message);
		return <div>anecdote service not available due to problems in server</div>;
	}

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm />

			{data.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
