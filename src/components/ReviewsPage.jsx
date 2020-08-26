// TODO: this is only an example page for debugging and should be removed eventually
import React from "react";

import ReviewCard from "components/reviews/ReviewCard";

const exampleProps = {
  reviewType: "course",
  reviewHeader: {
    courseId: 12345,
    courseCode: "COMS1004",
    courseName: "Intro to Programming",
  },
  votes: {
    upvoteClicked: true,
    downvoteClicked: false,
    funnyClicked: false,
    initUpvoteCount: 10,
    initDownvoteCount: 2,
    initFunnyCount: 3,
  },
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  deprecated: true,
  reviewId: 1,
  submissionDate: "2014-07-31",
  workload:
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
};
export default function Reviews() {
  return (
    <ReviewCard
      content={exampleProps.content}
      deprecated={exampleProps.deprecated}
      rating={exampleProps.rating}
      reviewHeader={exampleProps.reviewHeader}
      reviewId={exampleProps.reviewId}
      reviewType={exampleProps.reviewType}
      submissionDate={exampleProps.submissionDate}
      votes={exampleProps.votes}
      workload={exampleProps.workload}
    />
  );
}
