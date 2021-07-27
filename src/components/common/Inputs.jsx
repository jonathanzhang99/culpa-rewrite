/**
 * This file contains all of the input components that can be used with
 * the custom Form component. All components use Semantic UI React and
 * are compatible with react-hook-forms.
 *
 * NOTE: These components are NOT generic components. Only a selection
 * of the usable props are passed down to the base Semantic components
 * in order to limit the freedom and chance of breaking changes. If
 * you need additional functionality you will need to pass those props
 * down.
 *
 * NOTE: Do not use these input components outside of a Form component.
 * There are no guarantees nor tests in the codebase to ensure that they
 * work properly. If you need an input component outside of a Form, use
 * the Semantic UI components directly. Example can be found in
 * ReviewSection.jsx
 *
 * NOTE: `onChange` and `value` are passed from Form component via the
 * react-hook-form controller. You should never directly pass these props.
 */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import {
  Form as SemanticForm,
  Input,
  TextArea,
  Dropdown,
  Radio,
} from "semantic-ui-react";

import { FormGroup } from "components/common/Form";
import SearchInputImport from "components/common/SearchInput";

export const SEARCH_INPUT_ADD_ENTITY_ID = -1;

function getId(id, name) {
  return id || `form-input-${name}`;
}

const propTypesInput = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  readOnly: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.string,
  width: PropTypes.number,
  onChange: PropTypes.func,
};

const defaultPropsInput = {
  error: undefined,
  id: "",
  label: "",
  readOnly: false,
  value: "",
  width: undefined,
  onChange: () => {},
};

export function TextInput({
  error,
  id,
  label,
  name,
  readOnly,
  value,
  width,
  onChange,
}) {
  return (
    <SemanticForm.Field
      aria-label={label}
      control={Input}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      readOnly={readOnly}
      type="text"
      value={value}
      width={width}
      onChange={onChange}
    />
  );
}

export function PasswordInput({ name, label, error, id, width, onChange }) {
  return (
    <SemanticForm.Field
      aria-label={label}
      control={Input}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      type="password"
      width={width}
      onChange={onChange}
    />
  );
}

const propTypesTextAreaInput = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  width: PropTypes.number,
  onChange: PropTypes.func,
  rows: PropTypes.number,
};

const defaultPropsTextAreaInput = {
  error: undefined,
  id: "",
  label: "",
  readOnly: false,
  value: "",
  width: undefined,
  onChange: () => {},
  rows: 3,
};

export function TextAreaInput({
  name,
  label,
  error,
  id,
  width,
  onChange,
  rows,
  readOnly,
  value,
}) {
  return (
    <SemanticForm.Field
      aria-label={label}
      control={TextArea}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      readOnly={readOnly}
      rows={rows}
      value={value}
      width={width}
      onChange={onChange}
    />
  );
}

const propTypesDropdown = {
  options: PropTypes.arrayOf(PropTypes.any),
  placeholder: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  onChange: PropTypes.func,
  onOptionSelect: PropTypes.func,
};

const defaultPropsDropdown = {
  options: [],
  placeholder: undefined,
  error: undefined,
  id: "",
  label: "",
  width: undefined,
  onChange: () => {},
  onOptionSelect: () => {},
};
export function DropdownInput({
  name,
  label,
  error,
  id,
  width,
  options,
  placeholder,
  onChange,
  onOptionSelect,
}) {
  return (
    <SemanticForm.Field
      search
      selection
      aria-label={label}
      control={Dropdown}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      options={options}
      placeholder={placeholder}
      width={width}
      onChange={(e, { value }) => {
        onChange(value);
        onOptionSelect(value);
      }}
    />
  );
}

const propTypesRadioInputGroup = {
  grouped: PropTypes.bool,
  name: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.any,
    })
  ).isRequired,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultPropsRadioInputGroup = {
  grouped: false,
  readOnly: false,
  onChange: () => {},
  value: undefined,
};

export function RadioInputGroup({
  grouped,
  name,
  labels,
  readOnly,
  onChange,
  value,
}) {
  const radioButtons = labels.map(({ label, key }) => {
    return (
      <SemanticForm.Field
        checked={value === key}
        control={Radio}
        id={`${name}-radio-button-${key}`}
        key={label}
        label={label}
        name={name}
        readOnly={readOnly}
        type="radio"
        value={key}
        onChange={(e, { value: checkedValue }) => onChange(checkedValue)}
      />
    );
  });
  return <FormGroup grouped={grouped}>{radioButtons}</FormGroup>;
}

export const SearchInput = SearchInputImport;

export const ValidInputComponents = [
  TextInput,
  PasswordInput,
  TextAreaInput,
  DropdownInput,
  RadioInputGroup,
  SearchInput,
];

TextInput.propTypes = propTypesInput;
TextInput.defaultProps = defaultPropsInput;

PasswordInput.propTypes = propTypesInput;
PasswordInput.defaultProps = defaultPropsInput;

TextAreaInput.propTypes = propTypesTextAreaInput;
TextAreaInput.defaultProps = defaultPropsTextAreaInput;

DropdownInput.propTypes = propTypesDropdown;
DropdownInput.defaultProps = defaultPropsDropdown;

RadioInputGroup.propTypes = propTypesRadioInputGroup;
RadioInputGroup.defaultProps = defaultPropsRadioInputGroup;
