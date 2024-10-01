import { useDispatch, useSelector } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";

const Anecdote = ({ anecdote, handleVote }) => {
	return (
		<div>
			<div>{anecdote.content}</div>
			<div>
				has {anecdote.votes}
				<button onClick={handleVote}>vote</button>
			</div>
		</div>
	);
};

const AnecdoteList = () => {
	const dispatch = useDispatch();
	const anecdotes = useSelector((state) => {
		const filter = state.filter.toLowerCase();

		return state.anecdotes.filter((anecdote) =>
			anecdote.content.toLowerCase().includes(filter)
		);
	});

	return (
		<div>
			{anecdotes.map((anecdote) => (
				<Anecdote
					key={anecdote.id}
					anecdote={anecdote}
					handleVote={() => dispatch(voteForAnecdote(anecdote.id))}
				/>
			))}
		</div>
	);
};

export default AnecdoteList;
