const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		validate: {
			validator: (v) => {
				return /\d{2,3}-\d+$/.test(v) && v.length >= 8;
			},
			message: (props) => `${props.value} is not a valid phone number`,
		},
		required: [true, "Phone number required"],
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
