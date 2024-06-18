const Notification = ({ message, type }) => {
	if (message === null) {
		return null;
	}

	return type === "success" ? (
		<div className="notification notification-success">{message}</div>
	) : (
		<div className="notification notification-warning">{message}</div>
	);
};

export default Notification;
