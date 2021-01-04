import PropTypes from "prop-types";
import React from "react";
import { Image } from "semantic-ui-react";

import bronzeNugget from "icons/bronze-nugget.svg";
import goldNugget from "icons/gold-nugget.svg";
import silverNugget from "icons/silver-nugget.svg";

const propTypesBadge = {
  badgeId: PropTypes.number.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"])
    .isRequired,
};

/**
 * Assumes badgeId of each badge is the following:
 * 1 -> Gold Nugget
 * 2 -> Silver Nugget
 * 3 -> Bronze Nugget
 */
export default function Badge({ badgeId, size }) {
  switch (badgeId) {
    case 1: {
      return <Image size={size} spaced="right" src={goldNugget} />;
    }
    case 2: {
      return <Image size={size} spaced="right" src={silverNugget} />;
    }
    case 3: {
      return <Image size={size} spaced="right" src={bronzeNugget} />;
    }
    default: {
      return null;
    }
  }
}

Badge.propTypes = propTypesBadge;
