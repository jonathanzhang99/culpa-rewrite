import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { AuthProvider, ProtectedRoute } from "components/common/Authentication";
import CourseInfoPage from "components/CourseInfoPage";
import CreateReviewPage from "components/CreateReviewPage";
import DepartmentInfoPage from "components/DepartmentInfoPage";
import DepartmentsPage from "components/DepartmentsPage";
import LoginPage from "components/LoginPage";
import NavigationBar from "components/NavigationBar";
import ProfessorInfoPage from "components/ProfessorInfoPage";
import SearchResultsPage from "components/SearchResultsPage";
import SingleReviewPage from "components/SingleReviewPage"

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
            <Route exact path="/review/submit">
              <CreateReviewPage />
            </Route>
            <Route path="/review/:reviewId">
              <SingleReviewPage />
            </Route>
            <Route path="/professor/:professorId">
              <ProfessorInfoPage />
            </Route>
            <Route path="/course/:courseId">
              <CourseInfoPage />
            </Route>
            <Route path="/departments">
              <DepartmentsPage />
            </Route>
            <Route path="/department/:departmentId">
              <DepartmentInfoPage />
            </Route>
            <Route path="/search">
              <SearchResultsPage />
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
