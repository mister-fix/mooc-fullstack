import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const addAnecdote = async (e) => {
		e.preventDefault();

		const content = e.target.anecdote.value;
		e.target.anecdote.value = "";

		dispatch(createAnecdote(content));
		dispatch(setNotification(`added anecdote: ${content}`, 5));
	};

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={addAnecdote}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</>
	);
};

export default AnecdoteForm;
