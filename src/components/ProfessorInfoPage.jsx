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

const propTypesProfessorCourseList = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseProfessorId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export function ProfessorCourseList({ courses }) {
  return (
    <>
      <>Courses: </>
      {courses.map(
        ({ courseProfessorId, courseName, courseCallNumber }, index) => {
          return (
            <React.Fragment key={courseProfessorId}>
              <CourseDisplayLink
                courseCallNumber={courseCallNumber}
                courseId={courseProfessorId}
                courseName={courseName}
              />
              {index !== courses.length - 1 ? ", " : ""}
            </React.Fragment>
          );
        }
      )}
    </>
  );
}

const propTypesReviewProfessorButton = {
  professorId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export function ReviewProfessorButton({ professorId, firstName, lastName }) {
  return (
    <CreateReviewButton color="yellow" professorId={professorId}>
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
  ).isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.string.isRequired,
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
      professorId={professorId}
    />
  );
}

ProfessorCourseList.propTypes = propTypesProfessorCourseList;
ReviewProfessorButton.propTypes = propTypesReviewProfessorButton;
ProfessorSummary.propTypes = propTypesProfessorSummary;
