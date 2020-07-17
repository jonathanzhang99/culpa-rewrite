/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import {
  Form as SemanticForm,
  Button,
  Input,
  TextArea,
} from "semantic-ui-react";

import { FormGroup } from "components/common/Form";

const propTypesInputField = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  type: PropTypes.string,
};

const defaultPropsInputField = {
  label: "",
  error: undefined,
  type: undefined,
};

/**
 * Wrapper around Form Field from Semantic UI to allow us to easily manipulate the underlying
 * form logic.
 *
 */
function InputField({ name, error, label, type, ...rest }) {
  return (
    <SemanticForm.Field
      id={`form-input-${name}`}
      label={label}
      aria-label={label}
      name={name}
      error={error}
      type={type}
      {...rest}
    />
  );
}

const propTypesText = {
  name: PropTypes.string.isRequired,
};

export function TextInput({ name, ...rest }) {
  return <InputField type="text" control={Input} name={name} {...rest} />;
}

export function PasswordInput({ name, ...rest }) {
  return <InputField type="password" control={Input} name={name} {...rest} />;
}

export function TextAreaInput(props) {
  return <InputField control={TextArea} {...props} />;
}

const propTypesRadioInputGroup = {
  name: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.any,
    })
  ).isRequired,
};

export function RadioInputGroup({ name, labels, ...rest }) {
  const radioButtons = labels.map(({ label, key }) => {
    return (
      <InputField
        value={key}
        key={key}
        control={Input}
        name={name}
        label={label}
        type="radio"
        {...rest}
      />
    );
  });
  return (
    <FormGroup inline unstackable widths="equal">
      {radioButtons}
    </FormGroup>
  );
}

export function Submit(props) {
  return (
    <Button type="submit" name="submit" {...props}>
      Submit
    </Button>
  );
}

InputField.propTypes = propTypesInputField;
InputField.defaultProps = defaultPropsInputField;

TextInput.propTypes = propTypesText;
PasswordInput.propTypes = propTypesText;

RadioInputGroup.propTypes = propTypesRadioInputGroup;
