import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Icon from "../components/Icon";
import Notification from "../components/Notification";

const LoginView = ({ handleLogin }) => {
  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="d-flex align-items-center justify-content-center bg-light"
    >
      <div style={{ width: "30%" }}>
        <h1 className="fs-5 mb-5">Log in to your account</h1>

        <Notification />

        <Form onSubmit={handleLogin} className="login-form">
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-secondary">
              Username
            </Form.Label>
            <Form.Control
              type="text"
              id="username"
              name="username"
              className="p-2"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium text-secondary">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              id="password"
              name="password"
              className="p-2"
            />
          </Form.Group>
          <Button type="submit" className="d-flex align-items-center">
            <span className="me-2">Log in</span>{" "}
            <Icon name="MoveRight" size={18} />
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginView;
