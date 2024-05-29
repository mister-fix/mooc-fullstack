const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (request, response) => {
	Person.find({}).then((people) => {
		response.json(people);
	});
});

personRouter.get("/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.json(404).end();
			}
		})
		.catch((error) => next(error));
});

personRouter.post("/", (request, response, next) => {
	const body = request.body;

	Person.findOne({ name: body.name })
		.then((person) => {
			if (person) {
				person.number = body.number;
				person
					.save()
					.then((updatedPerson) => {
						response.json(updatedPerson);
					})
					.catch((error) => next(error));
			} else {
				const newPerson = new Person({
					name: body.name,
					number: body.number,
				});

				newPerson
					.save()
					.then((savedPerson) => {
						response.json(savedPerson);
					})
					.catch((error) => next(error));
			}
		})
		.catch((error) => next(error));
});

personRouter.put("/:id", (request, response, next) => {
	const body = request.body;

	const person = {
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			if (updatedPerson) {
				response.json(updatedPerson);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

personRouter.delete("/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			if (result) {
				response.json(204).end();
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

module.exports = personRouter;
