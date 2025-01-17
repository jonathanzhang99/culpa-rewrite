import { render, fireEvent, act, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import Login from "components/LoginPage";

describe("Login Component Tests", () => {
  const loginSuccess = jest.fn(() => Promise.resolve({ token: "aaa.bbb.ccc" }));

  const loginFailure = jest.fn(() =>
    Promise.resolve({ error: "oops something broke!" })
  );

  test("should render", () => {
    const snapshot = render(
      <AuthContext.Provider value={{ login: loginSuccess }}>
        <Login />
      </AuthContext.Provider>
    );
    expect(snapshot).toMatchSnapshot();
  });

  describe("server Login Successful", () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ login: loginSuccess }}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    test("should error when submission without inputs", async () => {
      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });
      expect(await screen.getByText(/missing username/i)).toBeInTheDocument();
      expect(await screen.getByText(/missing password/i)).toBeInTheDocument();
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
      expect(await screen.getByText(/missing password/i)).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /username/i }).value).toBe(
        "test"
      );
      expect(loginSuccess).not.toBeCalled();
    });

    test("should error when submission without password", async () => {
      await act(async () => {
        fireEvent.input(screen.getByLabelText(/password/i), {
          target: {
            value: "password",
          },
        });
        fireEvent.submit(screen.getByRole("button"));
      });
      expect(await screen.getByText(/missing username/i)).toBeInTheDocument();
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
    test("should error when improperly authenticated", async () => {
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

      expect(
        await screen.getByText("oops something broke!")
      ).toBeInTheDocument();
      expect(loginFailure).toHaveBeenCalledWith({
        username: "test",
        password: "password",
      });
    });
  });
});
