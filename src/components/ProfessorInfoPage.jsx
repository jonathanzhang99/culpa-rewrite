import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const defaultProps = {
  courses: [],
};

const propTypesProfessorCourses = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseProfessorId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    }).isRequired
  ),
};

export function ProfessorCourseList({ courses }) {
  return (
    <>
      <span>Courses: </span>
      {courses.map(
        ({ courseProfessorId, courseName, courseCallNumber }, index) => {
          return (
            <span key={courseProfessorId}>
              <CourseDisplayLink
                courseCallNumber={courseCallNumber}
                courseId={courseProfessorId}
                courseName={courseName}
              />
              {index !== courses.length - 1 ? ", " : ""}
            </span>
          );
        }
      )}
    </>
  );
}

const propTypesReviewProfessorButton = {
  professorId: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export function ReviewProfessorButton({ professorId, firstName, lastName }) {
  return (
    <CreateReviewButton color="yellow" professorId={professorId.toString()}>
      WRITE A REVIEW FOR {firstName} {lastName}
    </CreateReviewButton>
  );
}

const propTypesProfessorSummary = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseProfessorId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    }).isRequired
  ),
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

export function ProfessorSummary({
  courses,
  firstName,
  lastName,
  professorId,
}) {
  return (
    <>
      <ProfessorDisplayName
        as="header"
        firstName={firstName}
        lastName={lastName}
      />
      <Container>
        <ProfessorCourseList courses={courses} />
      </Container>
      <ReviewProfessorButton
        firstName={firstName}
        lastName={lastName}
        professorId={professorId}
      />
    </>
  );
}

export default function ProfessorInfoPage() {
  const { professorId } = useParams();
  const {
    data: { firstName, lastName, courses },
    isLoading,
    isError,
  } = useDataFetch(`/api/professor/${professorId}`, {
    firstName: "",
    lastName: "",
    courses: [],
  });
  // TODO: load and return Review Summary data here

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <ProfessorSummary
      courses={courses}
      firstName={firstName}
      lastName={lastName}
      professorId={Number(professorId)}
    />
  );
}

ProfessorCourseList.propTypes = propTypesProfessorCourses;
ProfessorCourseList.defaultProps = defaultProps;

ReviewProfessorButton.propTypes = propTypesReviewProfessorButton;

ProfessorSummary.propTypes = propTypesProfessorSummary;
ProfessorSummary.defaultProps = defaultProps;
