import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Announcements from "components/Announcements";
import Professors from "components/Professors";
import ReviewForm from "components/Review";
import CulpaSidebar from "components/common/Sidebar";

function App() {
  return (
    <div>
      {/* <NavigationBar /> */}

      <Router>
        {<CulpaSidebar />}
        <Switch>
          <Route path="/review">
            <ReviewForm />
          </Route>
          <Route path="/professors">
            <Professors />
          </Route>
          <Route path="/">
            <Announcements />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
