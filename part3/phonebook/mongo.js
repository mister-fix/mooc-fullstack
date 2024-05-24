const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://stephen_301:${password}@cluster0.llb5qum.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
const name = process.argv[3];
const number = process.argv[4];

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
	name,
	number,
});

if (process.argv.length === 3) {
	Person.find({}).then((result) => {
		console.log("phonebook:");
		result.forEach((person) => {
			console.log(person);
		});
		mongoose.connection.close();
	});
} else {
	person.save().then((result) => {
		console.log(`added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
}
