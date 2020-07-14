/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { Form, Button } from "semantic-ui-react";

const propTypesBaseInput = {
  register: PropTypes.func,
  name: PropTypes.string.isRequired,
  requiredOptions: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.oneOf(["password", "text"]).isRequired,
  ariaLabel: PropTypes.string,
};

const defaultPropsBaseInput = {
  requiredOptions: {},
  register: () => {},
  ariaLabel: "",
};

function BaseInput({
  name,
  register,
  requiredOptions,
  ariaLabel,
  type,
  ...rest
}) {
  return (
    <input
      type={type}
      name={name}
      aria-label={ariaLabel}
      ref={register(requiredOptions)}
      {...rest}
    />
  );
}

const propTypesInputField = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

const defaultPropsInputField = {
  label: "",
  error: undefined,
};

/**
 * Wrapper around Form Field from Semantic UI to allow us to easily manipulate the underlying
 * form logic.
 *
 */
function InputField({ name, error, label, ...rest }) {
  return (
    <Form.Field
      id={`form-input-${name}`}
      control={BaseInput}
      label={label}
      ariaLabel={label}
      name={name}
      error={error}
      {...rest}
    />
  );
}

export function TextInput(props) {
  return <InputField type="text" {...props} />;
}

export function PasswordInput(props) {
  return <InputField type="password" {...props} />;
}

const propTypesSubmit = {
  register: PropTypes.func,
};

const defaultPropsSubmit = {
  register: () => {},
};

export function Submit({ register, ...rest }) {
  return (
    <Button type="submit" name="submit" {...rest}>
      Submit
    </Button>
  );
}

BaseInput.propTypes = propTypesBaseInput;
BaseInput.defaultProps = defaultPropsBaseInput;

InputField.propTypes = propTypesInputField;
InputField.defaultProps = defaultPropsInputField;

Submit.propTypes = propTypesSubmit;
Submit.defaultProps = defaultPropsSubmit;
