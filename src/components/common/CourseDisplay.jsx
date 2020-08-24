import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesCourseDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  courseCallNumber: PropTypes.string,
  courseName: PropTypes.string.isRequired,
};

const propTypesCourseDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  courseCallNumber: PropTypes.string,
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
};

const defaultProps = {
  courseCallNumber: "",
  as: "text",
};

export function CourseDisplayName({ as, courseCallNumber, courseName }) {
  const CourseName = as === "header" ? Header : "span";
  return (
    <CourseName>
      {courseCallNumber} {courseName}
    </CourseName>
  );
}

export function CourseDisplayLink({
  as,
  courseCallNumber,
  courseId,
  courseName,
}) {
  return (
    <Link to={`/course/${courseId}`}>
      <CourseDisplayName
        as={as}
        courseCallNumber={courseCallNumber}
        courseName={courseName}
      />
    </Link>
  );
}

CourseDisplayName.propTypes = propTypesCourseDisplayName;
CourseDisplayName.defaultProps = defaultProps;

CourseDisplayLink.propTypes = propTypesCourseDisplayLink;
CourseDisplayLink.defaultProps = defaultProps;
