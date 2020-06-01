import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Announcements from 'components/Announcements';
import Professors from 'components/Professors';

function App() {
  return (
    <div>
      {/* <NavigationBar /> */}
      <Router>
        <Switch>
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
