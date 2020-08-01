import React from "react";
import { useParams } from "react-router-dom";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";

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
      <h1> course_id: {courseId}</h1>
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

      <ul>
        {associatedProfessors.map((professor) => {
          const { firstName, lastName, professorId } = professor;
          return (
            <li key={professorId}>
              <ProfessorDisplayLink
                firstName={firstName}
                lastName={lastName}
                professorId={professorId}
              />
            </li>
          );
        })}
      </ul>

      <ul>
        {recentCourseInstances.map((courseInstance) => {
          const { year, semester } = courseInstance;
          return (
            <li key={`${year}_${semester}`}>
              {year} {semester}
            </li>
          );
        })}
      </ul>

      <CreateReviewButton fluid color="yellow">
        Write a Review for COURSENAME
      </CreateReviewButton>
    </div>
  );
}

function ReviewSummary() {
  return "Review Summary here";
}
