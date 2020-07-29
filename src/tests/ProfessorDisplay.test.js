import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import {
  ProfessorDisplayName,
  ProfessorDisplayLink,
} from "components/common/ProfessorDisplay";

describe("ProfessorDisplay Components", () => {
  test("ProfessorDisplayName test", () => {
    const snapshot = render(
      <ProfessorDisplayName firstName="Lee" lastName="Bollinger" />
    );
    expect(snapshot).toMatchSnapshot();
  });

  test("ProfessorDisplayLink test", () => {
    const snapshot = render(
      <MemoryRouter>
        <ProfessorDisplayLink
          firstName="Lee"
          lastName="Bollinger"
          professorId={5}
        />
      </MemoryRouter>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
