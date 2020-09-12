import React from "react";
import { Container, Divider, Header, Image } from "semantic-ui-react";

import culpaIcon from "icons/blue-culpa.svg";
import bronzeNugget from "icons/bronze-nugget.svg";
import goldNugget from "icons/gold-nugget.svg";
import silverNugget from "icons/silver-nugget.svg";

export default function HomePage() {
  return (
    <Container style={{ margin: "5vh" }} textAlign="center">
      <Image centered spaced size="huge" src={culpaIcon} />
      <div>
        <Header className="culpa-description" size="large">
          Columbia&apos;s anonymous professor and course rating site.
        </Header>
      </div>
      <Divider hidden section />
      <div>
        <Image avatar size="mini" spaced="right" src={goldNugget} />
        <Header className="nugget-description">
          Gold nuggets mean that a professor has been consistently reviewed as
          <span style={{ color: "#004E8D" }}> exceptional.</span>
        </Header>
      </div>
      <div>
        <Image avatar size="mini" spaced="right" src={silverNugget} />
        <Header className="nugget-description">
          Silver nuggets mean that a professor has been consistently reviewed as
          <span style={{ color: "#004E8D" }}> outstanding.</span>
        </Header>
      </div>
      <div>
        <Image avatar size="mini" spaced="right" src={bronzeNugget} />
        <Header className="nugget-description">
          Bronze nuggets mean that a professor has been consistently reviewed as
          <span style={{ color: "#004E8D" }}> great.</span>
        </Header>
      </div>
    </Container>
  );
}
