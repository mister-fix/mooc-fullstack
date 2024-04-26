import Header from "./Header";
import Part from "./Part";
import Total from "./Total";

const Course = ({ courses }) => {
	return (
		<div>
			{courses.map((course) => (
				<div key={course.id}>
					<Header text={course.name} />

					{course.parts.map((part) => (
						<Part
							key={part.id}
							name={part.name}
							exercises={part.exercises}
						/>
					))}

					<Total parts={course.parts} />
				</div>
			))}
		</div>
	);
};

export default Course;
