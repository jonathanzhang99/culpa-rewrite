/**
 * This file contains all of the input components that can be used with
 * the custom Form component. All components use Semantic UI React and
 * are compatible with react-hook-forms.
 *
 * Many of the prop types are duplicated on purpose in order to give a
 * consistent description of the props that each component accepts.
 *
 * NOTE: These components are NOT generic components. Only a selection
 * of the usable props are passed down to the base Semantic components
 * in order to limit the freedom and chance of breaking changes. If
 * you need additional functionality you will need to pass those props
 * down.
 *
 * NOTE: onChange is passed from Form component via the react-hook-form
 * controller. You should never directly pass in the onChange prop.
 */
/* eslint-disable react/jsx-props-no-spreading */
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import React, { useReducer, useState } from "react";
import {
  Form as SemanticForm,
  Button,
  Input,
  TextArea,
  Search,
  Dropdown,
  Radio,
  Modal,
} from "semantic-ui-react";

import { FormGroup } from "components/common/Form";

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
  width: PropTypes.number,
  onChange: PropTypes.func,
};

const defaultPropsInput = {
  error: undefined,
  id: "",
  label: "",
  width: undefined,
  onChange: () => {},
};

export function TextInput({ error, id, label, name, width, onChange }) {
  return (
    <SemanticForm.Field
      aria-label={label}
      control={Input}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      type="text"
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
  width: PropTypes.number,
  onChange: PropTypes.func,
  rows: PropTypes.number,
};

const defaultPropsTextAreaInput = {
  error: undefined,
  id: "",
  label: "",
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
}) {
  return (
    <SemanticForm.Field
      aria-label={label}
      control={TextArea}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      rows={rows}
      width={width}
      onChange={onChange}
    />
  );
}

const propTypesDropdown = {
  disabled: PropTypes.bool,
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
};

const defaultPropsDropdown = {
  disabled: false,
  options: [],
  placeholder: undefined,
  error: undefined,
  id: "",
  label: "",
  width: undefined,
  onChange: () => {},
};
export function DropdownInput({
  disabled,
  name,
  label,
  error,
  id,
  width,
  options,
  placeholder,
  onChange,
}) {
  return (
    <SemanticForm.Field
      search
      selection
      aria-label={label}
      control={Dropdown}
      disabled={disabled}
      error={error}
      id={getId(id, name)}
      label={label}
      name={name}
      options={options}
      placeholder={placeholder}
      width={width}
      onChange={(e, { value }) => onChange(value)}
    />
  );
}

const propTypesRadioInputGroup = {
  name: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.any,
    })
  ).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultPropsRadioInputGroup = {
  onChange: () => {},
  value: undefined,
};

export function RadioInputGroup({ name, labels, onChange, value }) {
  const radioButtons = labels.map(({ label, key }) => {
    return (
      <SemanticForm.Field
        checked={value === key}
        control={Radio}
        id={`${name}-radio-button-${key}`}
        key={label}
        label={label}
        name={name}
        type="radio"
        value={key}
        onChange={(e, { value: checkedValue }) => onChange(checkedValue)}
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
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  searchEntity: PropTypes.oneOf(["all", "professors", "courses"]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  width: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onResultSelect: PropTypes.func,
  onSearchChange: PropTypes.func,
};

const defaultPropsSearchInput = {
  error: undefined,
  id: undefined,
  label: undefined,
  searchEntity: "all",
  onChange: () => {},
  onBlur: () => {},
  onResultSelect: () => {},
  onSearchChange: () => {},
  value: "",
  width: undefined,
};

/**
 * Search bar with autocompletion that receives onChange, onBlur, value from
 * react-hook-forms.
 *
 * onSearchChange: (value) => void
 */
export function SearchInput({
  error,
  id,
  label,
  name,
  searchEntity,
  value,
  width,
  onChange,
  onBlur,
  onResultSelect,
  onSearchChange,
}) {
  const initialState = {
    isLoading: false,
    results: [],
  };
  const [{ isLoading, results }, dispatch] = useReducer(
    searchReducer,
    initialState
  );

  const noResultsMessage = `No ${
    searchEntity === "all" ? "results" : searchEntity
  } found`;

  const handleResultSelect = (e, { result }) => {
    onChange(result);
    onResultSelect(result);
  };

  const handleSearchChange = async (e, { value: searchValue }) => {
    onChange(e);
    onSearchChange(searchValue);

    if (searchValue.length < 2) {
      return dispatch({ type: "SEARCH_RESET" });
    }

    dispatch({ type: "SEARCH_START" });
    const response = await fetch(
      `/api/search?searchEntity=${searchEntity}&query=${searchValue}`,
      {
        method: "GET",
        headers: { "Content-Type": "Application/json" },
      }
    );

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
    <SemanticForm.Field
      control={Search}
      error={error}
      id={getId(id, name)}
      label={label}
      loading={isLoading}
      name={name}
      noResultsMessage={noResultsMessage}
      results={results}
      value={value?.title || value}
      width={width}
      onBlur={onBlur}
      onResultSelect={handleResultSelect}
      onSearchChange={debounce(handleSearchChange, 300, { leading: true })}
    />
  );
}

export function Submit(props) {
  return (
    <Button name="submit" type="submit" {...props}>
      SUBMIT
    </Button>
  );
}

const propTypesSubmitConfirm = {
  trigger: PropTypes.func,
  handleSubmit: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const defaultPropsSubmitConfirm = {
  trigger: () => {},
  handleSubmit: () => {},
  content: "",
  header: "",
};

export function SubmitConfirm({ trigger, handleSubmit, content, header }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openConfirm = async () => {
    if (!confirmOpen) {
      const validated = await trigger();
      if (validated) setConfirmOpen(true);
    }
  };

  const closeConfirm = () => setConfirmOpen(false);

  return (
    <>
      <Button name="confirmModal" type="button" onClick={openConfirm}>
        SUBMIT
      </Button>
      <Modal open={confirmOpen} onClose={closeConfirm} onOpen={openConfirm}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Modal.Description>{content}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          {/* TODO: Currently gives no options to specify custom buttons/text */}
          <Button onClick={closeConfirm}>Edit Review</Button>
          <Submit onClick={handleSubmit} />
        </Modal.Actions>
      </Modal>
    </>
  );
}

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

SearchInput.propTypes = propTypesSearchInput;
SearchInput.defaultProps = defaultPropsSearchInput;

SubmitConfirm.propTypes = propTypesSubmitConfirm;
SubmitConfirm.defaultProps = defaultPropsSubmitConfirm;
