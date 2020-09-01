import PropTypes from "prop-types";
import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router-dom";
import { Divider, Grid, Header } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const propTypesSearchResults = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      childKey: PropTypes.string.isRequired,
      departments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["professor", "course"]).isRequired,
    })
  ).isRequired,
};

function SearchResults({ results }) {
  if (!results.length) return <p> No result found </p>;
  return (
    <Grid>
      {results.map(({ childKey, departments, id, title, type }) => (
        <Grid.Row key={childKey}>
          <Grid.Column width={6}>
            {type === "professor" ? (
              <ProfessorDisplayLink fullName={title} professorId={id} />
            ) : (
              <CourseDisplayLink courseId={id} courseName={title} />
            )}
          </Grid.Column>
          <Grid.Column width={10}>
            {departments.map(({ id: departmentId, name }, index) => (
              <span key={`department-${departmentId}`}>
                <DepartmentDisplayLink
                  departmentId={departmentId}
                  departmentName={name}
                />
                {index !== departments.length - 1 ? "," : ""}
              </span>
            ))}
          </Grid.Column>
        </Grid.Row>
      ))}
    </Grid>
  );
}

export default function SearchResultsPage() {
  const { search } = useLocation();

  const {
    data: { professorResults, courseResults },
    isLoading,
    isError,
  } = useDataFetch(`/api/search${search}`, {
    professorResults: [],
    courseResults: [],
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  const { query } = queryString.parse(search);

  return (
    <>
      <Header>
        Showing search results for <em> {query} </em>
      </Header>
      <Divider />
      <Header> Professors </Header>
      <SearchResults results={professorResults} />
      <Header> Courses </Header>
      <SearchResults results={courseResults} />
    </>
  );
}

SearchResults.propTypes = propTypesSearchResults;
