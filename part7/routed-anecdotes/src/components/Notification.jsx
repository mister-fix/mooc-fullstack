import React from "react";

const Notification = ({ notification }) => {
	const styles = {
		border: "1px solid black",
	};

	if (!notification) {
		return null;
	}

	return <div style={styles}>{notification}</div>;
};

export default Notification;
