import { render, fireEvent, act, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "components/common/Authentication";
import NavigationBar from "components/NavigationBar";

describe("Navbar Component Tests", () => {
  const professorAndCourseResults = {
    professorResults: [
      {
        childKey: "professor-2339",
        departments: [
          {
            id: 29,
            name: "Computer Science",
          },
        ],
        last: "true",
        id: 2339,
        title: "Nakul Verma",
        type: "professor",
      },
    ],
    courseResults: [
      {
        childKey: "course-1",
        departments: [
          {
            id: 6,
            name: "Computer Science",
          },
        ],
        id: 1,
        title: "User Interface Design",
        type: "course",
      },
    ],
  };

  const onlyProfessorResults = {
    professorResults: [
      {
        childKey: "professor-2339",
        departments: [
          {
            id: 29,
            name: "Computer Science",
          },
        ],
        last: "true",
        id: 2339,
        title: "Nakul Verma",
        type: "professor",
      },
    ],
    courseResults: [],
  };

  const onlyCourseResults = {
    professorResults: [],
    courseResults: [
      {
        childKey: "course-1",
        departments: [
          {
            id: 6,
            name: "Computer Science",
          },
        ],
        id: 1,
        title: "User Interface Design",
        type: "course",
      },
    ],
  };

  const noResults = {
    professorResults: [],
    courseResults: [],
  };

  const serverFoundProfessorAndCourseResults = () =>
    Promise.resolve({
      ok: true,
      json: () => professorAndCourseResults,
    });

  const serverFoundOnlyProfessorResults = () =>
    Promise.resolve({
      ok: true,
      json: () => onlyProfessorResults,
    });

  const serverFoundOnlyCourseResults = () =>
    Promise.resolve({
      ok: true,
      json: () => onlyCourseResults,
    });

  const serverFoundNoResults = () =>
    Promise.resolve({
      ok: true,
      json: () => noResults,
    });

  test("should render", () => {
    const snapshot = render(
      <AuthProvider>
        <MemoryRouter>
          <NavigationBar />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(snapshot).toMatchSnapshot();
  });

  describe("searchbar interactions", () => {
    let mockFetch;

    beforeEach(() => {
      mockFetch = jest.spyOn(global, "fetch");
      render(
        <AuthProvider>
          <MemoryRouter>
            <NavigationBar />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    afterEach(() => jest.resetAllMocks());

    test("both professor and course results found", async () => {
      mockFetch.mockImplementation(serverFoundProfessorAndCourseResults);

      await act(async () => {
        fireEvent.input(screen.getByRole("textbox"), {
          target: { value: "testSearchValue" },
        });
      });

      expect(await screen.getByText(/nakul verma/i)).toBeInTheDocument();
      expect(
        await screen.getByText(/user interface design/i)
      ).toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search?entity=all&query=testSearchValue&limit=5",
        {
          method: "GET",
          headers: { "Content-Type": "Application/json" },
        }
      );
    });

    test("only professor results found", async () => {
      mockFetch.mockImplementation(serverFoundOnlyProfessorResults);

      await act(async () => {
        fireEvent.input(screen.getByRole("textbox"), {
          target: { value: "testSearchValue" },
        });
      });

      expect(await screen.getByText(/nakul verma/i)).toBeInTheDocument();
      expect(
        await screen.queryByText(/user interface design/i)
      ).not.toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search?entity=all&query=testSearchValue&limit=5",
        {
          method: "GET",
          headers: { "Content-Type": "Application/json" },
        }
      );
    });

    test("only course results found", async () => {
      mockFetch.mockImplementation(serverFoundOnlyCourseResults);

      await act(async () => {
        fireEvent.input(screen.getByRole("textbox"), {
          target: { value: "testSearchValue" },
        });
      });

      expect(await screen.queryByText(/nakul verma/i)).not.toBeInTheDocument();
      expect(
        await screen.getByText(/user interface design/i)
      ).toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search?entity=all&query=testSearchValue&limit=5",
        {
          method: "GET",
          headers: { "Content-Type": "Application/json" },
        }
      );
    });

    test("no results found", async () => {
      mockFetch.mockImplementation(serverFoundNoResults);

      await act(async () => {
        fireEvent.input(screen.getByRole("textbox"), {
          target: { value: "testSearchValue" },
        });
      });

      expect(await screen.queryByText(/nakul verma/i)).not.toBeInTheDocument();
      expect(
        await screen.queryByText(/user interface design/i)
      ).not.toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search?entity=all&query=testSearchValue&limit=5",
        {
          method: "GET",
          headers: { "Content-Type": "Application/json" },
        }
      );
    });
  });
});
