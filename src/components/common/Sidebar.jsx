import React, {useState } from 'react';
import { Link } from 'react-router-dom';
import {  Button, Header, Image, Icon, Menu, Segment, Sidebar as SemanticSidebar } from 'semantic-ui-react'


export default function Sidebar() {
  const [isVisible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!isVisible);
  }

  const handleSidebarHide = () => {
    setVisible(false);
  }

  return (
    <div>
      <Button onClick={handleClick}>
        <Icon name='bars' />
      </Button>
      <SemanticSidebar.Pushable as={Segment}>
        <SemanticSidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          inverted
          compact
          onHide={handleSidebarHide}
          vertical
          visible={isVisible}
          width='thin'
          >
            <Menu.Item as={ Link } name='home' to='/'>
              Home
            </Menu.Item>
            <Menu.Item as={ Link } name='about' to='/about'>
              About
            </Menu.Item>
            <Menu.Item as={ Link } name='departments' to='/departments'>
              Departments
            </Menu.Item>
            <Menu.Item as={ Link } name='join the team' to='/join-the-team'>
              Join the Team
            </Menu.Item>
            <Menu.Item as={ Link } name='log in' to='/login'>
              Login
            </Menu.Item>
          </SemanticSidebar>

          <SemanticSidebar.Pusher dimmed={isVisible}>  {/* need a way to include actual content here */}
            <Segment basic>
              <Header as='h1'>Application Content</Header>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
          </SemanticSidebar.Pusher>
      </SemanticSidebar.Pushable>
    </div>
  );
}