import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const propTypesName = {
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
};

const propTypesLink = {
  courseId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
};

const defaultProps = {
  code: "",
};

export function CourseDisplayName({ name, code }) {
  return (
    <div>
      {code} {name}
    </div>
  );
}

export function CourseDisplayLink({ courseId, name, code }) {
  return (
    <Link
      to={{
        pathname: `/courses/${courseId}`,
      }}
    >
      {code} {name}
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesLink;
CourseDisplayLink.defaultProps = defaultProps;
