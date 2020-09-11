import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesDepartmentDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  departmentName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"]),
};

const propTypesDepartmentDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "huge"]),
};

const defaultProps = {
  as: "text",
  size: "medium",
};

export function DepartmentDisplayName({ as, departmentName, size }) {
  const DepartmentName = as === "header" ? Header : "span";
  return <DepartmentName size={size}> {departmentName} </DepartmentName>;
}

export function DepartmentDisplayLink({
  as,
  departmentId,
  departmentName,
  size,
}) {
  return (
    <Link to={`/department/${departmentId}`}>
      <DepartmentDisplayName
        as={as}
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
