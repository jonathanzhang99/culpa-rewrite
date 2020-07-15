import React from 'react';
import {Link} from 'react-router-dom';
import {  Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

class CulpaSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isVisible: true};

    this.setVisible = this.setVisible.bind(this);
  }

  setVisible(isVisible) {
    this.setState({isVisible});
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
          visible={true}
          width='thin'
          >
            <Menu.Item as={ Link } name='home' to='/'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as={ Link } name='professors' to='/professors'>
              <Icon name='address card' />
              Professors
            </Menu.Item>
            <Menu.Item as={ Link } name='review' to='/review'>
              <Icon name='edit outline' />
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