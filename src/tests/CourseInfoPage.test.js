import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import CourseInfoPage from "components/CourseInfoPage";

describe("CourseInfoPage Component", () => {
  const loginSuccess = jest.fn(() => {
    Promise.resolve();
  });
  const testCases = [
    {
      testName: "renders no info",
      courseId: 0,
      courseName: "",
      courseCallNumber: "",
      departmentId: 0,
      departmentName: "",
      courseProfessors: [{}],
    },
    {
      testName: "renders course info with no professors",
      courseId: 0,
      courseName: "Machine Learning",
      courseCallNumber: "COMS 4771",
      departmentId: 1,
      departmentName: "Computer Science",
      courseProfessors: [{}],
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
          <MemoryRouter initialEntries={[courseId]}>
            <Route path=":courseId">
              <AuthContext.Provider value={{ login: loginSuccess }}>
                <CourseInfoPage
                  courseCallNumber={courseCallNumber}
                  courseId={courseId}
                  courseName={courseName}
                  courseProfessors={courseProfessors}
                  departmentId={departmentId}
                  departmentName={departmentName}
                />
              </AuthContext.Provider>
            </Route>
          </MemoryRouter>
        );
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
      <MemoryRouter initialEntries={[courseId]}>
        <Route path=":courseId">
          <AuthContext.Provider value={{ login: loginSuccess }}>
            <CourseInfoPage
              courseCallNumber={courseCallNumber}
              courseId={courseId}
              courseName={courseName}
              courseProfessors={courseProfessors}
              departmentId={departmentId}
              departmentName={departmentName}
            />
          </AuthContext.Provider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.queryByText("Show")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Show"));
    expect(screen.queryByText("Hide")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide"));
    expect(screen.queryByText("Show")).toBeInTheDocument();
  });
});
