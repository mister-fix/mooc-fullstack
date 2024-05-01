const Persons = (props) => {
	return (
		<div>
			{props.phonebook.map((person) => (
				<div key={person.id}>
					{person.name} {person.number}
				</div>
			))}
		</div>
	);
};

export default Persons;
