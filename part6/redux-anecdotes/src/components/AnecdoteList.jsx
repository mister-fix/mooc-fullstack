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
		const anecdotes = state.anecdotes;
		// Sorting the anecdotes by votes
		const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

		// Return sorted anecdotes with or without filter applied
		return filter === ""
			? sortedAnecdotes
			: sortedAnecdotes.filter((anecdote) =>
					anecdote.content.toLowerCase().includes(filter)
				);

		// return filter === ""
		// 	? [...state.anecdotes].sort((a, b) => b.votes - a.votes)
		// 	: state.anecdotes.filter((anecdote) =>
		// 			anecdote.content.toLowerCase().includes(filter)
		// 		);
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
