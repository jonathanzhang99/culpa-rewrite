import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import {
  CourseDisplayName,
  CourseDisplayLink,
} from "components/common/CourseDisplay";

describe("CourseDisplay Components", () => {
  const nameTestCases = [
    {
      testName: "renders no CourseDisplayName",
      as: "",
      code: "",
      name: "",
    },
    {
      testName: "renders CourseDisplayName",
      as: "h3",
      code: "COMS4771",
      name: "Machine Learning",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no CourseDisplayLink",
      as: "",
      code: "",
      courseId: null,
      name: "",
    },
    {
      testName: "renders CourseDisplayLink",
      as: "h1",
      code: "COMS4771",
      courseId: 3,
      name: "Machine Learning",
    },
  ];

  nameTestCases.forEach(({ testName, as, code, name }) => {
    test(testName, () => {
      const snapshot = render(
        <CourseDisplayName as={as} code={code} name={name} />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(({ testName, as, code, courseId, name }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <CourseDisplayLink
            as={as}
            code={code}
            courseId={courseId}
            name={name}
          />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
