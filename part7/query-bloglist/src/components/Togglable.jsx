import { forwardRef, useImperativeHandle, useState } from "react";
import Button from "react-bootstrap/Button";
import Icon from "./Icon";

const Togglable = forwardRef((props, refs) => {
  const [visibility, setVisibility] = useState(false);
  const hideWhenVisible = { display: visibility ? "none" : "" };
  const showWhenVisible = { display: visibility ? "" : "none" };

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div style={{ margin: "1em 0" }} className="position-relative">
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          variant="danger"
          onClick={toggleVisibility}
          className="position-absolute top-0 end-0 mt-4 me-4"
        >
          <Icon name="X" />
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
