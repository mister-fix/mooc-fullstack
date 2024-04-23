import { useState } from "react";

/*
const App = () => {
	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);
	const [allClicks, setAllClicks] = useState([]);

	const handleLeftClick = () => {
		setAllClicks(allClicks.concat("L"));
		setLeft(left + 1);
	};

	const handleRightClick = () => {
		setAllClicks(allClicks.concat("R"));
		setRight(right + 1);
	};

	return (
		<div>
			{left}
			<button onClick={handleLeftClick}>left</button>
			<button onClick={handleRightClick}>right</button>
			{right}

			<p>All clicks: {allClicks.join(" ")}</p>
		</div>
	);
};
*/
/*
const App = () => {
	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);
	const [allClicks, setAllClicks] = useState([]);
	const [total, setTotal] = useState(0);

	const handleLeftClick = () => {
		setAllClicks(allClicks.concat("L"));
		console.log("left before", left);
		setLeft(left + 1);
		console.log("left after", left);
		setTotal(left + right);
	};

	const handleRightClick = () => {
		setAllClicks(allClicks.concat("R"));
		console.log("right before", right);
		setRight(right + 1);
		console.log("right after", right);
		setTotal(left + right);
	};

	return (
		<div>
			{left}
			<button onClick={handleLeftClick}>left</button>
			<button onClick={handleRightClick}>right</button>
			{right}

			<p>All clicks: {allClicks.join(" ")}</p>
			<p>Total: {total}</p>
		</div>
	);
};
*/

const App = () => {
	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);
	const [allClicks, setAllClicks] = useState([]);
	const [total, setTotal] = useState(0);

	const handleLeftClick = () => {
		setAllClicks(allClicks.concat("L"));
		const updatedLeft = left + 1;
		setLeft(updatedLeft);
		setTotal(updatedLeft + right);
	};

	const handleRightClick = () => {
		setAllClicks(allClicks.concat("R"));
		const updatedRight = right + 1;
		setRight(updatedRight);
		setTotal(updatedRight + left);
	};

	return (
		<div>
			{left}
			<button onClick={handleLeftClick}>left</button>
			<button onClick={handleRightClick}>right</button>
			{right}

			<p>All clicks: {allClicks.join(" ")}</p>
			<p>Total: {total}</p>
		</div>
	);
};

export default App;
