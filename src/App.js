import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { AuthProvider, ProtectedRoute } from "components/common/Authentication";
import CreateReviewPage from "components/CreateReviewPage";
import DepartmentInfoPage from "components/DepartmentInfoPage";
import DepartmentsPage from "components/DepartmentsPage";
import LoginPage from "components/LoginPage";
import NavigationBar from "components/NavigationBar";
import Professors from "components/ProfessorsPage";
import ReviewsPage from "components/ReviewsPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar>
          <Switch>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <ProtectedRoute exact path="/admin">
              <h1>Admin only page!!</h1>
            </ProtectedRoute>
            <Route path="/review">
              <CreateReviewPage />
            </Route>
            <Route path="/reviews">
              <ReviewsPage/>
            </Route>
            <Route path="/professors">
              <Professors />
            </Route>
            <Route path="/departments">
              <DepartmentsPage />
            </Route>
            <Route path="/department/:departmentId">
              <DepartmentInfoPage />
            </Route>
            <Route path="/">
              <h1>Welcome to CULPA: Temporary header</h1>
            </Route>
          </Switch>
        </NavigationBar>
      </Router>
    </AuthProvider>
  );
}

export default App;
