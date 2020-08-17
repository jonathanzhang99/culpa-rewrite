import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import ProfessorInfoPage from "components/ProfessorInfoPage";

describe("ProfessorInfoPage Component", () => {
  const loginSuccess = jest.fn(() => {
    Promise.resolve();
  });
  const TEST_PROFESSOR_ID_PARAM = 1;
  const testCases = [
    {
      name: "renders no info",
      firstName: "",
      lastName: "",
      courses: [{}],
    },
    {
      name: "renders professor info",
      firstName: "Nakul",
      lastName: "Verma",
      courses: [
        {
          courseProfessorId: 1,
          courseName: "Machine Learning",
          courseCallNumber: "COMS 4771",
        },
        {
          courseProfessorId: 2,
          courseName: "Advanced Machine Learning",
          courseCallNumber: "COMS 4774",
        },
      ],
    },
  ];
  testCases.forEach(({ name, firstName, lastName, courses }) => {
    test(name, () => {
      const snapshot = render(
        <MemoryRouter initialEntries={[TEST_PROFESSOR_ID_PARAM]}>
          <Route path=":professorId">
            <AuthContext.Provider value={{ login: loginSuccess }}>
              <ProfessorInfoPage
                courses={courses}
                firstName={firstName}
                lastName={lastName}
              />
            </AuthContext.Provider>
          </Route>
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
