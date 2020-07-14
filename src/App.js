import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { AuthProvider } from "components/common/Authentication";
import Login from "components/Login";
import Professors from "components/Professors";
import ReviewForm from "components/Review";

function App() {
  return (
    <Container>
      <AuthProvider>
        {/* <NavigationBar /> */}
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route path="/review">
              <ReviewForm />
            </Route>
            <Route path="/professors">
              <Professors />
            </Route>
            <Route path="/">
              <div>
                <h1>Welcome to CULPA: Temporary header</h1>
              </div>
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </Container>
  );
}

export default App;
