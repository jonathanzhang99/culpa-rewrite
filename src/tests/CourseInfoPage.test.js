import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { CourseInfo } from "components/CourseInfoPage";

describe("CourseInfo Component", () => {
  const MAX_NUM_PROFESSORS_IN_LIST = 5;

  const testCases = [
    {
      testName: "renders course info with no professors",
      courseId: 1,
      courseName: "Machine Learning",
      courseCallNumber: "COMS 4771",
      departmentId: 1,
      departmentName: "Computer Science",
      courseProfessors: [],
    },
    {
      testName: "renders course info with one professor",
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
          badges: [1, 2],
        },
      ],
    },
    {
      testName: "renders course info with professor list",
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
          badges: [1, 2],
        },
        {
          firstName: "Daniel",
          lastName: "Hsu",
          professorId: 2,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [],
        },
      ],
    },
    {
      testName: "renders course info with professor accordion",
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
          badges: [1, 2],
        },
        {
          firstName: "Daniel",
          lastName: "Hsu",
          professorId: 2,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [],
        },
        {
          firstName: "Dorrie",
          lastName: "Tang",
          professorId: 3,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [1],
        },
        {
          firstName: "Elaine",
          lastName: "Wang",
          professorId: 4,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [2],
        },
        {
          firstName: "Jonathan",
          lastName: "Zhang",
          professorId: 5,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [3],
        },
        {
          firstName: "Jin Woo",
          lastName: "Hsu",
          professorId: 6,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [],
        },
        {
          firstName: "Sungbin",
          lastName: "Kim",
          professorId: 7,
          professorDepartments: [
            {
              professorDepartmentId: 1,
              professorDepartmentName: "Computer Science",
            },
          ],
          badges: [1, 2, 3],
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
            <CourseInfo
              courseCallNumber={courseCallNumber}
              courseId={courseId}
              courseName={courseName}
              courseProfessors={courseProfessors}
              departmentId={departmentId}
              departmentName={departmentName}
            />
          </MemoryRouter>
        );

        expect(snapshot).toMatchSnapshot();

        if (courseProfessors.length > MAX_NUM_PROFESSORS_IN_LIST) {
          expect(
            screen.queryByText(/show all professors/i)
          ).toBeInTheDocument();

          fireEvent.click(screen.getByText(/show all professors/i));
          expect(
            screen.queryByText(/hide all professors/i)
          ).toBeInTheDocument();

          fireEvent.click(screen.getByText(/hide all professors/i));
          expect(
            screen.queryByText(/show all professors/i)
          ).toBeInTheDocument();
        }
      });
    }
  );
});
