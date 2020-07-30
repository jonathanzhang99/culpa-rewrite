import PropTypes, { oneOfType } from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Grid, Icon, Menu } from "semantic-ui-react";

import CreateReviewButton from "components/common/CreateReviewButton";
import Form from "components/common/Form";
import { SearchInput } from "components/common/Inputs";
import Sidebar from "components/common/Sidebar";

const propTypes = {
  children: oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

const defaultProps = {
  children: [],
};

export default function NavigationBar({ children }) {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const showSidebar = () => {
    setSidebarVisible(true);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <>
      <Grid as={Menu} fixed="top" textAlign="center" verticalAlign="middle">
        <Grid.Column width={1}>
          <Button basic compact onClick={showSidebar}>
            <Icon fitted color="blue" name="bars" size="big" />
          </Button>
        </Grid.Column>
        <Grid.Column width={3}>
          <Link to="/">
            <h1> CULPA </h1>
          </Link>
        </Grid.Column>
        <Grid.Column width={9}>
          <Form onSubmit={() => {}} onSuccess={() => {}}>
            <SearchInput fluid name="searchbar-in-navbar" searchEntity="all" />
          </Form>
        </Grid.Column>
        <Grid.Column width={3}>
          <CreateReviewButton fluid color="yellow">
            WRITE A REVIEW
          </CreateReviewButton>
        </Grid.Column>
      </Grid>
      <Container>
        <div style={{ height: "120px" }} />
        <Sidebar hideSidebar={hideSidebar} isSidebarVisible={isSidebarVisible}>
          {children}
        </Sidebar>
      </Container>
    </>
  );
}

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;
