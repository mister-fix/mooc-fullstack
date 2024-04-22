const Header = (props) => {
	return (
		<div>
			<h1>{props.course}</h1>
		</div>
	);
};

const Part = (props) => {
	return (
		<div>
			<p>
				{props.name} {props.exercises}
			</p>
		</div>
	);
};

const Content = (props) => {
	return (
		<div>
			{props.parts.map((item, i) => (
				<Part
					key={i}
					name={item.name}
					exercises={item.exercises}
				/>
			))}
		</div>
	);
};

const Total = (props) => {
	return (
		<div>
			<p>
				<strong>
					Number of exercises{" "}
					{props.parts.reduce((sum, part) => sum + part.exercises, 0)}
				</strong>
			</p>
		</div>
	);
};

const App = () => {
	const course = {
		name: "Half Stack application development",
		parts: [
			{
				name: "Fundamentals of React",
				exercises: 10,
			},
			{
				name: "Using props to pass data",
				exercises: 7,
			},
			{
				name: "State of a component",
				exercises: 14,
			},
		],
	};

	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	);
};

export default App;
