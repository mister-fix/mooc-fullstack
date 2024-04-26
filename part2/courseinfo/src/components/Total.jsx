const Total = ({ parts }) => {
	return (
		<p>
			<strong>
				total of {parts.reduce((sum, part) => sum + part.exercises, 0)}{" "}
				exercises
			</strong>
		</p>
	);
};

export default Total;
