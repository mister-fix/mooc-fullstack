import { useSelector, useDispatch } from "react-redux";
import { createAnecdote, voteForAnecdote } from "./reducers/anecdoteReducer";

const App = () => {
	const anecdotes = useSelector((state) => {
		// Sort anecdotes by votes in descending order
		return [...state].sort((a, b) => b.votes - a.votes);
	});

	const dispatch = useDispatch();

	const addAnecdote = (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		e.target.anecdote.value = "";
		console.log("add new", content);
		dispatch(createAnecdote(content));
	};

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
			<h2>create new</h2>
			<form onSubmit={addAnecdote}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default App;
