import PropTypes, { oneOfType } from 'prop-types';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Icon, Menu, Search, Visibility } from 'semantic-ui-react'

import "../styles/navigationBar.css";

import Sidebar from "components/common/Sidebar";

const propTypes = {
  children: oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ])
};

const defaultProps = {
  children: [],
};

export default function NavigationBar({ children }) {

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isNavbarFixed, setNavbarFixed] = useState(false);

  const unhideSidebar = () => {
    setSidebarVisible(true);
  }

  const hideSidebar = () => {
    setSidebarVisible(false);
  }

  const fixNavbar = () => {
    setNavbarFixed(true);
  }

  const unfixNavbar = () => {
    setNavbarFixed(false);
  }

  return (
    <div className="navbar-container">
      <Visibility
        onTopPassed={fixNavbar}
        onTopVisible={unfixNavbar}
        once={false}
      >
        <Menu
          fixed={isNavbarFixed ? "top" : undefined}
        >
          <Menu.Item
            className="sidebar-tab-container"
          > 
            <Button onClick={unhideSidebar} basic>
              <Icon name='bars' color="blue" fitted size="big"  />
            </Button>
          </Menu.Item>
          <Menu.Item
            as={Link} to="/"
            className="culpa-logo-container"
          >
            <h1> CULPA </h1>
          </Menu.Item>
          <Menu.Item
            className="searchbar-container"
          >
            <Search className="searchbar" fluid placeholder="Search for professors or courses." />
          </Menu.Item>
          <Menu.Item
            as={Link} to="/review"
            className="review-button-container"
          >
            <Button color="yellow" fluid> WRITE A REVIEW </Button>
          </Menu.Item>
        </Menu>
      </Visibility>
      <Container>
        <Sidebar
          hideSidebar={hideSidebar}
          isSidebarVisible={isSidebarVisible}
        >
          {children}
        </Sidebar>
      </Container>
    </div>
  );
}

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;