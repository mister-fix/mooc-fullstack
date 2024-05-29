const appRouter = require("express").Router();
const Person = require("../models/person");

appRouter.get("/info", (request, response) => {
	Person.find({}).then((people) => {
		response.json(people);
	});
});

module.exports = appRouter;
