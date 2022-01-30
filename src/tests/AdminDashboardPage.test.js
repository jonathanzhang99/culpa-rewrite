import { render } from "@testing-library/react";
import React from "react";

import {PendingReviews} from "components/admin/AdminDashboardPage";


describe("AdminDashboardPage Pending Reviews Component", () => {
  const testCases = [
    {
      name: "multiple pending reviews",
      testResults: {
        "reviews": [
        {
          reviewId: 1,
          reviewType: "professor",
          reviewHeader: {
            courseId: 1,
            courseName: "Machine Learning",
            courseCallNumber: "COMS 4771",
          },
          votes: {
            initUpvoteCount: 3,
            initDownvoteCount: 2,
            initFunnyCount: 1,
            upvoteClicked: true,
            downvoteClicked: false,
            funnyClicked: true,
          },
          content: "demo content",
          workload: "demo workload",
          submissionDate: "2020-01-01",
          deprecated: true,
        },
        {
          reviewId: 2,
          reviewType: "professor",
          reviewHeader: {
            courseId: 5,
            courseName: "Freedom of Speech and Press",
            courseCallNumber: "POLS 3285",
          },
          votes: {
            initUpvoteCount: 3,
            initDownvoteCount: 2,
            initFunnyCount: 1,
            upvoteClicked: true,
            downvoteClicked: false,
            funnyClicked: true,
          },
          content: "demo content",
          workload: "demo workload",
          submissionDate: "2020-01-01",
          deprecated: false,
        }
      ]}
    },
    {
      name: "no pending review",
      testResults: {
        "reviews": []
      }
    }
  ];

  testCases.forEach(({ name, testPendingReviewResults }) => {
    test(name, () => {
      const snapshot = render(
        <PendingReviews pageNumber={1} reviews={testPendingReviewResults} />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});