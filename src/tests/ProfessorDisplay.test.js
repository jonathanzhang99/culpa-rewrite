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
      firstName: "",
      lastName: "",
    },
    {
      testName: "renders ProfessorDisplayName as span",
      firstName: "Nakul",
      lastName: "Verma",
    },
    {
      testName: "renders ProfessorDisplayName as Header",
      firstName: "Nakul",
      lastName: "Verma",
      type: "header",
    },
  ];

  const linkTestCases = [
    {
      testName: "renders no ProfessorDisplayLink",
      firstName: "",
      lastName: "",
      professorId: 0,
    },
    {
      testName: "renders ProfessorDisplayLink as span",
      firstName: "Nakul",
      lastName: "Verma",
      professorId: 2339,
    },
    {
      testName: "renders ProfessorDisplayLink as Header",
      firstName: "Nakul",
      lastName: "Verma",
      professorId: 2339,
      type: "header",
    },
  ];

  nameTestCases.forEach(({ testName, firstName, lastName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <ProfessorDisplayName
          firstName={firstName}
          lastName={lastName}
          type={type}
        />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(
    ({ testName, firstName, lastName, professorId, type }) => {
      test(testName, () => {
        const snapshot = render(
          <MemoryRouter>
            <ProfessorDisplayLink
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
              type={type}
            />
          </MemoryRouter>
        );
        expect(snapshot).toMatchSnapshot();
      });
    }
  );
});
