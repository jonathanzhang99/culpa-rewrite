/* eslint-disable react/jsx-props-no-spreading */
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import React, { useReducer } from "react";
import {
  Form as SemanticForm,
  Button,
  Input,
  TextArea,
  Search,
} from "semantic-ui-react";

import { FormGroup } from "components/common/Form";

const propTypesInputField = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  type: PropTypes.string,
  id: PropTypes.string,
};

const defaultPropsInputField = {
  label: "",
  error: undefined,
  type: undefined,
  id: undefined,
};

/**
 * Wrapper around Form Field from Semantic UI to allow us to easily manipulate the underlying
 * form logic.
 *
 */
function InputField({ name, error, label, type, id, ...rest }) {
  const inputId = id || `form-input-${name}`;
  return (
    <SemanticForm.Field
      aria-label={label}
      error={error}
      id={inputId}
      label={label}
      name={name}
      type={type}
      {...rest}
    />
  );
}

const propTypesText = {
  name: PropTypes.string.isRequired,
};

export function TextInput({ name, ...rest }) {
  return <InputField control={Input} name={name} type="text" {...rest} />;
}

export function PasswordInput({ name, ...rest }) {
  return <InputField control={Input} name={name} type="password" {...rest} />;
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
        control={Input}
        id={`${name}-radio-button-${key}`}
        key={`form-input-${key}`}
        label={label}
        name={name}
        type="radio"
        value={`test-${key}`}
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

function searchReducer(state, action) {
  switch (action.type) {
    case "SEARCH_START": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "SEARCH_SUCCESS": {
      return {
        isLoading: false,
        results: action.payload,
      };
    }
    case "SEARCH_RESET": {
      return {
        isLoading: false,
        results: [],
      };
    }
    case "SEARCH_ERROR": {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      throw new Error();
  }
}

const propTypesSearchInput = {
  name: PropTypes.string.isRequired,
  searchEntity: PropTypes.oneOf(["all", "professors", "courses"]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onResultSelect: PropTypes.func,
  value: PropTypes.string,
};

const defaultPropsSearchInput = {
  searchEntity: "all",
  onChange: () => {},
  onBlur: () => {},
  onResultSelect: () => {},
  value: "",
};

/**
 * Search bar with autocompletion that receives onChange, onBlur, value from
 * react-hook-forms.
 *
 */
export function SearchInput({
  name,
  searchEntity,
  onChange,
  onBlur,
  onResultSelect,
  value,
  ...rest
}) {
  const initialState = {
    isLoading: false,
    results: [],
  };
  const [{ isLoading, results }, dispatch] = useReducer(
    searchReducer,
    initialState
  );

  const handleResultSelect = (e, { result }) => {
    onChange(e);
    onResultSelect(result);
  };

  const handleSearchChange = async (e, { value: searchValue }) => {
    onChange(e);

    if (searchValue.length < 2) {
      return dispatch({ type: "SEARCH_RESET" });
    }

    dispatch({ type: "SEARCH_START" });
    const response = await fetch(`/api/search/`, {
      method: "POST",
      body: JSON.stringify({ query: searchValue, entity: searchEntity }),
      headers: { "Content-Type": "Application/json" },
    });

    try {
      const result = await response.json();

      if (response.ok) {
        dispatch({ type: "SEARCH_SUCCESS", payload: result.searchResults });
      }
    } catch (err) {
      dispatch({ type: "SEARCH_ERROR" });
    }
    return null;
  };

  return (
    <InputField
      control={Search}
      loading={isLoading}
      name={name}
      results={results}
      value={value}
      onBlur={onBlur}
      onResultSelect={handleResultSelect}
      onSearchChange={debounce(handleSearchChange, 300, { leading: true })}
      {...rest}
    />
  );
}

export function Submit(props) {
  return (
    <Button name="submit" type="submit" {...props}>
      Submit
    </Button>
  );
}

InputField.propTypes = propTypesInputField;
InputField.defaultProps = defaultPropsInputField;

TextInput.propTypes = propTypesText;
PasswordInput.propTypes = propTypesText;

RadioInputGroup.propTypes = propTypesRadioInputGroup;

SearchInput.propTypes = propTypesSearchInput;
SearchInput.defaultProps = defaultPropsSearchInput;
