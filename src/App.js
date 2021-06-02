import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import AdminDashboardPage from "components/admin/AdminDashboardPage";
import { AuthProvider, ProtectedRoute } from "components/common/Authentication";
import ScrollToTop from "components/common/ScrollToTop";
import CourseInfoPage from "components/CourseInfoPage";
import CreateReviewPage from "components/CreateReviewPage";
import DepartmentInfoPage from "components/DepartmentInfoPage";
import DepartmentsPage from "components/DepartmentsPage";
import HomePage from "components/HomePage";
import LoginPage from "components/LoginPage";
import NavigationBar from "components/NavigationBar";
import ProfessorInfoPage from "components/ProfessorInfoPage";
import SearchResultsPage from "components/SearchResultsPage";
import SingleReviewPage from "components/SingleReviewPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <NavigationBar>
          <Switch>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <ProtectedRoute exact path="/admin">
              <AdminDashboardPage />
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
              <HomePage />
            </Route>
          </Switch>
        </NavigationBar>
      </Router>
    </AuthProvider>
  );
}

export default App;
