import PropTypes from "prop-types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Icon, Accordion, Table } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const propTypes = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  courseCallNumber: PropTypes.string.isRequired,
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      professorDepartmentId: PropTypes.number.isRequired,
      professorDepartmentName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export function CourseSummary({
  courseId,
  courseName,
  courseCallNumber,
  departmentId,
  departmentName,
  courseProfessors,
}) {
  const [isAccordionActive, setAccordionActive] = useState(false);
  return (
    <div>
      <div>
        <CourseDisplayName
          courseCallNumber={courseCallNumber}
          name={courseName}
        />
      </div>
      <div>
        <span>Department: </span>
        <DepartmentDisplayLink
          departmentId={departmentId}
          departmentName={departmentName}
        />
      </div>
      <div>
        <Accordion>
          <Accordion.Title
            active={isAccordionActive}
            onClick={() => setAccordionActive(!isAccordionActive)}
          >
            <Icon name={!isAccordionActive ? "angle down" : "angle up"} />
            <span>
              {!isAccordionActive ? "Show" : "Hide"} all professors who teach
              this course
            </span>
          </Accordion.Title>
          <Accordion.Content active={isAccordionActive}>
            <Table>
              <tbody>
                {/* Having <tbody> prevents browser bugs from inserting into the Table. */}
                {courseProfessors.map(
                  ({
                    firstName,
                    lastName,
                    professorId,
                    professorDepartments,
                  }) => {
                    return (
                      <Table.Row key={professorId}>
                        <Table.Cell key={`${professorId}_link`}>
                          <ProfessorDisplayLink
                            firstName={firstName}
                            lastName={lastName}
                            professorId={professorId}
                          />
                        </Table.Cell>
                        <Table.Cell key={`${professorId}_departments`}>
                          {professorDepartments.map(
                            (
                              {
                                professorDepartmentId,
                                professorDepartmentName,
                              },
                              index
                            ) => {
                              return (
                                <span>
                                  <DepartmentDisplayLink
                                    departmentId={professorDepartmentId}
                                    departmentName={professorDepartmentName}
                                  />
                                  {professorDepartments.length - 1 !== index
                                    ? ", "
                                    : ""}
                                </span>
                              );
                            }
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  }
                )}
              </tbody>
            </Table>
          </Accordion.Content>
        </Accordion>
      </div>
      <div>
        <CreateReviewButton color="yellow" courseId={courseId.toString()}>
          WRITE A REVIEW FOR {courseName}
        </CreateReviewButton>
      </div>
    </div>
  );
}

export default function CourseInfoPage() {
  const { courseId } = useParams();
  const {
    data: {
      courseName,
      courseCallNumber,
      departmentId,
      departmentName,
      courseProfessors,
    },
    isLoading,
    isError,
  } = useDataFetch(`/api/course/${courseId}`, {
    courseName: "",
    courseCallNumber: "",
    departmentId: 0,
    departmentName: "",
    courseProfessors: [],
  });
  // TODO: load and return Review Summary data here

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <CourseSummary
      courseCallNumber={courseCallNumber}
      courseId={courseId}
      courseName={courseName}
      courseProfessors={courseProfessors}
      departmentId={departmentId}
      departmentName={departmentName}
    />
  );
}

CourseSummary.propTypes = propTypes;
