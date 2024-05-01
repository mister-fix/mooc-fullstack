import { useState } from "react";
import Note from "./components/Note";

const App = (props) => {
	const [notes, setNotes] = useState(props.notes);
	const [newNote, setNewNote] = useState("a new note...");
	const [showAll, setShowAll] = useState(true);

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
		// console.log("button clicked...", event.target);
	};

	const notesToShow = showAll
		? notes
		: notes.filter((note) => note.important === true);

	return (
		<>
			<div>
				<h1>Notes</h1>

				<div>
					<button onClick={() => setShowAll(!showAll)}>
						show {showAll ? "important" : "all"}
					</button>
				</div>

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
					<button type="submit">save note</button>
				</form>
			</div>
		</>
	);
};

export default App;
