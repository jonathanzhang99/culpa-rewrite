import PropTypes, { oneOfType } from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Form, Grid, Icon, Menu } from "semantic-ui-react";

import { SearchInput } from "components/common/Inputs";
import Sidebar from "components/common/Sidebar";
import WriteReviewButton from "components/common/WriteReviewButton";

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

  const unhideSidebar = () => {
    setSidebarVisible(true);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <>
      <Grid
        as={Menu}
        celled
        fixed="top"
        textAlign="center"
        verticalAlign="middle"
      >
        <Grid.Column width={1}>
          <Button onClick={unhideSidebar} basic compact>
            <Icon name="bars" color="blue" fitted size="big" />
          </Button>
        </Grid.Column>
        <Grid.Column as={Link} to="/" width={3}>
          <h1> CULPA </h1>
        </Grid.Column>
        <Grid.Column width={9}>
          <Form>
            <SearchInput name="searchbar-in-navbar" fluid searchEntity="all" />
          </Form>
        </Grid.Column>
        <Grid.Column width={3}>
          <WriteReviewButton
            as={Link}
            to="/review"
            color="yellow"
            content="WRITE A REVIEW"
            fluid
          />
        </Grid.Column>
      </Grid>
      <Container>
        <div className="top-margin" style={{ height: "120px" }} />
        <Sidebar hideSidebar={hideSidebar} isSidebarVisible={isSidebarVisible}>
          {children}
        </Sidebar>
      </Container>
    </>
  );
}

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;
