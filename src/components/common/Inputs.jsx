/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";

const propTypesInput = {
  register: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: PropTypes.objectOf(PropTypes.any),
};

const defaultPropsInput = {
  required: {},
  register: () => {},
};

export function Input({ name, register, required, ...rest }) {
  return (
    <input type="text" name={name} ref={register({ required })} {...rest} />
  );
}

const propTypesSubmit = {
  register: PropTypes.func,
  value: PropTypes.string.isRequired,
};

const defaultPropsSubmit = {
  register: () => {},
};

export function Submit({ register, value, ...rest }) {
  return (
    <input type="submit" name="submit" ref={register} value={value} {...rest} />
  );
}

Input.propTypes = propTypesInput;
Input.defaultProps = defaultPropsInput;

Submit.propTypes = propTypesSubmit;
Submit.defaultProps = defaultPropsSubmit;
