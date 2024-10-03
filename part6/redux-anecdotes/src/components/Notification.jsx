import { useSelector } from "react-redux";

const Notification = () => {
	const notification = useSelector((state) => state.notification);

	if (!notification) {
		return null;
	}

	const style = {
		border: "solid",
		padding: 10,
		marginBottom: 20,
		borderWidth: 1,
		display: notification ? "" : "none", // hide the notification if it's empty
	};

	return <div style={style}>{notification}</div>;
};

export default Notification;
