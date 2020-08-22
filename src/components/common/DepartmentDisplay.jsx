import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesDepartmentDisplayName = {
  departmentName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const propTypesDepartmentDisplayLink = {
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const defaultProps = {
  type: "text",
};

export function DepartmentDisplayName({ departmentName, type }) {
  const Display = type === "header" ? Header : "span";
  return <Display>{departmentName}</Display>;
}

export function DepartmentDisplayLink({ departmentId, departmentName, type }) {
  return (
    <Link to={`/department/${departmentId}`}>
      <DepartmentDisplayName departmentName={departmentName} type={type} />
    </Link>
  );
}

DepartmentDisplayName.propTypes = propTypesDepartmentDisplayName;
DepartmentDisplayName.defaultProps = defaultProps;

DepartmentDisplayLink.propTypes = propTypesDepartmentDisplayLink;
DepartmentDisplayLink.defaultProps = defaultProps;
