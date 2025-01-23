import { useNotification } from "../NotificationContext";

const Notification = () => {
  const { state } = useNotification();

  if (!state.visible) {
    return null;
  }

  return <div className="notification">{state.message}</div>;
};

export default Notification;
