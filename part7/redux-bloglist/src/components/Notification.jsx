import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';

const Notification = ({ variant }) => {
  const notification = useSelector((state) => state.notification);

  if (!notification) return null;

  return (
    <>
      <Alert className={`${variant}`}>{notification}</Alert>
    </>
  );
};

export default Notification;
