import React from "react";
import { useParams } from "react-router-dom";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import CourseSummary from "components/CourseSummary";
import ReviewSection from "components/reviews/ReviewSection";

export default function CoursePage() {
  const pageType = "course";
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
    isCourseLoading,
    isCourseError,
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

  const {
    data: { initReviews },
    isReviewLoading,
    isReviewError,
  } = useDataFetch(`/api/review/get/course/${courseId}`, [
    {
      reviewId: 0,
      reviewType: "course",
      reviewHeader: {
        profId: 0,
        profFirstName: "",
        profLastName: "",
        uni: "",
      },
      votes: {
        initUpvoteCount: 0,
        initDownvoteCount: 0,
        initFunnyCount: 0,
        upvoteClicked: false,
        downvoteClicked: false,
        funnyClicked: false,
      },
      content: "",
      workload: "",
      submissionDate: "",
      deprecated: false,
    },
    {
      reviewId: 0,
      reviewType: "course",
      reviewHeader: {
        profId: 0,
        profFirstName: "",
        profLastName: "",
        uni: "",
      },
      votes: {
        initUpvoteCount: 0,
        initDownvoteCount: 0,
        initFunnyCount: 0,
        upvoteClicked: false,
        downvoteClicked: false,
        funnyClicked: false,
      },
      content: "",
      workload: "",
      submissionDate: "",
      deprecated: false,
    },
  ]);

  if (isCourseLoading || isCourseError) {
    return isCourseLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  if (isReviewLoading || isReviewError) {
    return isReviewLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      <CourseSummary
        courseId={courseId}
        courseSummary={courseSummary}
        reviewSummary={reviewSummary}
      />
      <ReviewSection
        associatedEntities={courseSummary.associatedProfessors}
        id={courseId}
        initReviews={initReviews}
        pageType={pageType}
      />
    </>
  );
}
