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
          badge: "Silver", // TODO: Update to list of badge id
          departments: [
            {
              id: 29,
              name: "Computer Science",
            },
          ],
          firstname: "Nakul",
          last: "false",
          lastname: "Verma",
          id: 2339,
          title: "Nakul Verma",
          type: "professor",
        },
      ],
      testCourseResults: [
        {
          id: 1,
          name: "User Interface Design",
          department: {
            id: 6,
            name: "Computer Science",
          },
          title: "User Interface Design",
        },
      ],
    },
    {
      name: "only professors found",
      testProfessorResults: [
        {
          badge: "Silver", // TODO: Update to list of badge id
          departments: [
            {
              id: 29,
              name: "Computer Science",
            },
          ],
          firstname: "Nakul",
          last: "false",
          lastname: "Verma",
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
          id: 1,
          name: "User Interface Design",
          department: {
            id: 6,
            name: "Computer Science",
          },
          title: "User Interface Design",
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
