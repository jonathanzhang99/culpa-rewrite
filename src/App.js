import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { AuthProvider, ProtectedRoute } from "components/common/Authentication";
import Sidebar from "components/common/Sidebar";
import ReviewForm from "components/CreateReviewPage";
import Login from "components/LoginPage";
import NavigationBar from "components/NavigationBar";
import Professors from "components/ProfessorsPage";

function Routes() {
  return (
    <div>
      <Route exact path="/login">
        <Login />
      </Route>
      <ProtectedRoute exact path="/admin">
        <div>
          <h1>Admin only page!!</h1>
        </div>
      </ProtectedRoute>
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
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <NavigationBar />
          <Switch>
            {/* <NavigationBar /> */}
            <Sidebar children={Routes()}/>
          </Switch>
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
