import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import {
  ProfessorDisplayName,
  ProfessorDisplayLink,
} from "components/common/ProfessorDisplay";

describe("ProfessorDisplay Components", () => {
  const nameTestCases = [
    {
      testName: "renders no ProfessorDisplayName",
      as: "",
      firstName: "",
      lastName: "",
    },
    {
      testName: "renders ProfessorDisplayName",
      as: "h2",
      firstName: "Nakul",
      lastName: "Verma",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no ProfessorDisplayLink",
      as: "",
      firstName: "",
      lastName: "",
      professorId: 0,
    },
    {
      testName: "renders ProfessorDisplayLink",
      firstName: "Nakul",
      lastName: "Verma",
      professorId: 5,
    },
  ];

  nameTestCases.forEach(({ testName, firstName, lastName }) => {
    test(testName, () => {
      const snapshot = render(
        <ProfessorDisplayName firstName={firstName} lastName={lastName} />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(({ testName, firstName, lastName, professorId }) => {
    test(testName, () => {
      const snapshot = render(
        <MemoryRouter>
          <ProfessorDisplayLink
            firstName={firstName}
            lastName={lastName}
            professorId={professorId}
          />
        </MemoryRouter>
      );
      expect(snapshot).toMatchSnapshot();
    });
  });
});
