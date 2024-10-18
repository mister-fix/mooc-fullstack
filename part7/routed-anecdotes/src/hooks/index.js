import { useState } from "react";

/**
 * @function useField
 * @description Custom Hook that works with form fields to set/track the value (or input) of the field.
 * @param {*} type - Form field type (text, date, etc.)
 * @constant
 * @returns  {Object} Object containing the form field type, its inputted value, and onChange handler.
 */
export const useField = (type) => {
	// Initializing the state of the value to an empty string
	const [value, setValue] = useState("");

	// onChange handling function for when the field receives an input
	const onChange = (e) => {
		setValue(e.target.value);
	};

	// Rest value function, clears the form field value
	const reset = () => {
		setValue("");
	};

	// Returning the field type, value, and onChange handler
	return {
		type,
		value,
		onChange,
		reset,
	};
};
