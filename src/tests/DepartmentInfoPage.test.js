import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { DepartmentInfo } from "components/DepartmentInfoPage";

describe("DepartmentInfo Component", () => {
  const testCases = [
    {
      testName: "renders department with no courses or professors",
      departmentName: "Computer Science",
      departmentCourses: [],
      departmentProfessors: [],
    },
    {
      testName: "renders department info",
      departmentName: "Computer Science",
      departmentCourses: [
        {
          courseId: 1,
          courseName: "User Interface Design",
        },
        {
          courseId: 2,
          courseName: "Machine Learning",
        },
      ],
      departmentProfessors: [
        {
          professorId: 1,
          firstName: "Lydia",
          lastName: "Chilton",
        },
        {
          professorId: 2,
          firstName: "Nakul",
          lastName: "Verma",
        },
      ],
    },
  ];
  testCases.forEach(
    ({ testName, departmentName, departmentCourses, departmentProfessors }) => {
      test(testName, () => {
        const snapshot = render(
          <MemoryRouter>
            <DepartmentInfo
              departmentCourses={departmentCourses}
              departmentName={departmentName}
              departmentProfessors={departmentProfessors}
            />
          </MemoryRouter>
        );
        expect(snapshot).toMatchSnapshot();
      });
    }
  );
});
