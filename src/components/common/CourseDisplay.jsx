import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesCourseDisplayName = {
  as: PropTypes.string,
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
};

const propTypesCourseDisplayLink = {
  as: PropTypes.string,
  courseId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
};

const defaultProps = {
  as: "p",
  code: "",
};

export function CourseDisplayName({ as, code, name }) {
  return (
    <Header as={as}>
      {code} {name}
    </Header>
  );
}

export function CourseDisplayLink({ as, courseId, code, name }) {
  return (
    <Link
      to={{
        pathname: `/courses/${courseId}`,
      }}
    >
      <CourseDisplayName as={as} code={code} name={name} />
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesCourseDisplayName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesCourseDisplayLink;
CourseDisplayLink.defaultProps = defaultProps;
