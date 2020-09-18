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
      testName: "renders no ProfessorDisplayName",
      fullName: "",
    },
    {
      testName: "renders ProfessorDisplayName as span",
      firstName: "Nakul",
      lastName: "Verma",
    },
    {
      testName: "renders ProfessorDisplayName as span",
      fullName: "Nakul Verma",
    },
    {
      testName: "renders ProfessorDisplayName as Header",
      as: "header",
      firstName: "Nakul",
      lastName: "Verma",
    },
    {
      testName: "renders ProfessorDisplayName as Header",
      as: "header",
      fullName: "Nakul Verma",
    },
    {
      testName: "renders ProfessorDisplayName with Gold Nugget",
      badges: [1],
      fullName: "Nakul Verma",
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
      testName: "renders no ProfessorDisplayLink",
      fullName: "",
      professorId: 0,
    },
    {
      testName: "renders ProfessorDisplayLink as span",
      firstName: "Nakul",
      lastName: "Verma",
      professorId: 2339,
    },
    {
      testName: "renders ProfessorDisplayLink as span",
      fullName: "Nakul Verma",
      professorId: 2339,
    },
    {
      testName: "renders ProfessorDisplayLink as Header",
      as: "header",
      firstName: "Nakul",
      lastName: "Verma",
      professorId: 2339,
    },
    {
      testName: "renders ProfessorDisplayLink as Header",
      as: "header",
      fullName: "Nakul Verma",
      professorId: 2339,
    },
    {
      testName: "renders ProfessorDisplayLink with Gold Nugget",
      badges: [1],
      fullName: "Nakul Verma",
      professorId: 2339,
    },
  ];

  nameTestCases.forEach(({ testName, badges, firstName, lastName, type }) => {
    test(testName, () => {
      const snapshot = render(
        <ProfessorDisplayName
          badges={badges}
          firstName={firstName}
          lastName={lastName}
          type={type}
        />
      );
      expect(snapshot).toMatchSnapshot();
    });
  });

  linkTestCases.forEach(
    ({ testName, badges, firstName, lastName, professorId, type }) => {
      test(testName, () => {
        const snapshot = render(
          <MemoryRouter>
            <ProfessorDisplayLink
              badges={badges}
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
