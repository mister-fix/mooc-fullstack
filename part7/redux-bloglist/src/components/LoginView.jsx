import { useSelector } from 'react-redux';
import Notification from './Notification';

const LoginView = ({ handleLogin }) => {
  const user = useSelector((state) => state.user?.user || null);

  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username: <input type="text" name="username" />
        </div>
        <div>
          password: <input type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginView;
