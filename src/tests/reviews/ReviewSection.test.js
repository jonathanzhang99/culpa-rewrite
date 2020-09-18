import { act, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import ReviewSection from "components/reviews/ReviewSection";

const headersByType = [
  [
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
    },
  ],
  [
    {
      reviewId: 1,
      reviewType: "course",
      reviewHeader: {
        profId: 1,
        profFirstName: "Nakul",
        profLastName: "Verma",
        uni: "nv2274",
        badges: [1],
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
      reviewType: "course",
      reviewHeader: {
        profId: 2,
        profFirstName: "Lee",
        profLastName: "Bollinger",
        uni: "lcb50",
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
    },
  ],
];

const associatedEntities = {
  course: [
    {
      professorId: 1,
      firstName: "Nakul",
      lastName: "Verma",
      badges: [1],
    },
    {
      professorId: 2,
      firstName: "Lee",
      lastName: "Bollinger",
      badges: [],
    },
  ],
  professor: [
    {
      courseId: 1,
      courseName: "Machine Learning",
      courseCallNumber: "COMS 4771",
    },
    {
      courseId: 2,
      courseName: "Freedom of Speech and Press",
      courseCallNumber: "POLS 3285",
    },
  ],
};

const singleDropdowns = [
  {
    name: "sorting",
    options: [
      { text: "Most Positive", value: "most_positive" },
      { text: "Most Negative", value: "most_negative" },
      { text: "Newest", value: "newest" },
      { text: "Oldest", value: "oldest" },
      { text: "Most Agreed", value: "most_agreed" },
      { text: "Most Disagreed", value: "most_disagreed" },
    ],
  },
  {
    name: "yearFilter",
    options: [
      { text: "Written within 2 years", value: 2 },
      { text: "Written within 5 years", value: 5 },
    ],
  },
];

const pagTestReviewTemplate = {
  reviewType: "course",
  reviewHeader: {
    profId: 1,
    profFirstName: "Nakul",
    profLastName: "Verma",
    uni: "nv2274",
    badges: [1],
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
};

const NUM_REVIEWS_PER_PAGE = 5;
const paginationTestReviews = Array(NUM_REVIEWS_PER_PAGE * 3)
  .fill()
  .map((_, index) => ({ reviewId: index, ...pagTestReviewTemplate }));
const pageId = 12345;

describe("review section snapshot tests", () => {
  headersByType.forEach((reviews) => {
    const pageType = reviews[0].reviewType;

    let mockFetch;
    beforeEach(() => {
      mockFetch = jest.spyOn(global, "fetch");
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => ({ reviews }),
        })
      );
    });
    afterEach(() => jest.resetAllMocks());

    test(`${reviews[0].reviewType} page test`, () => {
      const snapshot = render(
        <MemoryRouter>
          <ReviewSection
            associatedEntities={associatedEntities[pageType]}
            id={pageId}
            initReviews={reviews}
            pageType={pageType}
          />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});

describe("filtering and sorting tests", () => {
  headersByType.forEach((reviews) => {
    const pageType = reviews[0].reviewType;

    let mockFetch;
    beforeEach(() => {
      mockFetch = jest.spyOn(global, "fetch");
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => ({ reviews }),
        })
      );
    });
    afterEach(() => jest.resetAllMocks());

    describe(`${pageType} page test`, () => {
      beforeEach(() => {
        render(
          <MemoryRouter>
            <ReviewSection
              associatedEntities={associatedEntities[pageType]}
              id={pageId}
              initReviews={reviews}
              pageType={pageType}
            />
          </MemoryRouter>
        );
      });

      singleDropdowns.forEach(({ name, options }) => {
        options.forEach((option) => {
          test(`choosing ${option.text} for ${name}`, async () => {
            await act(async () => {
              fireEvent.click(screen.getByText(option.text));
            });

            const sortingArg = name === "sorting" ? option.value : "";
            const filterSingleArg = name === "yearFilter" ? option.value : "";
            const expectedUrl =
              `/api/review/get/${pageType}/${pageId}` +
              `?sorting=${sortingArg}` +
              `&filterList=` +
              `&filterYear=${filterSingleArg}`;
            expect(fetch).toHaveBeenCalledWith(expectedUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
          });
        });
      });

      associatedEntities[pageType].forEach((option) => {
        const text =
          pageType === "professor"
            ? `[${option.courseCallNumber}] ${option.courseName}`
            : `${option.firstName} ${option.lastName}`;
        const optionId =
          pageType === "professor" ? option.courseId : option.professorId;

        test(`testing single option '${text}' with associatedEntityFilter`, async () => {
          const elem = screen.getAllByRole("option").filter((item) => {
            return item.textContent === text;
          })[0];
          await act(async () => {
            fireEvent.click(elem);
          });
          expect(fetch).toHaveBeenCalledWith(
            `/api/review/get/${pageType}/${pageId}` +
              `?sorting=&filterList=${optionId}&filterYear=`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        });
      });
    });
  });
});

describe("pagination tests", () => {
  let mockFetch;
  beforeEach(() => {
    mockFetch = jest.spyOn(global, "fetch");
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => ({ reviews: paginationTestReviews }),
      })
    );
  });
  afterEach(() => jest.resetAllMocks());

  beforeEach(() =>
    render(
      <MemoryRouter>
        <ReviewSection
          associatedEntities={
            associatedEntities[pagTestReviewTemplate.reviewType]
          }
          id={pageId}
          initReviews={paginationTestReviews}
          pageType={pagTestReviewTemplate.reviewType}
        />
      </MemoryRouter>
    )
  );

  test("pagination click test", async () => {
    const beforeClick = screen.getAllByText("Workload").length;

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show more" }));
    });
    const clickOnce = screen.getAllByText("Workload").length;

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show more" }));
    });
    const clickTwice = screen.getAllByText("Workload").length;

    expect(beforeClick).toBe(NUM_REVIEWS_PER_PAGE);
    expect(clickOnce).toBe(NUM_REVIEWS_PER_PAGE * 2);
    expect(clickTwice).toBe(NUM_REVIEWS_PER_PAGE * 3);
  });
});
