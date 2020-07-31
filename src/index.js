import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

ReactDOM.render(
  // Removing StrictMode for now (7.13.2020) since Semantic-UI (v0.88.2) still relies
  // on deprecated technologies that will throw warnings that are currently unfixable.
  //
  // PLEASE UPDATE SEMANTIC-UI IN THE FUTURE
  //
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById("root")
);
