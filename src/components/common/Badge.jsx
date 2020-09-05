import PropTypes from "prop-types";
import React from "react";
import { Image } from "semantic-ui-react";

import bronzeNugget from "icons/bronze-nugget.svg";
import goldNugget from "icons/gold-nugget.svg";
import silverNugget from "icons/silver-nugget.svg";

const propTypesBadge = {
  badgeId: PropTypes.number.isRequired,
};

export default function Badge({ badgeId }) {
  switch (badgeId) {
    case 1: {
      return <Image avatar spaced="left" src={goldNugget} />;
    }
    case 2: {
      return <Image avatar spaced="left" src={silverNugget} />;
    }
    case 3: {
      return <Image avatar spaced="left" src={bronzeNugget} />;
    }
    default: {
      return null;
    }
  }
}

Badge.propTypes = propTypesBadge;
