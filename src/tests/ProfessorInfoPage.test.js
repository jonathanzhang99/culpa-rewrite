import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ProfessorSummary } from "components/ProfessorInfoPage";

describe("ProfessorSummary Component", () => {
  const testCases = [
    {
      testName: "renders professor no courses",
      professorId: 1,
      firstName: "Nakul",
      lastName: "Verma",
      courses: [],
    },
    {
      testName: "renders professor info",
      professorId: 1,
      firstName: "Nakul",
      lastName: "Verma",
      courses: [
        {
          courseId: 1,
          courseName: "Machine Learning",
          courseCallNumber: "COMS 4771",
        },
        {
          courseId: 2,
          courseName: "Advanced Machine Learning",
          courseCallNumber: "COMS 4774",
        },
      ],
    },
  ];
  testCases.forEach(
    ({ testName, professorId, firstName, lastName, courses }) => {
      test(testName, () => {
        const snapshot = render(
          <MemoryRouter>
            <ProfessorSummary
              courses={courses}
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
            />
          </MemoryRouter>
        );
        expect(snapshot).toMatchSnapshot();
      });
    }
  );
});
