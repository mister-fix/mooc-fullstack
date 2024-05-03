import { useState } from "react";

const Note = (props) => {
	return <li>{props.note}</li>;
};

const App = (props) => {
	const [notes, setNotes] = useState(props.notes);
	const [newNote, setNewNote] = useState("a new note...");
	const [showAll, setShowAll] = useState(true);

	const handleNoteChange = (event) => {
		setNewNote(event.target.value);
	};

	const addNote = (event) => {
		event.preventDefault();

		const noteObject = {
			id: notes.length + 1,
			content: newNote,
			important: Math.random() < 0.5,
		};

		setNotes([...notes, noteObject]);
	};

	const notesToShow = showAll ? notes : notes.filter((note) => note.important);

	return (
		<div>
			<h1>Notes</h1>

			<button onClick={() => setShowAll(!showAll)}>
				show {showAll ? "important" : "all"}
			</button>
			<ul>
				{notesToShow.map((note) => (
					<Note
						key={note.id}
						note={note.content}
					/>
				))}
			</ul>

			<form onSubmit={addNote}>
				<input
					value={newNote}
					onChange={handleNoteChange}
				/>
				<button type="submit">save</button>
			</form>
		</div>
	);
};

export default App;