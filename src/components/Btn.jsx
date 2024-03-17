import React from "react";
import Button from "react-bootstrap/Button";

const Btn = ({
  text,
  name,
  className: iconClassName,
  onClick: handleClick,
}) => (
  <Button
    className="button"
    variant="outline-secondary"
    onClick={handleClick}
    name={name}
  >
    <span>{text}</span>
    {iconClassName && <i className={iconClassName}></i>}
  </Button>
);

export default Btn;
