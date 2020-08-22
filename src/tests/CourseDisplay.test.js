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
      courseCallNumber: "",
      courseName: "",
    },
    {
      testName: "renders CourseDisplayName as span",
      courseCallNumber: "COMS4771",
      courseName: "Machine Learning",
    },
    {
      testName: "renders CourseDisplayName as Header",
      courseCallNumber: "COMS4771",
      courseName: "Machine Learning",
      type: "header",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no CourseDisplayLink",
      courseCallNumber: "",
      courseId: 0,
      courseName: "",
    },
    {
      testName: "renders CourseDisplayLink as span",
      courseCallNumber: "COMS4771",
      courseId: 3,
      courseName: "Machine Learning",
    },
    {
      testName: "renders CourseDisplayLink as Header",
      courseCallNumber: "COMS4771",
      courseId: 3,
      courseName: "Machine Learning",
      type: "header",
    },
  ];

  nameTestCases.forEach(({ testName, courseCallNumber, courseName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <CourseDisplayName courseCallNumber={courseCallNumber} courseName={courseName} type={type} />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(({ testName, courseCallNumber, courseId, courseName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <CourseDisplayLink
            courseCallNumber={courseCallNumber}
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
