import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import useDataFetch from "components/common/useDataFetch";
import SearchResultsPage from "components/SearchResultsPage";

jest.mock("../components/common/useDataFetch");

afterEach(() => {
  useDataFetch.mockReset();
});

describe("SearchResultsPage Components", () => {
  const testCases = [
    {
      name: "both professors and courses found",
      testProfessorResults: [
        {
          childKey: "professor-2339",
          departments: [
            {
              id: 29,
              name: "Computer Science",
            },
          ],
          last: "false",
          id: 2339,
          title: "Nakul Verma",
          type: "professor",
        },
      ],
      testCourseResults: [
        {
          childKey: "course-1",
          departments: [
            {
              id: 6,
              name: "Computer Science",
            },
          ],
          id: 1,
          title: "User Interface Design",
          type: "course",
        },
      ],
    },
    {
      name: "only professors found",
      testProfessorResults: [
        {
          childKey: "professor-2339",
          departments: [
            {
              id: 29,
              name: "Computer Science",
            },
          ],
          last: "false",
          id: 2339,
          title: "Nakul Verma",
          type: "professor",
        },
      ],
      testCourseResults: [],
    },
    {
      name: "only courses found",
      testProfessorResults: [],
      testCourseResults: [
        {
          childKey: "course-1",
          departments: [
            {
              id: 6,
              name: "Computer Science",
            },
          ],
          id: 1,
          title: "User Interface Design",
          type: "course",
        },
      ],
    },
    {
      name: "no results found",
      testProfessorResults: [],
      testCourseResults: [],
    },
  ];

  testCases.forEach(({ name, testProfessorResults, testCourseResults }) => {
    test(name, () => {
      useDataFetch.mockImplementation(() => ({
        data: {
          professorResults: testProfessorResults,
          courseResults: testCourseResults,
        },
        isError: false,
        isLoading: false,
      }));
      const snapshot = render(
        <MemoryRouter>
          <SearchResultsPage />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
      expect(useDataFetch).toHaveBeenCalledTimes(1);
    });
  });
});
