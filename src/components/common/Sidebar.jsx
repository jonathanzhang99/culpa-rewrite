import React from 'react';
import {Link} from 'react-router-dom';
import {  Header, Icon, Image, Menu, Segment, Sidebar as SemanticSidebar } from 'semantic-ui-react'

const Sidebar = () => {
  return (
    <SemanticSidebar.Pushable as={Segment}>
      <SemanticSidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        inverted
        // onHide={() => this.setVisible(false)}
        vertical
        visible='true'
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
        </SemanticSidebar>

        <SemanticSidebar.Pusher>  {/* need a way to include actual content here */}
          <Segment basic>
            <Header as='h1'>Application Content</Header>
            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
          </Segment>
        </SemanticSidebar.Pusher>
    </SemanticSidebar.Pushable>
  );

}

export default Sidebar
