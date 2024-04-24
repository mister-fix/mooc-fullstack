import { useState } from "react";

const Header = (props) => <h1>{props.text}</h1>;

const Button = ({ clickHandler, text }) => {
	return <button onClick={clickHandler}>{text}</button>;
};

const StatisticsLine = (props) => {
	return (
		<>
			<td>{props.text}</td>
			<td>{props.value}</td>
		</>
	);
};

const Statistics = (props) => {
	if (props.stats.all === 0) {
		return <p>No feedback given</p>;
	}

	return (
		<div>
			<div>
				<table>
					<tbody>
						{Object.entries(props.stats).map(([key, value]) => (
							<tr key={key}>
								<StatisticsLine
									text={key}
									value={value}
								/>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);
	const [total, setTotal] = useState(0);

	// Calculating the average score
	const averageScore = (good - bad) / total || 0;
	// Calculating the percentage of positive feedback
	const positivePercentage = `${(good / total) * 100 || 0}%`;

	const handleGood = () => {
		setGood(good + 1);
		setTotal(total + 1);
	};

	const handleNeutral = () => {
		setNeutral(neutral + 1);
		setTotal(total + 1);
	};

	const handleBad = () => {
		setBad(bad + 1);
		setTotal(total + 1);
	};

	const stats = {
		good: good,
		neutral: neutral,
		bad: bad,
		all: total,
		average: averageScore,
		positive: positivePercentage,
	};

	return (
		<div>
			<div>
				<Header text="give feedback" />

				<div>
					<Button
						clickHandler={handleGood}
						text="good"
					/>
					<Button
						clickHandler={handleNeutral}
						text="neutral"
					/>
					<Button
						clickHandler={handleBad}
						text="bad"
					/>
				</div>
			</div>

			<div>
				<Header text="statistics" />

				<Statistics stats={stats} />
			</div>
		</div>
	);
};

export default App;
