import PropTypes from "prop-types";
import React, { useState } from "react";
import { Accordion, Table } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";

const propTypes = {
  courseId: PropTypes.number.isRequired,
  courseSummary: PropTypes.shape({
    courseName: PropTypes.string.isRequired,
    departmentName: PropTypes.string.isRequired,
    associatedProfessors: PropTypes.array.isRequired,
  }).isRequired,
};

export default function CourseSummary({ courseId, courseSummary }) {
  return (
    <div>
      <CourseHeader courseId={courseId} courseSummary={courseSummary} />
      <ReviewSummary />
    </div>
  );
}

function CourseHeader({ courseId, courseSummary }) {
  const [isActive, setActive] = useState(false);
  const { courseName, departmentName, associatedProfessors } = courseSummary;

  return (
    <div>
      <h1>
        <CourseDisplayName code="COURSE_CODE" name={courseName} />
      </h1>
      <h3>Department: {departmentName}</h3>

      <h3>
        Professors:{" "}
        {associatedProfessors.map((professor, index) => {
          const { firstName, lastName, professorId } = professor;
          return (
            <p>
              <span>
                <ProfessorDisplayLink
                  as="h3"
                  firstName={firstName}
                  lastName={lastName}
                  professorId={professorId}
                />{" "}
                {associatedProfessors.length - 1 !== index ? ", " : ""}
              </span>
            </p>
          );
        })}
      </h3>

      <Accordion>
        <Accordion.Title
          active={isActive}
          as="h3"
          onClick={() => setActive(!isActive)}
        >
          Show all professors who teach this course
        </Accordion.Title>
        <Accordion.Content active={isActive}>
          {associatedProfessors.map((professor) => {
            const {
              firstName,
              lastName,
              professorId,
              profDepartments,
            } = professor;
            return (
              <Table>
                <Table.Row>
                  <ProfessorDisplayLink
                    as="h1"
                    firstName={firstName}
                    lastName={lastName}
                    professorId={professorId}
                  />
                </Table.Row>
                <Table.Row>
                  {profDepartments.map((department, index) => {
                    const { profDepartmentId, profDepartmentName } = department;
                    return (
                      <text>
                        {profDepartmentId}: {profDepartmentName}
                        {profDepartments.length - 1 !== index ? ", " : ""}
                      </text>
                    );
                  })}
                </Table.Row>
              </Table>
            );
          })}
          Content
        </Accordion.Content>
      </Accordion>

      <CreateReviewButton compact color="yellow" courseId={courseId}>
        WRITE A REVIEW FOR {courseName}
      </CreateReviewButton>
    </div>
  );
}

function ReviewSummary() {
  return "Review Summary here";
}

CourseSummary.propTypes = propTypes;
CourseHeader.propTypes = propTypes;
