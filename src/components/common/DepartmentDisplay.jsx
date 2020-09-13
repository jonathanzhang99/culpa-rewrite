import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesDepartmentDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  className: PropTypes.string,
  departmentName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"]),
};

const propTypesDepartmentDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  className: PropTypes.string,
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"]),
};

const defaultProps = {
  as: "text",
  className: "",
  size: "medium",
};

export function DepartmentDisplayName({ as, className, departmentName, size }) {
  const DepartmentName = as === "header" ? Header : "span";
  return (
    <DepartmentName className={className} size={size}>
      {departmentName}
    </DepartmentName>
  );
}

export function DepartmentDisplayLink({
  as,
  className,
  departmentId,
  departmentName,
  size,
}) {
  return (
    <Link to={`/department/${departmentId}`}>
      <DepartmentDisplayName
        as={as}
        className={className}
        departmentName={departmentName}
        size={size}
      />
    </Link>
  );
}

DepartmentDisplayName.propTypes = propTypesDepartmentDisplayName;
DepartmentDisplayName.defaultProps = defaultProps;

DepartmentDisplayLink.propTypes = propTypesDepartmentDisplayLink;
DepartmentDisplayLink.defaultProps = defaultProps;
