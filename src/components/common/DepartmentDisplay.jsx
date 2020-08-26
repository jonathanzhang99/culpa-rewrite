import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesDepartmentDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  departmentName: PropTypes.string.isRequired,
};

const propTypesDepartmentDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
};

const defaultProps = {
  as: "text",
};

export function DepartmentDisplayName({ as, departmentName }) {
  const DepartmentName = as === "header" ? Header : "span";
  return <DepartmentName> {departmentName} </DepartmentName>;
}

export function DepartmentDisplayLink({ as, departmentId, departmentName }) {
  return (
    <Link to={`/department/${departmentId}`}>
      <DepartmentDisplayName as={as} departmentName={departmentName} />
    </Link>
  );
}

DepartmentDisplayName.propTypes = propTypesDepartmentDisplayName;
DepartmentDisplayName.defaultProps = defaultProps;

DepartmentDisplayLink.propTypes = propTypesDepartmentDisplayLink;
DepartmentDisplayLink.defaultProps = defaultProps;
