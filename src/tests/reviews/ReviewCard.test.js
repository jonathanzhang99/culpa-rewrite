import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "components/common/Authentication";
import ReviewCard from "components/reviews/ReviewCard";

describe("ReviewCard tests setup", () => {
  const diffTypes = [
    {
      reviewType: "course",
      reviewHeader: {
        profFirstName: "Adam",
        profLastName: "Canon",
        profId: 12345,
        uni: "12345",
      },
    },
    {
      reviewType: "professor",
      reviewHeader: {
        courseId: 12345,
        courseName: "intro to programming",
        courseCode: "COMS1004",
      },
    },
  ];

  const diffVotes = [
    {
      initUpvoteCount: 10,
      initDownvoteCount: 2,
      initFunnyCount: 3,
      upvoteClicked: true,
      downvoteClicked: false,
      funnyClicked: true,
    },
    {
      initUpvoteCount: 10,
      initDownvoteCount: 2,
      initFunnyCount: 3,
      upvoteClicked: true,
      downvoteClicked: true,
      funnyClicked: true,
    },
    {
      initUpvoteCount: 10,
      initDownvoteCount: 2,
      initFunnyCount: 3,
      upvoteClicked: false,
      downvoteClicked: false,
      funnyClicked: false,
    },
  ];

  const basicInfo = {
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    deprecated: true,
    reviewId: 1,
    submissionDate: "2014-07-31",
    workload: "Excepteur sint occaecat cupidatat non proident.",
  };

  diffTypes.forEach(({ reviewType, reviewHeader }) => {
    diffVotes.forEach((votes) => {
      test("review card test", () => {
        const snapshot = render(
          <AuthProvider>
            <MemoryRouter>
              <ReviewCard
                content={basicInfo.content}
                deprecated={basicInfo.deprecated}
                rating={basicInfo.rating}
                reviewHeader={reviewHeader}
                reviewId={basicInfo.reviewId}
                reviewType={reviewType}
                submissionDate={basicInfo.submissionDate}
                votes={votes}
                workload={basicInfo.workload}
              />
            </MemoryRouter>
          </AuthProvider>
        );
        expect(snapshot).toMatchSnapshot();
      });
    });
  });
});
