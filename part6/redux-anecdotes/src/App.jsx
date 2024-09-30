import { useSelector, useDispatch } from "react-redux";
import { voteForAnecdote } from "./reducers/anecdoteReducer";
import AnecdoteForm from "./components/AnecdoteForm";

const App = () => {
	const anecdotes = useSelector((state) => {
		// Sort anecdotes by votes in descending order
		return [...state].sort((a, b) => b.votes - a.votes);
	});

	const dispatch = useDispatch();

	return (
		<div>
			<h2>Anecdotes</h2>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => dispatch(voteForAnecdote(anecdote.id))}>
							vote
						</button>
					</div>
				</div>
			))}
			<AnecdoteForm />
		</div>
	);
};

export default App;
