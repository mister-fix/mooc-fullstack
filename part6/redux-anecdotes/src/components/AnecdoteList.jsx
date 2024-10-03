import { useDispatch, useSelector } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import {
	clearNotification,
	setNotification,
} from "../reducers/notificationReducer";

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

	const handleVoting = async (anecdote) => {
		dispatch(voteForAnecdote(anecdote.id));
		dispatch(setNotification(`you voted '${anecdote.content}'`));

		setTimeout(() => {
			dispatch(clearNotification());
		}, 5000);
	};

	return (
		<div>
			{anecdotes.map((anecdote) => (
				<Anecdote
					key={anecdote.id}
					anecdote={anecdote}
					handleVote={() => handleVoting(anecdote)}
				/>
			))}
		</div>
	);
};

export default AnecdoteList;
