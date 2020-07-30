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
      code: "",
      name: "",
    },
    {
      testName: "renders CourseDisplayName",
      code: "COMS4771",
      name: "Machine Learning",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no CourseDisplayLink",
      code: "",
      courseId: null,
      name: "",
    },
    {
      testName: "renders CourseDisplayLink",
      code: "COMS4771",
      courseId: 3,
      name: "Machine Learning",
    },
  ];

  nameTestCases.forEach(({ testName, code, name }) => {
    test(testName, () => {
      const snapshot = render(<CourseDisplayName code={code} name={name} />);
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(({ testName, code, courseId, name }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <CourseDisplayLink code={code} courseId={courseId} name={name} />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
