import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filterBy, setFilterBy] = useState("");
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");

	useEffect(() => {
		console.log("effect");

		axios.get("http://localhost:3001/persons").then((response) => {
			console.log("promise fulfilled");
			setPersons(response.data);
		});
	}, []);

	console.log("rendered", persons.length, "people");

	const handleFilterChange = (event) => {
		setFilterBy(event.target.value);
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const addName = (event) => {
		event.preventDefault();

		const personObject = {
			name: newName,
			number: newNumber,
			id: persons.length + 1,
		};

		const checkPerson = persons
			.map((person) => person.name)
			.includes(personObject.name);

		// const isNameExists = persons.some(
		// 	(person) => person.name === newPersonName
		// );

		checkPerson
			? alert(`${newName} is already added to phonebook`)
			: setPersons([...persons, personObject]);

		setNewName("");
		setNewNumber("");
	};

	const filteredPhoneBook =
		filterBy === ""
			? persons
			: persons.filter((person) =>
					person.name.toLowerCase().includes(filterBy.toLowerCase())
			  );

	return (
		<>
			<div>
				<h2>Phonebook</h2>

				<Filter
					value={filterBy}
					handleChange={handleFilterChange}
				/>

				<h2>add a new</h2>

				<PersonForm
					onSubmit={addName}
					name={newName}
					nameHandler={handleNameChange}
					number={newNumber}
					numberHandler={handleNumberChange}
				/>

				<h2>Numbers</h2>

				<Persons phonebook={filteredPhoneBook} />
			</div>
		</>
	);
};

export default App;
