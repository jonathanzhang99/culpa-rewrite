<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import {Link} from 'react-router-dom';

export default function Sidebar() {
  // constructor(props) {
  //   super(props);
  //   this.state = {isToggleOn: false};
  // }

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
=======
/* Adapted from https://react.semantic-ui.com/modules/sidebar/#states-dimmed */
// import { useBooleanKnob } from '@stardust-ui/docs-components'    // issue with prettier version (babel/parser issue)
import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
=======
import React from 'react';
import {Link} from 'react-router-dom';
>>>>>>> Implement rudimentary sidebar as ul

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: false};
  }

<<<<<<< HEAD
  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        inverted
        // onHide={() => setVisible(false)}
        vertical
        // visible={visible}
        width='thin'
      >
        <Menu.Item as='a'>
          <Icon name='home' />
          Home
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='gamepad' />
          Games
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
      </Sidebar>

      <Sidebar.Pusher /*dimmed={visible}*/ >
        <Segment basic>
          <Header as='h3'>Application Content</Header>
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

export default DimmingSidebar
>>>>>>> First version adapted from sidebar example
=======
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
>>>>>>> Implement rudimentary sidebar as ul
