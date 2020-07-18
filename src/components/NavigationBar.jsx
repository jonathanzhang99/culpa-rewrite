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

  const [isVisible, setVisible] = useState(false);
  const [isNavbarFixed, setNavbarFixed] = useState(false);

  const handleClick = () => {
    setVisible(!isVisible);
  }

  const handleSidebarHide = () => {
    setVisible(false);
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
            <Button onClick={handleClick} basic>
              <Icon name='bars' fitted size="big" color="blue" />
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
            <Button className="review-button" color="yellow"> WRITE A REVIEW </Button>
          </Menu.Item>
        </Menu>
      </Visibility>
      <Container>
        <Sidebar
          handleSidebarHide={handleSidebarHide}
          isVisible={isVisible}
        >
          {children}
        </Sidebar>
      </Container>
    </div>
  );
}

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;
>>>>>>> Integrate navbar and sidebar
