import { render } from "@testing-library/react";
import React from "react";

import { DepartmentsSection } from "components/DepartmentsPage";

describe("DepartmentsSection Component", () => {
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
      const snapshot = render(<DepartmentsSection departments={departments} />);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
