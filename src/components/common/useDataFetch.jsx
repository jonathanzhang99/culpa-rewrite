import { useContext, useEffect, useReducer } from "react";

import { AuthContext } from "components/common/Authentication";

function dataFetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isError: false,
        isLoading: true,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    default:
      throw new Error();
  }
}

/**
 * This hook is the main way to fetch api data from the backend. The local
 * state will store all retrieved data. If the parent AuthContext holds a
 * userToken, it will automatically be passed along and automatically removed
 * if the server throws an error on the token.
 *
 * @param {string} url - the endpoint from where to fetch data
 * @param {Object} initialData - default data to display while loading
 */
export default function useDataFetch(url, initialData) {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: initialData,
    isError: false,
    isLoading: false,
  });
  const { authToken, isLoggedIn, logout } = useContext(AuthContext);

  useEffect(() => {
    const getHeaders = () => {
      const headers = {
        Accept: "application/json",
      };

      if (isLoggedIn) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      return headers;
    };

    const fetchData = async () => {
      dispatch({ type: "FETCH_START" });

      const headers = getHeaders();
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      try {
        const results = await response.json();

        if (!response.ok) {
          const authErrorCodes = [401, 403, 422];
          if (authErrorCodes.includes(response.status)) {
            logout(results.error);
          }

          dispatch({ type: "FETCH_FAILURE", payload: results.error });
        } else {
          dispatch({ type: "FETCH_SUCCESS", payload: results });
        }
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE", payload: err });
      }
    };

    fetchData();
  }, [authToken, isLoggedIn, logout, url]);

  return state;
}
