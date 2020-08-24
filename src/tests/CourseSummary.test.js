import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { CourseHeader } from "components/CourseSummary";

afterEach(cleanup);

describe("CourseSummary Components", () => {
  const courseHeaderTestCases = [
    {
      testName: "empty props CourseSummary",
      courseId: "0",
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
      courseId: "0",
      courseSummary: {
        courseName: "Machine Learning",
        courseCallNumber: "COMS 4771",
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
      testName: "Shows one professor in a list",
      courseId: "1",
      courseSummary: {
        courseName: "Machine Learning",
        courseCallNumber: "COMS 4771",
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
    {
      testName: "Shows six professors in a list",
      courseId: "1",
      courseSummary: {
        courseName: "Machine Learning",
        courseCallNumber: "COMS 4771",
        departmentName: "Computer Science",
        associatedProfessors: [
          {
            firstName: "Professor",
            lastName: "One",
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
          {
            firstName: "Professor",
            lastName: "Two",
            professorId: 2,
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
          {
            firstName: "Professor",
            lastName: "Three",
            professorId: 3,
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
          {
            firstName: "Professor",
            lastName: "Four",
            professorId: 4,
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
          {
            firstName: "Professor",
            lastName: "Five",
            professorId: 5,
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
          {
            firstName: "Professor",
            lastName: "Six",
            professorId: 6,
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

  /* semantic-ui react does not change html for folding/unfolding so 
   checking for button string change instead */
  test("Shows six professors in an accordion", () => {
    const courseId = "1";
    const courseSummary = {
      courseName: "Machine Learning",
      courseCallNumber: "COMS 4771",
      departmentName: "Computer Science",
      associatedProfessors: [
        {
          firstName: "Professor",
          lastName: "One",
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
        {
          firstName: "Professor",
          lastName: "Two",
          professorId: 2,
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
        {
          firstName: "Professor",
          lastName: "Three",
          professorId: 3,
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
        {
          firstName: "Professor",
          lastName: "Four",
          professorId: 4,
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
        {
          firstName: "Professor",
          lastName: "Five",
          professorId: 5,
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
        {
          firstName: "Professor",
          lastName: "Six",
          professorId: 6,
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
    };

    render(
      <MemoryRouter>
        <CourseHeader courseId={courseId} courseSummary={courseSummary} />
      </MemoryRouter>
    );
    expect(
      screen.queryByText("Show all professors who teach this course")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByText("Show all professors who teach this course")
    );
    expect(
      screen.queryByText("Hide all professors who teach this course")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByText("Hide all professors who teach this course")
    );
    expect(
      screen.queryByText("Show all professors who teach this course")
    ).toBeInTheDocument();
  });
});
