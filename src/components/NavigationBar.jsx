import PropTypes, { oneOfType } from "prop-types";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, Container, Grid, Icon, Image, Menu } from "semantic-ui-react";

import CreateReviewButton from "components/common/CreateReviewButton";
import Footer from "components/common/Footer";
import Form from "components/common/Form";
import { SearchInput } from "components/common/Inputs";
import Sidebar from "components/common/Sidebar";
import culpaIcon from "icons/culpa.svg";

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

  const history = useHistory();

  const onSearchSubmit = ({ NavbarSearchbar }) => {
    const searchValue = NavbarSearchbar;
    if (typeof searchValue === "string" && searchValue.length > 1) {
      history.push(`/search?entity=all&query=${searchValue}&alphabetize=True`);
    }
    return {}; // Form requires output
  };

  const onResultSelect = ({ type, id }) => {
    history.push(`/${type}/${id}`);
  };

  return (
    <>
      <Grid
        as={Menu}
        className="navbar"
        fixed="top"
        textAlign="center"
        verticalAlign="middle"
      >
        <Grid.Column width={1}>
          <Button basic compact onClick={showSidebar}>
            <Icon fitted color="blue" name="bars" size="big" />
          </Button>
        </Grid.Column>
        <Grid.Column width={3}>
          <Link to="/">
            <Image src={culpaIcon} />
          </Link>
        </Grid.Column>
        <Grid.Column width={9}>
          <Form onSubmit={onSearchSubmit} onSuccess={() => {}}>
            <SearchInput
              name="NavbarSearchbar"
              placeholder="Search for professors or courses"
              searchEntity="all"
              searchLimit={6}
              onResultSelect={onResultSelect}
            />
          </Form>
        </Grid.Column>
        <Grid.Column width={3}>
          <CreateReviewButton fluid color="orange" />
        </Grid.Column>
      </Grid>
      <Container className="root-container">
        <Sidebar hideSidebar={hideSidebar} isSidebarVisible={isSidebarVisible}>
          {children}
        </Sidebar>
      </Container>
      <Footer />
    </>
  );
}

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;
