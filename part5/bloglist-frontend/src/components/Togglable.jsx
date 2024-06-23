import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, refs) => {
	const [visibility, setVisibility] = useState(false);
	const hideWhenVisible = { display: visibility ? "none" : "" };
	const showWhenVisible = { display: visibility ? "" : "none" };

	const toggleVisibility = () => {
		setVisibility(!visibility);
	};

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility,
		};
	});

	return (
		<div style={{ marginBottom: "10px" }}>
			<div style={hideWhenVisible}>
				<button onClick={toggleVisibility}>{props.buttonLabel}</button>
			</div>
			<div style={showWhenVisible}>
				{props.children}
				<button onClick={toggleVisibility}>cancel</button>
			</div>
		</div>
	);
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
