import PropTypes from "prop-types";
import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const propTypesProfessorResults = {
  professors: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      departments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

function ProfessorResults({ professors }) {
  return (
    <>
      <Header> Courses </Header>
      {professors.length === 0 ? (
        <p> No professor found </p>
      ) : (
        <Grid>
          {professors.map(({ id, badge, departments, title }) => (
            <Grid.Row key={`professor-${id}`}>
              <Grid.Column width={6}>
                <ProfessorDisplayLink fullName={title} professorId={id} />[
                {badge}]
              </Grid.Column>
              <Grid.Column width={10}>
                {
                  // eslint-disable-next-line no-shadow
                  departments.map(({ id, name }) => (
                    <DepartmentDisplayLink
                      departmentId={id}
                      departmentName={name}
                      key={`department-${id}`}
                    />
                  ))
                }
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      )}
    </>
  );
}

const propTypesCourseResults = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      department: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

function CourseResults({ courses }) {
  return (
    <>
      <Header> Professors </Header>
      {courses.length === 0 ? (
        <p> No course found </p>
      ) : (
        <Grid>
          {courses.map(({ id, name, department }) => (
            <Grid.Row key={`course-${id}`}>
              <Grid.Column width={6}>
                <CourseDisplayLink courseId={id} courseName={name} />
              </Grid.Column>
              <Grid.Column width={10}>
                <DepartmentDisplayLink
                  departmentId={department.id}
                  departmentName={department.name}
                />
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      )}
    </>
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

  const { searchValue } = queryString.parse(search);

  return (
    <>
      <Header>
        Showing search results for <em> {searchValue} </em>
      </Header>
      <ProfessorResults professors={professorResults} />
      <CourseResults courses={courseResults} />
    </>
  );
}

ProfessorResults.propTypes = propTypesProfessorResults;

CourseResults.propTypes = propTypesCourseResults;
