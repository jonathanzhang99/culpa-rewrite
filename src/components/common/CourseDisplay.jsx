import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesCourseDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  courseCallNumber: PropTypes.string,
  courseName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"]),
};

const propTypesCourseDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  courseCallNumber: PropTypes.string,
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"]),
};

const defaultProps = {
  courseCallNumber: "",
  as: "text",
  size: "medium",
};

export function CourseDisplayName({ as, courseCallNumber, courseName, size }) {
  const CourseName = as === "header" ? Header : "span";
  return (
    <CourseName size={size}>
      {courseCallNumber} {courseName}
    </CourseName>
  );
}

export function CourseDisplayLink({
  as,
  courseCallNumber,
  courseId,
  courseName,
  size,
}) {
  return (
    <Link to={`/course/${courseId}`}>
      <CourseDisplayName
        as={as}
        courseCallNumber={courseCallNumber}
        courseName={courseName}
        size={size}
      />
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesCourseDisplayName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesCourseDisplayLink;
CourseDisplayLink.defaultProps = defaultProps;
