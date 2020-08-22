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
      title: PropTypes.string,
      professorid: PropTypes.number,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      departments: PropTypes.arrayOf(
        PropTypes.shape({
          departmentid: PropTypes.number,
          departmentname: PropTypes.string,
        })
      ),
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
          {professors.map(
            ({ professorid, firstname, lastname, badge, departments }) => (
              <Grid.Row key={`professor-${professorid}`}>
                <Grid.Column width={6}>
                  <ProfessorDisplayLink
                    firstName={firstname}
                    lastName={lastname}
                    professorId={professorid}
                  />
                  [{badge}]
                </Grid.Column>
                <Grid.Column width={10}>
                  {departments.map(({ departmentid, departmentname }) => (
                    <DepartmentDisplayLink
                      departmentId={departmentid}
                      departmentName={departmentname}
                      key={`department-${departmentid}`}
                    />
                  ))}
                </Grid.Column>
              </Grid.Row>
            )
          )}
        </Grid>
      )}
    </>
  );
}

const propTypesCourseResults = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseid: PropTypes.number,
      coursename: PropTypes.string,
      departmentid: PropTypes.number,
      departmentname: PropTypes.string,
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
          {courses.map(
            ({ courseid, coursename, departmentid, departmentname }) => (
              <Grid.Row key={`course-${courseid}`}>
                <Grid.Column width={6}>
                  <CourseDisplayLink
                    courseId={courseid}
                    courseName={coursename}
                  />
                </Grid.Column>
                <Grid.Column width={10}>
                  <DepartmentDisplayLink
                    departmentId={departmentid}
                    departmentName={departmentname}
                  />
                </Grid.Column>
              </Grid.Row>
            )
          )}
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

  const queryParams = queryString.parse(search);

  return (
    <>
      <Header>
        Showing search results for <em> {queryParams.query} </em>
      </Header>
      <ProfessorResults professors={professorResults} />
      <CourseResults courses={courseResults} />
    </>
  );
}

ProfessorResults.propTypes = propTypesProfessorResults;

CourseResults.propTypes = propTypesCourseResults;
