import PropTypes, { oneOfType } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment, Sidebar as SemanticSidebar } from 'semantic-ui-react'

const propTypes = {
  children: oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ])
};

const defaultProps = {
  children: [],
};

export default function Sidebar({ children, handleSidebarHide, isVisible }) {
  return (
    <div className="sidebar-container">
      <SemanticSidebar
        as={Menu}
        animation='overlay'
        compact
        onHide={handleSidebarHide}
        vertical
        visible={isVisible}
        width='thin'
        >
        <Menu.Item header as={ Link } name='welcome to culpa' to='/'>
          WELCOME TO CULPA!
        </Menu.Item>
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
      <SemanticSidebar.Pushable as={Segment}>
        <SemanticSidebar.Pusher>
          {children}
        </SemanticSidebar.Pusher>
      </SemanticSidebar.Pushable>
    </div>
  );
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;