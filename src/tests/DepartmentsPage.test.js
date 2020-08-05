import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import DepartmentsPage from "components/DepartmentsPage";

describe("DepartmentsPage Component", () => {
  const loginSuccess = jest.fn(() => {
    Promise.resolve();
  });
  const testCases = [
    {
      name: "renders no departments",
      departments: [{}],
    },
    {
      name: "renders multiple departments",
      departments: [
        {
          name: "Computer Science",
        },
        {
          name: "English",
        },
      ],
    },
  ];
  testCases.forEach(({ name, departments }) => {
    test(name, () => {
      const snapshot = render(
        <MemoryRouter>
          <AuthContext.Provider value={{ login: loginSuccess }}>
            <DepartmentsPage departments={departments} />
          </AuthContext.Provider>
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
