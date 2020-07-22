/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

const propTypes = {
  courseId: PropTypes.string,
  professorId: PropTypes.string,
};

const defaultProps = {
  courseId: "",
  professorId: "",
};

export default function CreateReviewButton({ courseId, professorId, ...rest }) {
  return (
    <Link
      to={{
        pathname: "/review",
        state: { courseId, professorId },
      }}
    >
      <Button {...rest} />
    </Link>
  );
}

CreateReviewButton.propTypes = propTypes;
CreateReviewButton.defaultProps = defaultProps;
