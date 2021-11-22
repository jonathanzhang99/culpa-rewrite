/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import queryString from "query-string";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

const propTypes = {
  color: PropTypes.string,
  fluid: PropTypes.bool,
  subject: PropTypes.string,
  professorId: PropTypes.number,
  professorName: PropTypes.string,
  relaxed: PropTypes.bool,
};

const defaultProps = {
  color: "orange",
  fluid: false,
  subject: "",
  professorId: undefined,
  professorName: undefined,
  relaxed: false,
};

export default function CreateReviewButton({
  color,
  fluid,
  professorId,
  professorName,
  subject,
  relaxed,
}) {
  const query = { professorId, professorName };
  return (
    <Link
      to={{
        pathname: "/review/submit",
        search: `?${queryString.stringify(query)}`,
      }}
    >
      <Button
        className={`${relaxed ? "relaxed" : ""} create-review-button`}
        color={color}
        fluid={fluid}
      >
        WRITE A REVIEW {subject ? `FOR ${subject.toUpperCase()}` : ""}
      </Button>
    </Link>
  );
}

CreateReviewButton.propTypes = propTypes;
CreateReviewButton.defaultProps = defaultProps;
