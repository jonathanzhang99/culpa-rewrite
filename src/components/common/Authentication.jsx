import PropTypes from "prop-types";
import React, { useContext, useReducer } from "react";
import { Route, Redirect } from "react-router-dom";

export const AuthContext = React.createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        isError: true,
        isLoading: false,
      };

    case "LOGIN_SUCCESS":
      localStorage.setItem("authToken", JSON.stringify(action.payload));
      return {
        ...state,
        isError: false,
        isLoading: false,
        isLoggedIn: true,
        authToken: action.payload,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        isError: false,
        isLoading: false,
        isLoggedIn: false,
      };
    case "LOGOUT_SUCCESS":
      localStorage.removeItem("authToken");
      return {
        ...state,
        isError: false,
        isLoading: false,
        isLoggedIn: false,
        authToken: undefined,
      };
    default:
      throw new Error();
  }
}

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

/**
 * AuthProvider createa React Context with values such that children elements
 * in the tree can access user auth token and manipulate them
 * (e.g. login, logout)
 *
 */
export function AuthProvider({ children }) {
  const existingToken = JSON.parse(localStorage.getItem("authToken"));

  const [state, dispatch] = useReducer(authReducer, {
    isError: false,
    isLoading: false,
    isLoggedIn: !!existingToken,
    authToken: existingToken,
  });

  // `login` either returns an error or null if a token was succesfully
  // retrieved. The error will always be a string message
  const login = async ({ username, password }) => {
    dispatch({ type: "LOGIN_START" });
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const result = await response.json();

      // Require that the backend sends either a token or an error
      result.error
        ? dispatch({ type: "LOGIN_FAILURE" })
        : dispatch({ type: "LOGIN_SUCCESS", payload: result.token });
      return result;
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR" });
      return err;
    }
  };

  // `logout` simply removes the token from the client. It does NOT
  // expire the token.
  const logout = async () => {
    if (state.authToken) {
      dispatch({ type: "LOGOUT_SUCCESS" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = propTypes;

/**
 * ProtectedRoute allows access to the url only if a user is logged in.
 *
 */
export function ProtectedRoute(props) {
  const { isLoggedIn } = useContext(AuthContext);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return isLoggedIn ? <Route {...props} /> : <Redirect to="/" />;
}
