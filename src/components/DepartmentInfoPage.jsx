import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import { List } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import { DepartmentDisplayName } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const propTypes = {
  departmentName: PropTypes.string.isRequired,
  departmentCourses: PropTypes.arrayOf(
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  departmentProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      professorId: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export function DepartmentInfo({
  departmentCourses,
  departmentName,
  departmentProfessors,
}) {
  return (
    // TODO: Add styling into two columns with alphabetical sections
    <div>
      <DepartmentDisplayName as="header" departmentName={departmentName} />
      <List>
        {departmentCourses.map(({ courseId, courseName }) => {
          return (
            <List.Item key={courseId}>
              <CourseDisplayLink courseId={courseId} courseName={courseName} />
            </List.Item>
          );
        })}
      </List>
      <List>
        {departmentProfessors.map(({ professorId, firstName, lastName }) => {
          return (
            <List.Item key={professorId}>
              <ProfessorDisplayLink
                firstName={firstName}
                lastName={lastName}
                professorId={professorId}
              />
            </List.Item>
          );
        })}
      </List>
    </div>
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

DepartmentInfo.propTypes = propTypes;
