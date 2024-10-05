import React, { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
	switch (action.type) {
		case "SHOW_NOTIFICATION":
			return { message: action.payload, visible: true };
		case "HIDE_NOTIFICATION":
			return { ...state, visible: false };
		default:
			return state;
	}
};

const NotificationProvider = ({ children }) => {
	const [state, dispatch] = useReducer(notificationReducer, {
		message: "",
		visible: false,
	});

	const showNotification = (message, duration) => {
		dispatch({ type: "SHOW_NOTIFICATION", payload: message });
		setTimeout(() => {
			dispatch({ type: "HIDE_NOTIFICATION" });
		}, duration * 1000);
	};

	return (
		<NotificationContext.Provider value={{ state, showNotification }}>
			{children}
		</NotificationContext.Provider>
	);
};

// Custom hook to use Notification Context
export const useNotification = () => {
	return useContext(NotificationContext);
};

export default NotificationProvider;
