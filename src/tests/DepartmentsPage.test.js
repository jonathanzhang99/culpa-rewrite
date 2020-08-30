import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { Departments } from "components/DepartmentsPage";

describe("Departments Component", () => {
  const testCases = [
    {
      name: "renders no departments",
      departments: [],
    },
    {
      name: "renders multiple departments",
      departments: [
        {
          departmentId: 1,
          departmentName: "Computer Science",
        },
        {
          departmentId: 2,
          departmentName: "English",
        },
      ],
    },
  ];
  testCases.forEach(({ name, departments }) => {
    test(name, () => {
      const snapshot = render(
        <MemoryRouter>
          \ <Departments departments={departments} />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
