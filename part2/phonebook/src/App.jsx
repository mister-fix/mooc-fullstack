import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filterBy, setFilterBy] = useState("");
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");

	useEffect(() => {
		personService.getPersons().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

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
		};

		const checkPerson = persons
			.map((person) => person.name)
			.includes(personObject.name);

		// const isNameExists = persons.some(
		// 	(person) => person.name === newPersonName
		// );

		if (checkPerson) {
			const confirmChange = window.confirm(
				`${newName} is already added to phonebook, replace old number with a new one?`
			);
			const personToUpdate = persons.find((person) => person.name === newName);

			if (confirmChange) {
				personService
					.updatePerson(personToUpdate.id, personObject)
					.then((returnedPerson) => {
						setPersons(
							persons.map((person) =>
								person.id !== personToUpdate.id ? person : returnedPerson
							)
						);
						setNewName("");
						setNewNumber("");
					});
			}
		} else {
			personService.createPerson(personObject).then((returnedPerson) => {
				setPersons([...persons, returnedPerson]);
				setNewName("");
				setNewNumber("");
			});
		}
	};

	const deletePerson = (id) => {
		const person = persons.find((person) => person.id === id);
		const accept = window.confirm(`Delete ${person.name}?`);

		if (accept) {
			personService
				.removePerson(id)
				.then(() => {
					setPersons(persons.filter((person) => person.id !== id));
				})
				.catch((error) => {
					alert(`${person.name} was already deleted`);
					console.error(error.message);
				});
		}
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

				<Persons
					phonebook={filteredPhoneBook}
					deletePerson={deletePerson}
				/>
			</div>
		</>
	);
};

export default App;
