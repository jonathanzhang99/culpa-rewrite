import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import { List } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const propTypes = {
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
    <div>
      <div>
        <ProfessorDisplayName
          as="header"
          firstName={firstName}
          lastName={lastName}
        />
      </div>
      <div>
        <List horizontal>
          <List.Item>Courses: </List.Item>
          {courses.map(
            ({ courseProfessorId, courseName, courseCallNumber }) => {
              return (
                <List.Item key={courseProfessorId}>
                  <CourseDisplayLink
                    courseCallNumber={courseCallNumber}
                    courseId={courseProfessorId}
                    courseName={courseName}
                  />
                </List.Item>
              );
            }
          )}
        </List>
      </div>
      <div>
        <CreateReviewButton color="yellow" professorId={professorId}>
          WRITE A REVIEW FOR {firstName} {lastName}
        </CreateReviewButton>
      </div>
    </div>
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

ProfessorSummary.propTypes = propTypes;
