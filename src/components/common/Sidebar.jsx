<<<<<<< HEAD
/* Adapted from https://react.semantic-ui.com/modules/sidebar/#states-dimmed */
// import { useBooleanKnob } from '@stardust-ui/docs-components'    // issue with prettier version (babel/parser issue)
import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import {Link} from 'react-router-dom';

class CulpaSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isVisible: true};

    this.setVisible = this.setVisible.bind(this);
  }

  setVisible(isVisible) {
    this.setState({isVisible: isVisible});
  }

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          inverted
          onHide={() => this.setVisible(false)}
          vertical
          visible={this.state.isVisible}
          width='thin'
          >
            <Menu.Item as='a'>
              <Icon name='home' />
              {/* <Link to='/'>Home</Link> */}
              Home
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='address card' />
              {/* <Link to='/professors'>Professors</Link> */}
              Professors
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='edit outline' />
              {/* <Link to='/review'>Reviews</Link> */}
              Reviews
            </Menu.Item>
          </Sidebar>
  
          <Sidebar.Pusher>  {/* need a way to include actual content here */}
            <Segment basic>
              <Header as='h1'>Application Content</Header>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
          </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }

}

export default CulpaSidebar
