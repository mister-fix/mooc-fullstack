import { useState } from "react";

const Note = (props) => {
	return <li>{props.content}</li>;
};

const App = (props) => {
	const [notes, setNotes] = useState(props.notes);
	const [newNote, setNewNote] = useState("a new note...");

	const handleNoteChange = (event) => {
		// console.log(event.target.value);
		setNewNote(event.target.value);
	};

	const addNote = (event) => {
		event.preventDefault();

		const noteObject = {
			id: notes.length + 1,
			content: newNote,
			important: Math.random() < 0.5,
		};

		setNotes(notes.concat(noteObject));
		setNewNote("a new note...");

		// console.log("button clicked", event.target);
	};

	return (
		<>
			<div>
				<h1>Notes</h1>

				<ul>
					{notes.map((note) => (
						<Note
							key={note.id}
							content={note.content}
						/>
					))}
				</ul>

				<form onSubmit={addNote}>
					<input
						value={newNote}
						onChange={handleNoteChange}
					/>
					<button type="submit">save note</button>
				</form>
			</div>
		</>
	);
};

export default App;
