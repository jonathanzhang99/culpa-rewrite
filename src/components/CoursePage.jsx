import React from "react";
import { useParams } from "react-router-dom";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import CourseSummary from "components/CourseSummary";

export default function CoursePage() {
  const { courseId } = useParams();

  const defaultReview = {
    reviewType: "course",
    reviewHeader: {
      profId: 0,
      profFirstName: "First",
      profLastName: "Last",
    },
    votes: {
      initUpvoteCount: 0,
      initDownvoteCount: 0,
      initFunnyCount: 0,
      upvoteClicked: false,
      downvoteClicked: false,
      funnyClicked: false,
    },
    workload: "",
    submissionDate: "",
    reviewId: 0,
    deprecated: false,
    content: "This is a review.",
  };

  const {
    data: { courseSummary, reviewSummary },
    isLoading,
    isError,
  } = useDataFetch(`/api/course/${courseId}`, {
    courseSummary: {
      courseName: "",
      courseCallNumber: "",
      departmentId: 0,
      departmentName: "",
      associatedProfessors: [],
    },
    review_summary: {
      positiveReview: defaultReview,
      negativeReview: defaultReview,
    },
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <CourseSummary
      courseId={courseId}
      courseSummary={courseSummary}
      reviewSummary={reviewSummary}
    />
  );
}
