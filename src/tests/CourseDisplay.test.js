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
      courseName: "",
    },
    {
      testName: "renders CourseDisplayName as span",
      code: "COMS4771",
      courseName: "Machine Learning",
    },
    {
      testName: "renders CourseDisplayName as Header",
      code: "COMS4771",
      courseName: "Machine Learning",
      type: "header",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no CourseDisplayLink",
      code: "",
      courseId: 0,
      courseName: "",
    },
    {
      testName: "renders CourseDisplayLink as span",
      code: "COMS4771",
      courseId: 3,
      courseName: "Machine Learning",
    },
    {
      testName: "renders CourseDisplayLink as Header",
      code: "COMS4771",
      courseId: 3,
      courseName: "Machine Learning",
      type: "header",
    },
  ];

  nameTestCases.forEach(({ testName, code, courseName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <CourseDisplayName code={code} courseName={courseName} type={type} />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(({ testName, code, courseId, courseName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <CourseDisplayLink
            code={code}
            courseId={courseId}
            courseName={courseName}
            type={type}
          />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
