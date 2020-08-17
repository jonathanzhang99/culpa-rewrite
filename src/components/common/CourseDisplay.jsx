import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesCourseDisplayName = {
  code: PropTypes.string,
  courseName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const propTypesCourseDisplayLink = {
  code: PropTypes.string,
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const defaultProps = {
  code: "",
  type: "text",
};

export function CourseDisplayName({ code, courseName, type }) {
  const Display = type === "header" ? Header : "span";
  return (
    <Display>
      {code} {courseName}
    </Display>
  );
}

export function CourseDisplayLink({ code, courseId, courseName, type }) {
  return (
    <Link
      to={{
        pathname: `/course/${courseId}`,
      }}
    >
      <CourseDisplayName code={code} courseName={courseName} type={type} />
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesCourseDisplayName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesCourseDisplayLink;
CourseDisplayLink.defaultProps = defaultProps;
