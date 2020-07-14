import { render, fireEvent, act, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import Login from "components/Login";

describe("Login Component Tests", () => {
  const loginSuccess = jest.fn(() => {
    Promise.resolve();
  });

  const loginFailure = jest.fn(() => {
    return Promise.resolve("oops something broke!");
  });

  test("should render", () => {
    const snapshot = render(
      <AuthContext.Provider value={{ login: loginSuccess }}>
        <Login />
      </AuthContext.Provider>
    );
    expect(snapshot).toMatchSnapshot();
  });

  describe("server Login Successful", () => {
    jest.mock("react-router-dom");

    beforeEach(() => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ login: loginSuccess }}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    test("should fail when submission without", async () => {
      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });
      expect(await screen.getByText(/missing username/i)).toBeTruthy();
      expect(await screen.getByText(/missing password/i)).toBeTruthy();
      expect(loginSuccess).not.toBeCalled();
    });

    test("should error when submission without username", async () => {
      await act(async () => {
        fireEvent.input(screen.getByRole("textbox", { name: /username/i }), {
          target: {
            value: "test",
          },
        });
        fireEvent.submit(screen.getByRole("button"));
      });
      expect(await screen.getByText(/missing password/i)).toBeTruthy();
      expect(screen.getByRole("textbox", { name: /username/i }).value).toBe(
        "test"
      );
      expect(loginSuccess).not.toBeCalled();
    });

    test("should error whens ubmission without password", async () => {
      await act(async () => {
        fireEvent.input(screen.getByLabelText(/password/i), {
          target: {
            value: "password",
          },
        });
        fireEvent.submit(screen.getByRole("button"));
      });
      expect(await screen.getByText(/missing username/i)).toBeTruthy();
      expect(screen.getByLabelText(/password/i).value).toBe("password");
      expect(loginSuccess).not.toBeCalled();
    });

    test("should login properly if valid", async () => {
      await act(async () => {
        fireEvent.input(screen.getByRole("textbox", { name: /username/i }), {
          target: {
            value: "test",
          },
        });
        fireEvent.input(screen.getByLabelText(/password/i), {
          target: {
            value: "password",
          },
        });
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(loginSuccess).toHaveBeenCalledWith({
        username: "test",
        password: "password",
      });
    });
  });
  describe("server Login unsuccesful", () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ login: loginFailure }}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });
    test("should throw error when improperly authenticated", async () => {
      await act(async () => {
        fireEvent.input(screen.getByRole("textbox", { name: /username/i }), {
          target: {
            value: "test",
          },
        });
        fireEvent.input(screen.getByLabelText(/password/i), {
          target: {
            value: "password",
          },
        });
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(await screen.getByText("oops something broke!")).toBeTruthy();
      expect(loginFailure).toHaveBeenCalledWith({
        username: "test",
        password: "password",
      });
    });
  });
});
