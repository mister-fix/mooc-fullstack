import PropTypes from 'prop-types';

const LoginForm = ({ handleLogin }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    handleLogin(username, password);
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username: <input type="text" name="Username" />
        </div>
        <div>
          password: <input type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
