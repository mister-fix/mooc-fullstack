import { useState } from "react";

/*
const App = () => {
	const [counter, setCounter] = useState(0);

	const handleClick = () => {
		console.log("clicked");
	};

	return (
		<div>
			<button onClick={handleClick}>plus</button>
		</div>
	);
};
*/

/*
const App = () => {
	const [counter, setCounter] = useState(0);

	return (
		<div>
			<button onClick={() => console.log("clicked")}>plus</button>
		</div>
	);
};
*/

/*
const App = () => {
	const [counter, setCounter] = useState(0);

	return (
		<div>
			<div>{counter}</div>
			<button onClick={() => setCounter(counter + 1)}>plus</button>
		</div>
	);
};
*/

/*
const App = () => {
	const [counter, setCounter] = useState(0);

	return (
		<div>
			<div>{counter}</div>
			<button onClick={() => setCounter(counter + 1)}>plus</button>
			<button onClick={() => setCounter(0)}>reset</button>
		</div>
	);
};
*/

const App = () => {
	const [counter, setCounter] = useState(0);
	const increaseByOne = () => setCounter(counter + 1);
	const resetCounter = () => setCounter(0);

	return (
		<div>
			<div>{counter}</div>
			<button onClick={increaseByOne}>plus</button>
			<button onClick={resetCounter}>reset</button>
		</div>
	);
};

export default App;
