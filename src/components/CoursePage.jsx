import React from "react";
import { useParams } from "react-router-dom";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import CourseSummary from "components/CourseSummary";

export default function CoursePage() {
  const { courseId } = useParams();

  const {
    data: { courseSummary },
    isLoading,
    isError,
  } = useDataFetch(`/api/courses/${courseId}`, {
    courseSummary: {
      courseName: "",
      courseCallNumber: "",
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
          profDepartments: [
            {
              profDepartmentId: 0,
              profDepartmentName: "",
            },
          ],
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

  return <CourseSummary courseId={courseId} courseSummary={courseSummary} />;
}
