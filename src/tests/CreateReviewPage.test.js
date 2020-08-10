import { render, fireEvent, act, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import CreateReviewPage from "components/CreateReviewPage";

describe("Create Review Page tests", () => {
  const serverProfessorResponseJson = {
    // TODO (Sungbin): please change this to match
    searchResults: [
      {
        title: "Nakul Verma",
        description: "ml",
        content: "testContent1",
      },
      {
        title: "Lee Bollinger",
        description: "law",
        content: "testContent2",
      },
    ],
  };

  const serverCoursesResponseJson = {
    courses: [
      { text: "Machine Learning", value: 888, key: "Machine Learning" },
      {
        text: "Computational Learning Theory",
        value: 889,
        key: "Computational Learning Theory",
      },
    ],
  };

  const serverSubmissionResponseJson = { reviewId: 99 };

  const serverProfessorResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => serverProfessorResponseJson,
    });

  const serverCoursesResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => serverCoursesResponseJson,
    });

  const serverSubmissionResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => serverSubmissionResponseJson,
    });

  test("should render", () => {
    const snapshot = render(<CreateReviewPage />);
    expect(snapshot).toMatchSnapshot();
  });

  describe("frontend interactions", () => {
    const fieldErrorLabels = [
      "Please select a professor",
      "Please select a matching course",
      "Please describe the professor and course",
      "Please describe the workload",
    ];

    beforeEach(() => {
      render(
        <MemoryRouter>
          <CreateReviewPage />
        </MemoryRouter>
      );
    });

    test("empty fields display error and lack of modal", async () => {
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      fieldErrorLabels.forEach(async (errorLabel) => {
        expect(await screen.getByText(errorLabel)).toBeInTheDocument();
      });
      expect(
        await screen.queryByText(/Are you sure you want to submit this review/i)
      ).not.toBeInTheDocument();
    });

    describe("select a professor", () => {
      let mockFetch;

      beforeEach(() => {
        mockFetch = jest.spyOn(global, "fetch");
        mockFetch.mockImplementation(serverProfessorResponse);
      });

      afterEach(() => jest.resetAllMocks());

      test("professor query too short", async () => {
        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "a" },
          });
        });
        expect(
          await screen.getByText(/no professors found/i)
        ).toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
      });

      test("valid professor query", async () => {
        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          });
        });

        expect(await screen.getByText(/nakul verma/i)).toBeInTheDocument();
        expect(await screen.getByText(/lee bollinger/i)).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/search?searchEntity=professors&query=testProfessorName",
          {
            method: "GET",
            headers: { "Content-Type": "Application/json" },
          }
        );
      });

      test("no professors when query returns no data", async () => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => {
              return { searchResults: [] };
            },
          })
        );

        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          });
        });
        expect(
          await screen.getByText(/no professors found/i)
        ).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/search?searchEntity=professors&query=testProfessorName",
          {
            method: "GET",
            headers: { "Content-Type": "Application/json" },
          }
        );
      });
    });

    describe("select a course", () => {
      let mockFetch;

      beforeEach(() => {
        mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverProfessorResponse)
          .mockImplementationOnce(serverCoursesResponse);
      });

      afterEach(() => jest.clearAllMocks());

      test("courses are not displayed with no professor", async () => {
        expect(
          await screen.getByText(/please select a professor first/i)
        ).toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
      });

      test("courses are displayed on professor select", async () => {
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        await act(async () =>
          fireEvent.click(screen.getByText(/nakul verma/i))
        );

        expect(await screen.getByText(/machine learning/i)).toBeInTheDocument();
        expect(
          await screen.getByText(/computational learning theory/i)
        ).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(2);
        // TODO: (Sungbin, JZ) the following line will not properly run without defining the
        // backend data format for Search Results
        // expect(mockFetch).toHaveBeenLastCalledWith("/api/professor/1/courses", {
        //   method: "GET",
        //   headers: { "Content-Type": "Application/json" },
        // });
      });
    });

    describe("on valid form inputs", () => {
      let mockFetch;

      beforeEach(async () => {
        mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverProfessorResponse)
          .mockImplementationOnce(serverCoursesResponse)
          .mockImplementationOnce(serverSubmissionResponse);

        /**
         * Fill out form with fake data
         *
         * professor: "nakul verma",
         * course: "Machine Learning",
         * content: "this class was great!!!",
         * workload: "suffered so much!!!",
         * evaluation: 3
         *
         */
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        await act(async () =>
          fireEvent.click(screen.getByText(/nakul verma/i))
        );

        await act(async () => {
          fireEvent.click(screen.getByText(/machine learning/i));
          fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
            target: { value: "this class was great!!!" },
          });
          fireEvent.input(screen.getByRole("textbox", { name: /workload/i }), {
            target: { value: "suffered so much!!!" },
          });
          fireEvent.click(
            screen.getByLabelText(
              /Both negatives and positives much like life itself/i
            )
          );
        });
      });

      afterEach(() => jest.resetAllMocks());

      test("no errors are shown", async () => {
        await act(async () => {
          fireEvent.click(screen.getByRole("button"));
        });

        fieldErrorLabels.forEach(async (errorLabel) => {
          expect(await screen.queryByText(errorLabel)).not.toBeInTheDocument();
        });
        // expect submission to not have been called
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      test("modal appears", async () => {
        await act(async () => {
          fireEvent.click(screen.getByRole("button"));
        });

        expect(
          await screen.queryByText(
            /Are you sure you want to submit this review/i
          )
        ).toBeInTheDocument();
      });

      test("properly submits data", async () => {
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getAllByRole("button", { name: /submit/i })[1])
        );
        expect(mockFetch).toHaveBeenCalledTimes(3);
        // TODO (Sungbin): Change to match backend
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: {
              title: "Nakul Verma",
              description: "ml",
              content: "testContent1",
            },
            course: 888,
            content: "this class was great!!!",
            workload: "suffered so much!!!",
            evaluation: 3,
          }),
          headers: { "Content-Type": "application/json" },
        });
      });

      test("modal can be closed", async () => {
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getByRole("button", { name: /edit review/i }))
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(
          await screen.queryByText(
            /Are you sure you want to submit this review/i
          )
        ).not.toBeInTheDocument();
      });

      test("fields can be revalidated after initial validation", async () => {
        // first open and close the modal
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getByRole("button", { name: /edit review/i }))
        );

        // reset all fields
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "" },
          })
        );

        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
            target: { value: "" },
          });
          fireEvent.input(screen.getByRole("textbox", { name: /workload/i }), {
            target: { value: "" },
          });
          await act(async () => fireEvent.click(screen.getByRole("button")));
        });

        fieldErrorLabels.forEach(async (errorLabel) => {
          // TODO BUG (JZ): Currently, the form does not support resetting the course
          if (errorLabel !== "Please select a matching course") {
            expect(await screen.getByText(errorLabel)).toBeInTheDocument();
          }
        });
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });

    /**
     * This test ensures that the user can edit their review and change
     * any of the valid fields.
     */
    describe("change inputs after initial validation", () => {
      let mockFetch;

      beforeEach(async () => {
        mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverProfessorResponse)
          .mockImplementationOnce(serverCoursesResponse)
          .mockImplementationOnce(serverProfessorResponse)
          .mockImplementationOnce(serverCoursesResponse)
          .mockImplementationOnce(serverSubmissionResponse);

        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        await act(async () =>
          fireEvent.click(screen.getByText(/nakul verma/i))
        );

        await act(async () => {
          fireEvent.click(screen.getByText(/machine learning/i));
          fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
            target: { value: "this class was great!!!" },
          });
          fireEvent.input(screen.getByRole("textbox", { name: /workload/i }), {
            target: { value: "suffered so much!!!" },
          });
          fireEvent.click(
            screen.getByLabelText(
              /Both negatives and positives much like life itself/i
            )
          );
        });
      });

      test("fields can changed after initial validation", async () => {
        // first open and close the modal
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getByRole("button", { name: /edit review/i }))
        );

        // change all fields to new values
        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "anotherTestProfessor" },
          });
        });

        await act(async () =>
          fireEvent.click(screen.getByText(/lee bollinger/i))
        );

        await act(async () => {
          fireEvent.click(screen.getByText(/computational learning theory/i));
          fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
            target: { value: "why tf is bollinger teaching clt" },
          });
          fireEvent.input(screen.getByRole("textbox", { name: /workload/i }), {
            target: {
              value: "too many case studies not enough chernoff-hoeffding",
            },
          });
          fireEvent.click(
            screen.getByLabelText(
              "One of the worst experiences at Columbia. Avoid at all costs"
            )
          );
        });
        await act(async () => fireEvent.click(screen.getByRole("button")));

        // no errors should be present
        fieldErrorLabels.forEach(async (errorLabel) => {
          expect(await screen.queryByText(errorLabel)).not.toBeInTheDocument();
        });

        // submit the modal confirmation
        await act(async () =>
          fireEvent.click(screen.getAllByRole("button", { name: /submit/i })[1])
        );
        expect(mockFetch).toHaveBeenCalledTimes(5);
        // TODO (Sungbin): Change to match backend
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: {
              title: "Lee Bollinger",
              description: "law",
              content: "testContent2",
            },
            course: 889,
            content: "why tf is bollinger teaching clt",
            workload: "too many case studies not enough chernoff-hoeffding",
            evaluation: 1,
          }),
          headers: { "Content-Type": "application/json" },
        });
      });
    });
  });
});
