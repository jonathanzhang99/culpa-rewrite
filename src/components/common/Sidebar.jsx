import PropTypes, { oneOfType } from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Menu, Sidebar as SemanticSidebar } from "semantic-ui-react";

const propTypes = {
  children: oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  hideSidebar: PropTypes.func,
  isSidebarVisible: PropTypes.bool,
};

const defaultProps = {
  children: [],
  hideSidebar: () => {},
  isSidebarVisible: false,
};

export default function Sidebar({ children, hideSidebar, isSidebarVisible }) {
  return (
    <>
      <SemanticSidebar
        borderless
        vertical
        animation="overlay"
        as={Menu}
        visible={isSidebarVisible}
        onHide={hideSidebar}
      >
        <Menu.Item
          as={Link}
          className="sidebar-header"
          name="welcome to culpa"
          to="/"
        >
          WELCOME TO CULPA!
        </Menu.Item>
        <Menu.Item as={Link} name="home" to="/">
          Home
          <Icon color="blue" name="angle right" size="large" />
        </Menu.Item>
        <Menu.Item as={Link} name="about" to="/about">
          About
          <Icon color="blue" name="angle right" size="large" />
        </Menu.Item>
        <Menu.Item as={Link} name="departments" to="/departments">
          Departments
          <Icon color="blue" name="angle right" size="large" />
        </Menu.Item>
        <Menu.Item as={Link} name="join the team" to="/join-the-team">
          Join the Team
          <Icon color="blue" name="angle right" size="large" />
        </Menu.Item>
        <Menu.Item as={Link} name="log in" to="/login">
          Login
          <Icon color="blue" name="angle right" size="large" />
        </Menu.Item>
      </SemanticSidebar>
      <SemanticSidebar.Pushable>
        <SemanticSidebar.Pusher>{children}</SemanticSidebar.Pusher>
      </SemanticSidebar.Pushable>
    </>
  );
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;
