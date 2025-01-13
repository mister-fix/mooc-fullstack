const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return type === 'success' ? (
    <div className="notification notification-success">{message}</div>
  ) : type === 'warning' ? (
    <div className="notification notification-warning">{message}</div>
  ) : (
    <div className="notification notification-error">{message}</div>
  );
};

export default Notification;
