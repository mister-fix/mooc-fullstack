import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) return null;

  const style = {
    border: '1px solid #0A3622',
    color: '#0A3622',
    backgroundColor: '#D1E7DD',
    marginBottom: 20,
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
  };

  return <div style={style}>{notification}</div>;
};

export default Notification;
