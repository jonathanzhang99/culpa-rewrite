import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import { CourseSummary } from "components/CourseInfoPage";

describe("CourseInfoPage Component", () => {
  const testCases = [
    {
      testName: "renders course info with no professors",
      courseId: 0,
      courseName: "Machine Learning",
      courseCallNumber: "COMS 4771",
      departmentId: 1,
      departmentName: "Computer Science",
      courseProfessors: [],
    },
    {
      testName: "renders course info with professor",
      courseId: 1,
      courseName: "Machine Learning",
      courseCallNumber: "COMS 4771",
      departmentId: 1,
      departmentName: "Computer Science",
      courseProfessors: [
        {
          firstName: "Nakul",
          lastName: "Verma",
          professorId: 1,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
            {
              professorDepartmentId: 3,
              professorDepartmentName: "Mathematics",
            },
          ],
        },
      ],
    },
  ];

  testCases.forEach(
    ({
      testName,
      courseId,
      courseName,
      courseCallNumber,
      departmentId,
      departmentName,
      courseProfessors,
    }) => {
      test(testName, () => {
        const snapshot = render(
          <MemoryRouter>
            <CourseSummary
              courseCallNumber={courseCallNumber}
              courseId={courseId}
              courseName={courseName}
              courseProfessors={courseProfessors}
              departmentId={departmentId}
              departmentName={departmentName}
            />
          </MemoryRouter>
        );
        screen.debug();

        expect(snapshot).toMatchSnapshot();
      });
    }
  );

  /* Semantic-UI React does not change HTML for accordion folding/unfolding so 
   we test accordion functionality by checking for change in button string. */
  test("renders course info with working professor accordion", () => {
    const courseId = 1;
    const courseName = "Machine Learning";
    const courseCallNumber = "COMS 4771";
    const departmentId = 1;
    const departmentName = "Computer Science";
    const courseProfessors = [
      {
        firstName: "Nakul",
        lastName: "Verma",
        professorId: 1,
        professorDepartments: [
          {
            professorDepartmentId: 1,
            professorDepartmentName: "Computer Science",
          },
          {
            professorDepartmentId: 3,
            professorDepartmentName: "Mathematics",
          },
        ],
      },
    ];

    render(
      <MemoryRouter>
        <CourseSummary
          courseCallNumber={courseCallNumber}
          courseId={courseId}
          courseName={courseName}
          courseProfessors={courseProfessors}
          departmentId={departmentId}
          departmentName={departmentName}
        />
      </MemoryRouter>
    );

    screen.debug();
    expect(screen.queryByText(/show all professors/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/show all professors/i));
    expect(screen.queryByText(/hide all professors/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/hide all professors/i));
    expect(screen.queryByText(/show all professors/i)).toBeInTheDocument();
  });
});
