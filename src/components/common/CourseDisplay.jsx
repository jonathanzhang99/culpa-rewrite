import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesCourseDisplayName = {
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
};

const propTypesCourseDisplayLink = {
  courseId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
};

const defaultProps = {
  code: "",
};

export function CourseDisplayName({ code, name }) {
  return (
    <Header as="h3">
      {code} {name}
    </Header>
  );
}

export function CourseDisplayLink({ courseId, code, name }) {
  return (
    <Link
      to={{
        pathname: `/courses/${courseId}`,
      }}
    >
      <CourseDisplayName code={code} name={name} />
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesCourseDisplayName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesCourseDisplayLink;
CourseDisplayLink.defaultProps = defaultProps;
