import Note from "./components/Note";

const App = ({ notes }) => {
	return (
		<div>
			<ul>
				{notes.map((note) => (
					<Note note={note} />
				))}
			</ul>
		</div>
	);
};

export default App;
