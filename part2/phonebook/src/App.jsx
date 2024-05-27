import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filterBy, setFilterBy] = useState("");
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [notification, setNotification] = useState({
		message: null,
		type: null,
	});

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

						setNotification({
							message: `Updated ${personToUpdate.name}`,
							type: "success",
						});
						setTimeout(() => {
							setNotification({ message: null, type: null });
						}, 5000);
					});
			}
		} else {
			personService
				.createPerson(personObject)
				.then((returnedPerson) => {
					setPersons([...persons, returnedPerson]);

					setNotification({
						message: `Added ${returnedPerson.name}`,
						type: "success",
					});
					setTimeout(() => {
						setNotification({ message: null, type: null });
					}, 5000);
				})
				.catch((error) => {
					setNotification({
						message: `${error.response.data.error}`,
						type: "warning",
					});
					setTimeout(() => {
						setNotification({ message: null, type: null });
					}, 5000);
				});

			setNewName("");
			setNewNumber("");
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
					setNotification({
						message: `${person.name} was removed`,
						type: "warning",
					});
					setTimeout(() => {
						setNotification({ message: null, type: null });
					}, 5000);
				})
				.catch((error) => {
					console.error(error.message);
					setNotification({
						message: `Information on ${person.name} has already been removed from server`,
						type: "warning",
					});
					setTimeout(() => {
						setNotification({ message: null, type: null });
					}, 5000);
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

				<Notification
					message={notification.message}
					type={notification.type}
				/>

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
