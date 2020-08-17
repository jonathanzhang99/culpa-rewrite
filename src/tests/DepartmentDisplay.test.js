import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import {
  DepartmentDisplayName,
  DepartmentDisplayLink,
} from "components/common/DepartmentDisplay";

describe("DepartmentDisplay Components", () => {
  const nameTestCases = [
    {
      testName: "renders no DepartmentDisplayName",
      departmentName: "",
    },
    {
      testName: "renders DepartmentDisplayName as span",
      departmentName: "Computer Science",
    },
    {
      testName: "renders DepartmentDisplayName as Header",
      departmentName: "Computer Science",
      type: "header",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no DepartmentDisplayLink",
      departmentName: "",
      departmentId: 0,
    },
    {
      testName: "renders DepartmentDisplayLink as span",
      departmentName: "Computer Science",
      departmentId: 29,
    },
    {
      testName: "renders DepartmentDisplayLink as Header",
      departmentName: "Computer Science",
      departmentId: 29,
      type: "header",
    },
  ];

  nameTestCases.forEach(({ testName, departmentName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <DepartmentDisplayName departmentName={departmentName} type={type} />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(({ testName, departmentName, departmentId, type }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <DepartmentDisplayLink
            departmentId={departmentId}
            departmentName={departmentName}
            type={type}
          />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
