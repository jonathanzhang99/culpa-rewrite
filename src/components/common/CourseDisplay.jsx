import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesCourseDisplayName = {
  courseCallNumber: PropTypes.string,
  courseName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const propTypesCourseDisplayLink = {
  courseCallNumber: PropTypes.string,
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const defaultProps = {
  courseCallNumber: "",
  type: "text",
};

export function CourseDisplayName({ courseCallNumber, courseName, type }) {
  const Display = type === "header" ? Header : "span";
  return (
    <Display>
      {courseCallNumber} {courseName}
    </Display>
  );
}

export function CourseDisplayLink({ courseCallNumber, courseId, courseName, type }) {
  return (
    <Link to={`/course/${courseId}`}>
      <CourseDisplayName courseCallNumber={courseCallNumber} courseName={courseName} type={type} />
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesCourseDisplayName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesCourseDisplayLink;
CourseDisplayLink.defaultProps = defaultProps;
