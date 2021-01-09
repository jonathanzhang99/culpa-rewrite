/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

const propTypes = {
  color: PropTypes.string,
  courseId: PropTypes.number,
  fluid: PropTypes.bool,
  subject: PropTypes.string,
  professorId: PropTypes.number,
  relaxed: PropTypes.bool,
};

const defaultProps = {
  color: "orange",
  courseId: undefined,
  fluid: false,
  subject: "",
  professorId: undefined,
  relaxed: false,
};

export default function CreateReviewButton({
  color,
  courseId,
  fluid,
  professorId,
  subject,
  relaxed,
}) {
  return (
    <Link
      to={{
        pathname: "/review/submit",
        state: { courseId, professorId },
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
