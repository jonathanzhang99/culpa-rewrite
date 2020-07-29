import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import {
  CourseDisplayName,
  CourseDisplayLink,
} from "components/common/CourseDisplay";

describe("CourseDisplay Components", () => {
  test("CourseDisplayName test", () => {
    const snapshot = render(
      <CourseDisplayName code="COMS4771" name="Machine Learning" />
    );
    expect(snapshot).toMatchSnapshot();
  });

  test("CourseDisplayLink test", () => {
    const snapshot = render(
      <MemoryRouter>
        <CourseDisplayLink
          code="COMS4771"
          courseId={3}
          name="Machine Learning"
        />
      </MemoryRouter>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
