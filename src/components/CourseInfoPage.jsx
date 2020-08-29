import PropTypes from "prop-types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Icon, Accordion, Grid, Container } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const MAX_NUM_PROFESSORS_IN_LIST = 5;

const defaultProps = {
  courseProfessors: [],
};

const propTypesCourseProfessors = {
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ),
};

export function ProfessorsList({ courseProfessors }) {
  return (
    <>
      <>Professors: </>
      {courseProfessors.map(({ firstName, lastName, professorId }, index) => {
        return (
          <React.Fragment key={professorId}>
            <ProfessorDisplayLink
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
            />
            {index !== courseProfessors.length - 1 ? ", " : ""}
          </React.Fragment>
        );
      })}
    </>
  );
}

const propTypesProfessorsAccordion = {
  isAccordionActive: PropTypes.bool.isRequired,
  setAccordionActive: PropTypes.func.isRequired,
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ),
};

export function ProfessorsAccordion({
  isAccordionActive,
  setAccordionActive,
  courseProfessors,
}) {
  return (
    <Accordion>
      <Accordion.Title
        active={isAccordionActive}
        onClick={() => setAccordionActive(!isAccordionActive)}
      >
        <Icon name={!isAccordionActive ? "angle down" : "angle up"} />
        <>
          {!isAccordionActive ? "Show" : "Hide"} all professors who teach this
          course
        </>
      </Accordion.Title>
      <Accordion.Content active={isAccordionActive}>
        <CourseProfessorsGrid courseProfessors={courseProfessors} />
      </Accordion.Content>
    </Accordion>
  );
}

export function ProfessorsComponent({
  isAccordionActive,
  setAccordionActive,
  courseProfessors,
}) {
  return courseProfessors.length > MAX_NUM_PROFESSORS_IN_LIST ? (
    <ProfessorsAccordion
      courseProfessors={courseProfessors}
      isAccordionActive={isAccordionActive}
      setAccordionActive={setAccordionActive}
    />
  ) : (
    <ProfessorsList courseProfessors={courseProfessors} />
  );
}

const propTypesProfessorDepartmentColumn = {
  professorId: PropTypes.number.isRequired,
  professorDepartments: PropTypes.arrayOf(
    PropTypes.shape({
      professorDepartmentId: PropTypes.number.isRequired,
      professorDepartmentName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export function ProfessorDepartmentColumn({
  professorId,
  professorDepartments,
}) {
  return (
    <Grid.Column key={`${professorId}_departments`}>
      {professorDepartments.map(
        ({ professorDepartmentId, professorDepartmentName }, index) => {
          return (
            <React.Fragment key={professorDepartmentName}>
              <DepartmentDisplayLink
                departmentId={professorDepartmentId}
                departmentName={professorDepartmentName}
              />
              {professorDepartments.length - 1 !== index ? ", " : ""}
            </React.Fragment>
          );
        }
      )}
    </Grid.Column>
  );
}

export function CourseProfessorsGrid({ courseProfessors }) {
  return (
    <Grid columns={2}>
      {courseProfessors.map(
        ({ firstName, lastName, professorId, professorDepartments }) => {
          return (
            <Grid.Row key={`${professorId}_row`}>
              <Grid.Column key={`${professorId}_link`}>
                <ProfessorDisplayLink
                  firstName={firstName}
                  lastName={lastName}
                  professorId={professorId}
                />
              </Grid.Column>
              <ProfessorDepartmentColumn
                professorDepartments={professorDepartments}
                professorId={professorId}
              />
            </Grid.Row>
          );
        }
      )}
    </Grid>
  );
}

const propTypesReviewCourseButton = {
  courseId: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
};

export function ReviewCourseButton({ courseId, courseName }) {
  return (
    <CreateReviewButton color="yellow" courseId={courseId}>
      WRITE A REVIEW FOR {courseName}
    </CreateReviewButton>
  );
}

const propTypesCourseSummary = {
  courseId: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  courseCallNumber: PropTypes.string.isRequired,
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ),
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
    <>
      <CourseDisplayName
        as="header"
        courseCallNumber={courseCallNumber}
        courseName={courseName}
      />
      <Container>
        <Container>
          <>Department: </>
          <DepartmentDisplayLink
            departmentId={departmentId}
            departmentName={departmentName}
          />
        </Container>
        <ProfessorsComponent
          courseProfessors={courseProfessors}
          isAccordionActive={isAccordionActive}
          setAccordionActive={setAccordionActive}
        />
      </Container>
      <ReviewCourseButton courseId={courseId} courseName={courseName} />
    </>
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
ProfessorsList.propTypes = propTypesCourseProfessors;
ProfessorsList.defaultProps = defaultProps;
ProfessorsAccordion.propTypes = propTypesProfessorsAccordion;
ProfessorsAccordion.defaultProps = defaultProps;
ProfessorsComponent.propTypes = propTypesProfessorsAccordion;
ProfessorsComponent.defaultProps = defaultProps;
CourseProfessorsGrid.propTypes = propTypesCourseProfessors;
CourseProfessorsGrid.defaultProps = defaultProps;
ProfessorDepartmentColumn.propTypes = propTypesProfessorDepartmentColumn;
ReviewCourseButton.propTypes = propTypesReviewCourseButton;
CourseSummary.propTypes = propTypesCourseSummary;
CourseSummary.defaultProps = defaultProps;
