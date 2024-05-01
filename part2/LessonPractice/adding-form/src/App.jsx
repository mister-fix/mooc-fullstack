import { useState } from "react";

const App = (props) => {
	const [notes, setNotes] = useState(props.notes);

	const addNote = (event) => {
		event.preventDefault();
		console.log("button clicked", event.target);
	};

	return (
		<div>
			<h1>Notes</h1>

			<ul>
				{notes.map((note) => (
					<li key={note.id}>{note.content}</li>
				))}
			</ul>

			<form onSubmit={addNote}>
				<input type="text" />
				<button type="submit">save</button>
			</form>
		</div>
	);
};

export default App;
