import React from "react";
import { Link } from "react-router-dom";
import { Grid, Icon, Image } from "semantic-ui-react";

import culpaIcon from "icons/culpa.svg";

export default function Footer() {
  return (
    <Grid className="footer" columns={2} verticalAlign="middle">
      <Grid.Column textAlign="center">
        <Image centered src={culpaIcon} />
        <Icon color="blue" name="copyright outline" size="small" />
        <span style={{ color: "#82B7E8" }}>1997-2020</span>
      </Grid.Column>
      <Grid.Column textAlign="left">
        <Grid.Row>
          <Link className="footer-link" to="/">
            About
          </Link>
        </Grid.Row>
        <Grid.Row>
          <Link className="footer-link" to="/join-the-team">
            Join The Team
          </Link>
        </Grid.Row>
        <Grid.Row>
          <Icon color="blue" name="mail" size="small" />
          <span className="footer-link">admin@culpa.info</span>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
}
