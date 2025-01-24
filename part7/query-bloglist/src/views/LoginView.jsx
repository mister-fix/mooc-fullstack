import Notification from "../components/Notification";

const LoginView = ({ handleLogin }) => {
  return (
    <div>
      <h1>log in to application</h1>

      <Notification />

      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label htmlFor="username">Username</label>:{" "}
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>{" "}
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginView;
