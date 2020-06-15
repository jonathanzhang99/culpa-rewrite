import { useEffect, useReducer } from "react";

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
    case "FETCH_FALURE":
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

export default function useDataFetch(url, initialData) {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: initialData,
    isError: false,
    isLoading: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_START" });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      try {
        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE", payload: err });
      }
    };

    fetchData();
  }, [url]);
  return state;
}
