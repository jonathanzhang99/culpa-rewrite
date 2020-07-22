import PropTypes, { oneOfType } from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Menu, Sidebar as SemanticSidebar } from "semantic-ui-react";

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
        as={Menu}
        animation="overlay"
        compact
        onHide={hideSidebar}
        vertical
        visible={isSidebarVisible}
        width="thin"
      >
        <Menu.Item header as={Link} name="welcome to culpa" to="/">
          WELCOME TO CULPA!
        </Menu.Item>
        <Menu.Item as={Link} name="home" to="/">
          Home
        </Menu.Item>
        <Menu.Item as={Link} name="about" to="/about">
          About
        </Menu.Item>
        <Menu.Item as={Link} name="departments" to="/departments">
          Departments
        </Menu.Item>
        <Menu.Item as={Link} name="join the team" to="/join-the-team">
          Join the Team
        </Menu.Item>
        <Menu.Item as={Link} name="log in" to="/login">
          Login
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
