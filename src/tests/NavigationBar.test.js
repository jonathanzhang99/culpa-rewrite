import { render } from '@testing-library/react';
import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';


import { AuthProvider, ProtectedRoute } from 'components/common/Authentication';
import ReviewForm from 'components/CreateReviewPage';
import Login from 'components/LoginPage';
import NavigationBar from 'components/NavigationBar';
import Professors from 'components/ProfessorsPage';

describe('Navbar Component Tests', () => {
  test('navbar snapshot test', () => {
    const snapshot = render(
			<AuthProvider>
				<Router>
					<NavigationBar>
						<Switch>
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
									Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
								</div>
							</Route>
						</Switch>
					</NavigationBar>
				</Router>
			</AuthProvider>
		);
      expect(snapshot).toMatchSnapshot();
  });
});