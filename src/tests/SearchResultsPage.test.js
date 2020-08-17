import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ProfessorResults, CourseResults } from "components/SearchResultsPage";

describe("SearchResultsPage Components", () => {
  const professorTestCases = [
    {
      name: "professors found",
      professors: [
        {
          title: "Nakul Verma",
          type: "professor",
          professorid: 2339,
          firstname: "Nakul",
          lastname: "Verma",
          badge: "Silver", // TO DO: Update to list of badge id
          departments: [
            {
              departmentid: 29,
              departmentname: "Computer Science",
            },
          ],
        },
      ],
    },
    {
      name: "professors not found",
      professors: [],
    },
  ];

  const courseTestCases = [
    {
      name: "courses found",
      courses: [
        {
          courseid: 1,
          coursename: "UI Design",
          departmentid: 6,
          departmentname: "Computer Science",
        },
      ],
    },
    {
      name: "courses not found",
      courses: [],
    },
  ];

  professorTestCases.forEach(({ name, professors }) => {
    test(name, () => {
      const snapshot = render(
        <MemoryRouter>
          <ProfessorResults professors={professors} />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  courseTestCases.forEach(({ name, courses }) => {
    test(name, () => {
      const snapshot = render(
        <MemoryRouter>
          <CourseResults courses={courses} />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
