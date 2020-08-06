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
  } = useDataFetch(`/api/course/${courseId}`, {
    courseSummary: {
      courseName: "",
      courseCallNumber: "",
      departmentName: "",
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
