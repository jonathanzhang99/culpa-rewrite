import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

const propTypesCourseHeader = {
  courseId: PropTypes.number.isRequired,
  courseSummary: PropTypes.shape({
    courseName: PropTypes.string.isRequired,
    departmentName: PropTypes.string.isRequired,
    recentCourseInstances: PropTypes.array.isRequired,
    associatedProfessors: PropTypes.array.isRequired,
  }).isRequired,
};

export default function CourseSummary() {
  const { courseId } = useParams();

  const {
    data: { courseSummary },
    isLoading,
    isError,
  } = useDataFetch(`/api/courses/${courseId}`, {
    courseSummary: {
      courseName: "",
      departmentName: "",
      recentCourseInstances: [
        {
          year: 0,
          semester: 0,
        },
      ],
      associatedProfessors: [
        {
          firstName: "",
          lastName: "",
          professorId: 0,
        },
      ],
    },
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  return (
    <div>
      <CourseHeader courseId={courseId} courseSummary={courseSummary} />
      <ReviewSummary />
    </div>
  );
}

function CourseHeader({ courseId, courseSummary }) {
  const {
    courseName,
    departmentName,
    recentCourseInstances,
    associatedProfessors,
  } = courseSummary;

  return (
    <div>
      <h1>
        <CourseDisplayName code="COURSE_CODE" name={courseName} />
      </h1>
      <h3>{departmentName}</h3>

      <h3>
        Professors:{" "}
        {associatedProfessors.map((professor, index) => {
          const { firstName, lastName, professorId } = professor;
          return (
            <span>
              <ProfessorDisplayLink
                as="a"
                firstName={firstName}
                lastName={lastName}
                professorId={professorId}
              />
              {associatedProfessors.length - 1 !== index ? ", " : ""}
            </span>
          );
        })}
      </h3>

      <h3>
        Offered in:{" "}
        {recentCourseInstances.map((courseInstance, index) => {
          const { year, semester } = courseInstance;
          return (
            <span>
              {year} {semester}{" "}
              {recentCourseInstances.length - 1 !== index ? ", " : ""}
            </span>
          );
        })}
      </h3>

      <CreateReviewButton compact color="yellow" courseId={courseId}>
        Write a Review for {courseName}
      </CreateReviewButton>
    </div>
  );
}

function ReviewSummary() {
  return "Review Summary here";
}

CourseHeader.propTypes = propTypesCourseHeader;
