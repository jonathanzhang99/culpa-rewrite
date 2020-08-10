import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { CourseHeader } from "components/CourseSummary";

describe("CourseSummary Components", () => {
  const courseHeaderTestCases = [
    {
      testName: "empty props CourseSummary",
      courseId: 0,
      courseSummary: {
        courseName: "",
        courseCallNumber: "",
        departmentName: "",
        associatedProfessors: [
          {
            firstName: "",
            lastName: "",
            professorId: 0,
            profDepartments: [
              {
                profDepartmentId: 0,
                profDepartmentName: "",
              },
            ],
          },
        ],
      },
    },
    {
      testName: "empty professors CourseSummary",
      courseId: 0,
      courseSummary: {
        courseName: "Machine Learning",
        courseCallNumber: "COMS4771",
        departmentName: "Computer Science",
        associatedProfessors: [
          {
            firstName: "",
            lastName: "",
            professorId: 0,
            profDepartments: [
              {
                profDepartmentId: 0,
                profDepartmentName: "",
              },
            ],
          },
        ],
      },
    },
    {
      testName: "valid props CourseSummary",
      courseId: 1,
      courseSummary: {
        courseName: "Machine Learning",
        courseCallNumber: "COMS4771",
        departmentName: "Computer Science",
        associatedProfessors: [
          {
            firstName: "Nakul",
            lastName: "Verma",
            professorId: 1,
            profDepartments: [
              {
                profDepartmentId: 1,
                profDepartmentName: "Computer Science",
              },
              {
                profDepartmentId: 2,
                profDepartmentName: "Law",
              },
            ],
          },
        ],
      },
    },
  ];

  courseHeaderTestCases.forEach(({ testName, courseId, courseSummary }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <CourseHeader courseId={courseId} courseSummary={courseSummary} />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
