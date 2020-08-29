import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import { DepartmentDisplayName } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const defaultPropsDepartmentCourses = {
  departmentCourses: [],
}

const propTypesDepartmentCourses = {
  departmentCourses: PropTypes.arrayOf(
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
    }).isRequired
  ),
};

export function DepartmentCourseColumn({ departmentCourses }) {
  return (
    <Grid.Column>
      <Grid.Row key="courses">
        <Header>Courses</Header>
      </Grid.Row>
      {departmentCourses.map(({ courseId, courseName }) => {
        return (
          <Grid.Row key={`course_${courseId}`}>
            <CourseDisplayLink courseId={courseId} courseName={courseName} />
          </Grid.Row>
        );
      })}
    </Grid.Column>
  );
}

const defaultPropsDepartmentProfessors = {
  departmentProfessors: [],
}

const propTypesDepartmentProfessors = {
  departmentProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      professorId: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired
  ),
};

export function DepartmentProfessorColumn({ departmentProfessors }) {
  return (
    <Grid.Column>
      <Grid.Row key="professors">
        <Header>Professors</Header>
      </Grid.Row>
      {departmentProfessors.map(({ professorId, firstName, lastName }) => {
        return (
          <Grid.Row key={`professor_${professorId}`}>
            <ProfessorDisplayLink
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
            />
          </Grid.Row>
        );
      })}
    </Grid.Column>
  );
}

const defaultPropsDepartmentInfo = {
  departmentCourses: [],
  departmentProfessors: [],
}

const propTypesDepartmentInfo = {
  departmentName: PropTypes.string.isRequired,
  departmentCourses: PropTypes.arrayOf(
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
    }).isRequired
  ),
  departmentProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      professorId: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired
  ),
};

export function DepartmentInfo({
  departmentCourses,
  departmentName,
  departmentProfessors,
}) {
  return (
    <>
      <DepartmentDisplayName as="header" departmentName={departmentName} />
      <Grid columns={2}>
        <DepartmentCourseColumn departmentCourses={departmentCourses} />
        <DepartmentProfessorColumn
          departmentProfessors={departmentProfessors}
        />
      </Grid>
    </>
  );
}

export default function DepartmentInfoPage() {
  const { departmentId } = useParams();
  const {
    data: { departmentName, departmentCourses, departmentProfessors },
    isLoading,
    isError,
  } = useDataFetch(`/api/department/${departmentId}`, {
    departmentName: "",
    departmentCourses: [],
    departmentProfessors: [],
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <DepartmentInfo
      departmentCourses={departmentCourses}
      departmentName={departmentName}
      departmentProfessors={departmentProfessors}
    />
  );
}

DepartmentCourseColumn.propTypes = propTypesDepartmentCourses;
DepartmentCourseColumn.defaultProps = defaultPropsDepartmentCourses;
DepartmentProfessorColumn.propTypes = propTypesDepartmentProfessors;
DepartmentProfessorColumn.defaultProps = defaultPropsDepartmentProfessors;
DepartmentInfo.propTypes = propTypesDepartmentInfo;
DepartmentInfo.defaultProps = defaultPropsDepartmentInfo;
