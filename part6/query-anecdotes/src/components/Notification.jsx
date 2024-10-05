import { useNotification } from "../NotificationContext";

const Notification = () => {
	const { state } = useNotification();

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 5,
	};

	if (!state.visible) return null; // Don't render if the notification is not visible

	return <div style={style}>{state.message}</div>;
};

export default Notification;
