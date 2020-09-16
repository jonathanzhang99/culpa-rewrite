import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import React, { useCallback, useReducer } from "react";
import { Form as SemanticForm, Grid, Search } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import { DepartmentDisplayName } from "components/common/DepartmentDisplay";
import { SEARCH_INPUT_ADD_ENTITY_ID } from "components/common/Inputs";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";

const SEARCH_START = "SEARCH_START";
const SEARCH_SUCCESS = "SEARCH_SUCCESS";
const SEARCH_RESET = "SEARCH_RESET";
const SEARCH_ERROR = "SEARCH_ERROR";
const RESULT_SELECTED = "RESULT_SELECTED";
const RESULT_UNSELECTED = "RESULT_UNSELECTED";

function getId(id, name) {
  return id || `form-input-${name}`;
}

function searchReducer(state, action) {
  switch (action.type) {
    case SEARCH_START: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case SEARCH_SUCCESS: {
      return {
        isLoading: false,
        results: action.payload,
      };
    }
    case SEARCH_RESET: {
      return {
        isLoading: false,
        results: [],
      };
    }
    case SEARCH_ERROR: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case RESULT_SELECTED: {
      return {
        ...state,
        resultSelected: true,
      };
    }
    case RESULT_UNSELECTED: {
      return {
        ...state,
        resultSelected: false,
      };
    }
    default:
      throw new Error();
  }
}

const propTypesTextResult = {
  title: PropTypes.string.isRequired,
};

function TextResult({ title }) {
  return (
    <Grid>
      <Grid.Column>{title}</Grid.Column>
    </Grid>
  );
}

const propTypesSearchResult = {
  badges: PropTypes.arrayOf(PropTypes.number),
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  last: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["professor", "course"]).isRequired,
};

const defaultPropsSearchResult = {
  badges: [],
  last: undefined,
};

function SearchResult({ badges, departments, last, title, type }) {
  return (
    <Grid className={last && "last-divider"} columns={2}>
      <Grid.Column>
        {type === "professor" ? (
          <ProfessorDisplayName badges={badges} fullName={title} />
        ) : (
          <CourseDisplayName courseName={title} />
        )}
      </Grid.Column>
      <Grid.Column>
        {departments.map(({ id: departmentId, name }, index) => (
          <span key={`department-${departmentId}`}>
            <DepartmentDisplayName departmentName={name} />
            {index !== departments.length - 1 ? "," : ""}
          </span>
        ))}
      </Grid.Column>
    </Grid>
  );
}

function searchResultRenderer({ badges, departments, last, title, type }) {
  if (type === "text") return <TextResult title={title} />;
  return (
    <SearchResult
      badges={badges}
      departments={departments}
      last={last}
      title={title}
      type={type}
    />
  );
}

const propTypesSearchInput = {
  // addnewEntity only allowed when searchEntity is specified as either professor
  // or course
  addNewEntity: (props, propName, componentName) => {
    const { searchEntity, [propName]: prop } = props;
    if (prop && searchEntity === "all") {
      return new Error(
        `Invalid prop ${propName} passed to ${componentName}
           when searchEntity is not 'professor' or 'course'.
          `
      );
    }
    return null;
  },
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  searchEntity: PropTypes.oneOf(["all", "professor", "course"]),
  searchLimit: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  width: PropTypes.number,
  onChange: PropTypes.func,
  onResultSelect: PropTypes.func,
  onSearchChange: PropTypes.func,
};

const defaultPropsSearchInput = {
  addNewEntity: false,
  error: undefined,
  id: undefined,
  label: undefined,
  searchEntity: "all",
  searchLimit: undefined,
  onChange: () => {},
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
export default function SearchInput({
  addNewEntity,
  error,
  id,
  label,
  name,
  searchEntity,
  searchLimit,
  value,
  width,
  onChange,
  onResultSelect,
  onSearchChange,
}) {
  const initialState = {
    isLoading: false,
    results: [],
    resultSelected: false,
  };

  const [{ isLoading, results, resultSelected }, dispatch] = useReducer(
    searchReducer,
    initialState
  );

  const addEntityOption = {
    title: `No ${searchEntity}s found. Add new ${searchEntity}?`,
    type: "text",
    id: SEARCH_INPUT_ADD_ENTITY_ID,
  };

  const noResultsMessage = `No ${
    searchEntity === "all" ? "result" : searchEntity
  }s found`;

  const handleResultSelect = (e, { result }) => {
    const { title, id: resultId } = result;
    dispatch({ type: RESULT_SELECTED });
    onChange({ title, id: resultId });
    onResultSelect(result);
  };

  /**
   * useCallback memoizes a callback.
   * It ensures that only one debouncer is created for each SearchInput.
   */
  const debouncedFetch = useCallback(
    debounce(async (searchValue) => {
      dispatch({ type: SEARCH_START });
      const response = await fetch(
        `/api/search?entity=${searchEntity}&query=${searchValue}&limit=${searchLimit}`,
        {
          method: "GET",
          headers: { "Content-Type": "Application/json" },
        }
      );

      try {
        const { professorResults, courseResults } = await response.json();
        const searchResults = [...professorResults, ...courseResults];
        if (!searchResults.length && addNewEntity) {
          searchResults.push(addEntityOption);
        }
        if (response.ok) {
          dispatch({
            type: SEARCH_SUCCESS,
            payload: searchResults,
          });
        }
      } catch (err) {
        dispatch({ type: SEARCH_ERROR });
      }
    }, 200),
    [] // no condition to reset this debouncer
  );

  const handleSearchChange = async (e, { value: initialSearchValue }) => {
    let searchValue = initialSearchValue;

    // resets the search bar after an option select by selecting only the last character
    if (resultSelected) {
      dispatch({ type: RESULT_UNSELECTED });
      searchValue = initialSearchValue.slice(-1);
    }

    onChange(searchValue);
    onSearchChange(searchValue);

    if (searchValue.length < 2) {
      return dispatch({ type: SEARCH_RESET });
    }

    debouncedFetch(searchValue);
    return null;
  };

  return (
    <SemanticForm.Field
      fluid
      control={Search}
      error={error}
      id={getId(id, name)}
      label={label}
      loading={isLoading}
      name={name}
      noResultsMessage={noResultsMessage}
      resultRenderer={searchResultRenderer}
      results={results}
      value={value?.title || value}
      width={width}
      onResultSelect={handleResultSelect}
      onSearchChange={handleSearchChange}
    />
  );
}

SearchResult.propTypes = propTypesSearchResult;
SearchResult.defaultProps = defaultPropsSearchResult;

TextResult.propTypes = propTypesTextResult;

searchResultRenderer.propTypes = propTypesSearchResult;
searchResultRenderer.defaultProps = defaultPropsSearchResult;

SearchInput.propTypes = propTypesSearchInput;
SearchInput.defaultProps = defaultPropsSearchInput;
