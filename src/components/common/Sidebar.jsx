import React from 'react';
import {Link} from 'react-router-dom';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {isToggleOn: false};
  }

  render() {
    return (
      <div>
        <p>Sidebar</p>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/professors">Professors</Link></li>
          <li><Link to="/review">Reviews</Link></li>
        </ul>
      </div>
    );
  }
}