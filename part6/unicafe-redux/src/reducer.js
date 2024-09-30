const initialState = {
	good: 0,
	ok: 0,
	bad: 0,
};

const counterReducer = (state = initialState, action) => {
	console.log(action);
	switch (action.type) {
		case "GOOD":
			return { ...state, good: state.good + 1 };
		case "OK":
			return { ...state, ok: state.ok + 1 };
		case "BAD":
			return { ...state, bad: state.bad + 1 };
		case "ZERO": {
			// Instead of mutating like so: Object.keys(state).forEach((prop) => (state[prop] = 0))
			// Return a new state object where all values are reset to 0
			return { good: 0, ok: 0, bad: 0 };
		}
		default:
			return state;
	}
};

export default counterReducer;
