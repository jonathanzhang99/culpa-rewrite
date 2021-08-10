import { render, fireEvent, act, screen, wait } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import CreateReviewPage from "components/CreateReviewPage";

describe("Create Review Page tests", () => {
  const serverEmptySearchResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => {
        return {
          professorResults: [],
          courseResults: [],
        };
      },
    });

  const serverProfessorResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => {
        return {
          professorResults: [
            {
              childKey: "professor-2339",
              departments: [
                {
                  id: 29,
                  name: "Computer Science",
                },
              ],
              id: 2339,
              title: "Nakul Verma",
              type: "professor",
            },
            {
              childKey: "professor-1612",
              departments: [
                {
                  id: 76,
                  name: "Political Science",
                },
              ],
              last: "true",
              id: 1612,
              title: "Lee Bollinger",
              type: "professor",
            },
          ],
          courseResults: [],
        };
      },
    });

  const serverCoursesSearchResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => {
        return {
          professorResults: [],
          courseResults: [
            {
              title: "Introduction to Computational Complexity",
              type: "course",
              id: 123,
              name: "Introduction to Computational Complexity",
              departments: [
                {
                  id: 29,
                  name: "Computer Science",
                },
              ],
            },
            {
              title: "Introduction to UI Design",
              type: "course",
              id: 1234,
              name: "Introduction to UI Design",
              departments: [
                {
                  id: 29,
                  name: "Computer Science",
                },
              ],
            },
          ],
        };
      },
    });

  const serverDepartmentsResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => {
        return {
          departments: [
            { text: "Computer Science", value: 1, key: "Computer Science" },
            { text: "Sociology", value: 2, key: "Sociology" },
          ],
        };
      },
    });

  const serverCoursesResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => {
        return {
          courses: [
            {
              text: "Machine Learning",
              value: 888,
              key: "Machine Learning",
            },
            {
              text: "Computational Learning Theory",
              value: 889,
              key: "Computational Learning Theory",
            },
          ],
        };
      },
    });

  const serverSubmissionResponse = () =>
    Promise.resolve({
      ok: true,
      json: () => {
        return { reviewId: 99 };
      },
    });

  describe("frontend interactions", () => {
    const fieldErrorLabels = [
      "Please select a professor",
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

        // waits for debouncer to fetch search results
        await wait(async () => {
          expect(await screen.getByText(/nakul verma/i)).toBeInTheDocument();
          expect(await screen.getByText(/lee bollinger/i)).toBeInTheDocument();
          expect(mockFetch).toHaveBeenCalledTimes(1);
          expect(mockFetch).toHaveBeenCalledWith(
            "/api/search?entity=professor&limit=7&query=testProfessorName",
            {
              method: "GET",
              headers: { "Content-Type": "Application/json" },
            }
          );
        });
      });

      test("no professors when query returns no data", async () => {
        mockFetch.mockImplementation(serverEmptySearchResponse);

        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          });
        });

        await wait(async () => {
          expect(
            await screen.getByText(/no professors found/i)
          ).toBeInTheDocument();
          expect(mockFetch).toHaveBeenCalledTimes(1);
          expect(mockFetch).toHaveBeenCalledWith(
            "/api/search?entity=professor&limit=7&query=testProfessorName",
            {
              method: "GET",
              headers: { "Content-Type": "Application/json" },
            }
          );
        });
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

      afterEach(() => {
        jest.clearAllMocks();
      });

      test("courses are displayed on professor select", async () => {
        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          });
        });
        await wait(() =>
          act(async () => fireEvent.click(screen.getByText(/nakul verma/i)))
        );

        expect(await screen.getByText(/machine learning/i)).toBeInTheDocument();
        expect(
          await screen.getByText(/computational learning theory/i)
        ).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenLastCalledWith(
          "/api/professor/2339/courses",
          {
            method: "GET",
            headers: { "Content-Type": "Application/json" },
          }
        );
      });

      test("courses are not displayed with no professor", async () => {
        expect(
          await screen.queryByLabelText(/course/i)
        ).not.toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
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

        await wait(async () => {
          await act(async () =>
            fireEvent.click(screen.getByText(/nakul verma/i))
          );

          await act(async () => {
            fireEvent.click(screen.getByText(/machine learning/i));
            fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
              target: { value: "this class was great!!!" },
            });
            fireEvent.input(
              screen.getByRole("textbox", { name: /workload/i }),
              {
                target: { value: "suffered so much!!!" },
              }
            );
            fireEvent.click(
              screen.getByLabelText(
                /Both negatives and positives much like life itself/i
              )
            );
          });
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
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: { title: "Nakul Verma", id: 2339 },
            content: "this class was great!!!",
            workload: "suffered so much!!!",
            evaluation: 3,
            course: 888,
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
          expect(await screen.getByText(errorLabel)).toBeInTheDocument();
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
      afterEach(() => jest.resetAllMocks());

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

        await wait(async () => {
          await act(async () =>
            fireEvent.click(screen.getByText(/nakul verma/i))
          );

          await act(async () => {
            fireEvent.click(screen.getByText(/machine learning/i));
            fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
              target: { value: "this class was great!!!" },
            });
            fireEvent.input(
              screen.getByRole("textbox", { name: /workload/i }),
              {
                target: { value: "suffered so much!!!" },
              }
            );
            fireEvent.click(
              screen.getByLabelText(
                /Both negatives and positives much like life itself/i
              )
            );
          });
        });
      });

      test("fields can change after initial validation", async () => {
        // first open and close the modal
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getByRole("button", { name: /edit review/i }))
        );

        // change all fields to new values. Professors need to be changed in two
        // steps because the first input resets the input box.
        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "l" },
          });
        });

        await act(async () => {
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "ee boll" },
          });
        });

        await wait(() =>
          act(async () => fireEvent.click(screen.getByText(/lee bollinger/i)))
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
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: { title: "Lee Bollinger", id: 1612 },
            content: "why tf is bollinger teaching clt",
            workload: "too many case studies not enough chernoff-hoeffding",
            evaluation: 1,
            course: 889,
          }),
          headers: { "Content-Type": "application/json" },
        });
      });
    });

    describe("Add professor and course", () => {
      const fillFormCommon = () => {
        fireEvent.input(screen.getByRole("textbox", { name: /content/i }), {
          target: { value: "new professor review content" },
        });
        fireEvent.input(screen.getByRole("textbox", { name: /workload/i }), {
          target: {
            value: "new professor workload",
          },
        });
        fireEvent.click(
          screen.getByLabelText("A Columbia gem. Life-changing moments await")
        );
      };

      afterEach(() => jest.resetAllMocks());

      test("adding new professor and existing course", async () => {
        const mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverEmptySearchResponse)
          .mockImplementationOnce(serverDepartmentsResponse)
          .mockImplementationOnce(serverCoursesSearchResponse)
          .mockImplementationOnce(serverSubmissionResponse);

        // search for professor
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        // unable to find professor so add new professor
        await wait(() =>
          act(async () =>
            fireEvent.click(
              screen.getByText(/no professors found\. add new professor/i)
            )
          )
        );

        // fill in new professor information
        await act(async () => {
          fireEvent.input(
            screen.getByRole("textbox", { name: /new professor first name/i }),
            { target: { value: "newProfessorFirstName" } }
          );
          fireEvent.input(
            screen.getByRole("textbox", { name: /new professor last name/i }),
            { target: { value: "newProfessorLastName" } }
          );
          fireEvent.input(
            screen.getByRole("textbox", { name: /new professor uni/i }),
            { target: { value: "newProfessorUni" } }
          );
          fireEvent.click(screen.getByText(/sociology/i));
        });

        await act(async () =>
          // search for an existing course for professor
          fireEvent.input(
            screen.getByRole("textbox", {
              name: /select a course to review for the new professor/i,
            }),
            { target: { value: "newProfessorCourseSearch" } }
          )
        );

        // select course to review and fill out the rest of form
        await wait(() =>
          act(async () =>
            fireEvent.click(screen.getByText(/introduction to ui design/i))
          )
        );

        await act(async () => fillFormCommon());
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getAllByRole("button", { name: /submit/i })[1])
        );

        expect(mockFetch).toHaveBeenCalledTimes(4);
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: {
              title: "No professors found. Add new professor?",
              id: -1,
            },
            content: "new professor review content",
            workload: "new professor workload",
            evaluation: 5,
            newProfessor: {
              first_name: "newProfessorFirstName",
              last_name: "newProfessorLastName",
              uni: "newProfessorUni",
              department: 2,
              course: { title: "Introduction to UI Design", id: 1234 },
            },
          }),
          headers: { "Content-Type": "application/json" },
        });
      });

      test("adding new professor and new course", async () => {
        const mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverEmptySearchResponse)
          .mockImplementationOnce(serverDepartmentsResponse)
          .mockImplementationOnce(serverEmptySearchResponse)
          .mockImplementationOnce(serverSubmissionResponse);
        // search for professor
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        // unable to find professor so add new professor
        await wait(() =>
          act(async () =>
            fireEvent.click(
              screen.getByText(/no professors found\. add new professor/i)
            )
          )
        );

        // fill in new professor information
        await act(async () => {
          fireEvent.input(
            screen.getByRole("textbox", { name: /new professor first name/i }),
            { target: { value: "newProfessorFirstName" } }
          );
          fireEvent.input(
            screen.getByRole("textbox", { name: /new professor last name/i }),
            { target: { value: "newProfessorLastName" } }
          );
          fireEvent.input(
            screen.getByRole("textbox", { name: /new professor uni/i }),
            { target: { value: "newProfessorUni" } }
          );
          fireEvent.click(screen.getByText(/sociology/i));
        });

        await act(async () => {
          // search for course
          fireEvent.input(
            screen.getByRole("textbox", {
              name: /select a course to review for the new professor/i,
            }),
            { target: { value: "newProfessorCourseSearch" } }
          );
        });

        // unable to find course so add new course
        await wait(async () =>
          act(() =>
            fireEvent.click(
              screen.getByText(/no courses found\. add new course/i)
            )
          )
        );

        // fill out new course information
        await act(async () => {
          fireEvent.input(
            screen.getByRole("textbox", { name: /new course name/i }),
            { target: { value: "newCourseName" } }
          );
          fireEvent.input(
            screen.getByRole("textbox", { name: /new course code/i }),
            { target: { value: "newCourseCode" } }
          );
          fireEvent.click(screen.getAllByText(/sociology/i)[2]);
          fillFormCommon();
        });

        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getAllByRole("button", { name: /submit/i })[1])
        );

        expect(mockFetch).toHaveBeenCalledTimes(4);
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: {
              title: "No professors found. Add new professor?",
              id: -1,
            },
            content: "new professor review content",
            workload: "new professor workload",
            evaluation: 5,
            newProfessor: {
              first_name: "newProfessorFirstName",
              last_name: "newProfessorLastName",
              uni: "newProfessorUni",
              department: 2,
              course: { title: "No courses found. Add new course?", id: -1 },
            },
            newCourse: {
              name: "newCourseName",
              code: "newCourseCode",
              department: 2,
            },
          }),
          headers: { "Content-Type": "application/json" },
        });
      });

      test("adding existing professor and existing course", async () => {
        const mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverProfessorResponse)
          .mockImplementationOnce(serverCoursesResponse)
          .mockImplementationOnce(serverCoursesSearchResponse)
          .mockImplementationOnce(serverSubmissionResponse);

        // search for professor
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        // select professor
        await wait(() =>
          act(async () => fireEvent.click(screen.getByText(/nakul verma/i)))
        );

        // unable to find course so search for existing course
        await act(async () =>
          fireEvent.click(screen.getByText(/course not listed\. add course/i))
        );

        // search for course
        await act(async () =>
          fireEvent.input(
            screen.getByRole("textbox", { name: /select course/i }),
            {
              target: { value: "courseSearchInput" },
            }
          )
        );

        // select course
        await wait(() =>
          act(async () =>
            fireEvent.click(
              screen.getByText(/introduction to computational complexity/i)
            )
          )
        );

        await act(async () => fillFormCommon());
        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getAllByRole("button", { name: /submit/i })[1])
        );

        expect(mockFetch).toHaveBeenCalledTimes(4);
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: {
              title: "Nakul Verma",
              id: 2339,
            },
            content: "new professor review content",
            workload: "new professor workload",
            evaluation: 5,
            course: -1,
            newCourse: {
              search: {
                title: "Introduction to Computational Complexity",
                id: 123,
              },
            },
          }),
          headers: { "Content-Type": "application/json" },
        });
      });

      test("adding existing professor and new course", async () => {
        const mockFetch = jest.spyOn(global, "fetch");
        mockFetch
          .mockImplementationOnce(serverProfessorResponse)
          .mockImplementationOnce(serverCoursesResponse)
          .mockImplementationOnce(serverEmptySearchResponse)
          .mockImplementationOnce(serverDepartmentsResponse)
          .mockImplementationOnce(serverSubmissionResponse);
        // search for professor
        await act(async () =>
          fireEvent.input(screen.getByRole("textbox", { name: /professor/i }), {
            target: { value: "testProfessorName" },
          })
        );

        // unable to find professor so add new professor
        await wait(() =>
          act(async () => fireEvent.click(screen.getByText(/nakul verma/i)))
        );

        await act(async () =>
          fireEvent.click(screen.getByText(/course not listed\. add course/i))
        );

        // search for course
        await act(async () =>
          fireEvent.input(
            screen.getByRole("textbox", { name: /select course/i }),
            {
              target: { value: "courseSearchInput" },
            }
          )
        );

        // select add course
        await wait(() =>
          act(async () =>
            fireEvent.click(
              screen.getByText(/no courses found\. add new course/i)
            )
          )
        );

        // fill out new course information
        await act(async () => {
          fireEvent.input(
            screen.getByRole("textbox", { name: /new course name/i }),
            { target: { value: "newCourseName" } }
          );
          fireEvent.input(
            screen.getByRole("textbox", { name: /new course code/i }),
            { target: { value: "newCourseCode" } }
          );
          fireEvent.click(screen.getByText(/sociology/i));
          fillFormCommon();
        });

        await act(async () => fireEvent.click(screen.getByRole("button")));
        await act(async () =>
          fireEvent.click(screen.getAllByRole("button", { name: /submit/i })[1])
        );

        expect(mockFetch).toHaveBeenCalledTimes(5);
        expect(mockFetch).toHaveBeenLastCalledWith("/api/review/submit", {
          method: "POST",
          body: JSON.stringify({
            professor: {
              title: "Nakul Verma",
              id: 2339,
            },
            content: "new professor review content",
            workload: "new professor workload",
            evaluation: 5,
            course: -1,
            newCourse: {
              search: { title: "No courses found. Add new course?", id: -1 },
              name: "newCourseName",
              code: "newCourseCode",
              department: 2,
            },
          }),
          headers: { "Content-Type": "application/json" },
        });
      });
    });
  });
});
