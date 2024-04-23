import { useState } from "react";

const History = (props) => {
	if (props.allClicks.length === 0) {
		return <div>the app is used by pressing the buttons</div>;
	}

	return (
		<div>
			<p>button press history: {props.allClicks.join(" ")}</p>
			<p>total: {props.total}</p>
		</div>
	);
};

const Button = ({ handleClick, text }) => {
	return <button onClick={handleClick}>{text}</button>;
};

/*
const App = () => {
	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);
	const [total, setTotal] = useState(0);
	const [allClicks, setAllClicks] = useState([]);

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
			<History
				allClicks={allClicks}
				total={total}
			/>
		</div>
	);
};
*/

const App = () => {
	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);
	const [total, setTotal] = useState(0);
	const [allClicks, setAllClicks] = useState([]);

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
			<Button
				handleClick={handleLeftClick}
				text="left"
			/>
			<Button
				handleClick={handleRightClick}
				text="right"
			/>
			{right}
			<History
				allClicks={allClicks}
				total={total}
			/>
		</div>
	);
};

export default App;
