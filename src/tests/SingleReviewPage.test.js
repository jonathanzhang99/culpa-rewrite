import { act, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

import { AuthProvider } from "components/common/Authentication";
import SingleReviewPage, { ThankYouTextBox } from "components/SingleReviewPage";

describe("single review page", () => {
  const cases = [
    {
      reviewId: 1,
      fetchReturn: {
        flag: "approved",
        review: {
          reviewId: 1,
          reviewType: "all",
          reviewHeader: {
            course: {
              courseId: 1,
              courseName: "test course",
              courseCode: "ABCD 1234",
            },
            professor: {
              profId: 1,
              profFirstName: "Jane",
              profLastName: "Doe",
              uni: "jd6789",
              badges: [1],
            },
          },
          votes: {
            initUpvoteCount: 1,
            initDownvoteCount: 2,
            initFunnyCount: 3,
            upvoteClicked: true,
            downvoteClicked: false,
            funnyClicked: false,
          },
          content: "demo demo",
          workload: "demo demo",
          rating: 3,
          submissionDate: "Oct 13, 2018",
          deprecated: false,
        },
      },
    },
    {
      reviewId: 2,
      fetchReturn: {
        flag: "libel",
        review: {
          reviewId: 2,
        },
      },
    },
    {
      reviewId: 3,
      fetchReturn: {
        flag: "pending",
        review: {
          reviewId: 3,
        },
      },
    },
  ];

  cases.forEach(({ reviewId, fetchReturn }) => {
    test(`${fetchReturn.flag} case logic test`, async () => {
      const mockFetch = jest.spyOn(global, "fetch");
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => fetchReturn,
        })
      );

      await act(async () => {
        render(
          <MemoryRouter initialEntries={[`/review/${reviewId}`]}>
            <Route path="/review/:reviewId">
              <AuthProvider>
                <SingleReviewPage />
              </AuthProvider>
            </Route>
          </MemoryRouter>
        );
      });

      expect(mockFetch).toHaveBeenCalled();

      if (fetchReturn.flag === "approved") {
        expect(screen.getByText("Workload")).toBeInTheDocument();
        expect(screen.getByText(`ID: ${reviewId}`)).toBeInTheDocument();
      } else {
        expect(screen.getByText("Thank you!")).toBeInTheDocument();
        expect(screen.getByText("WRITE ANOTHER REVIEW")).toBeInTheDocument();
        expect(screen.getByText(`Review ID: ${reviewId}`)).toBeInTheDocument();
      }
    });
  });
});

describe("Thank you text box", () => {
  test("snapshot test", () => {
    const snapshot = render(
      <MemoryRouter>
        <ThankYouTextBox reviewId={12345} />
      </MemoryRouter>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
