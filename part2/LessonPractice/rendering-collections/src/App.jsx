/*
const App = (props) => {
	const { notes } = props;

	return (
		<>
			<div>
				<ul>
					<li>{notes[0].content}</li>
					<li>{notes[1].content}</li>
					<li>{notes[2].content}</li>
				</ul>
			</div>
		</>
	);
};
*/

/*
 * Using the javascript array map method to generate the required
 * number of list items matching the number of items inside the notes array
 */

/*
const App = (props) => {
	const { notes } = props;

	return (
		<>
			<div>
				<ul>
					{notes.map((note) => (
						<li>{note.content}</li>
					))}
				</ul>
			</div>
		</>
	);
};
*/

/*
 * Incorporating the key-attribute into the list items as required by use
 * of the array map method
 */

const App = (props) => {
	const { notes } = props;

	return (
		<>
			<div>
				<ul>
					{notes.map((note) => (
						<li key={note.id}>{note.content}</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default App;
