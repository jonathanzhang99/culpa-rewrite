import PropTypes from "prop-types";
import React from "react";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";

const propTypes = {
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }).isRequired
  ).isRequired,
};

export function DepartmentsSection(props) {
  // TODO: Implement Department Section
  const { departments } = props;

  return (
    <div>
      <h2>List of Departments</h2>
      {departments.map((department) => {
        const { name } = department;
        return <p key={`${name}`}>{name}</p>;
      })}
    </div>
  );
}

DepartmentsSection.propTypes = propTypes;

export default function Departments() {
  const {
    data: { departments },
    isLoading,
    isError,
  } = useDataFetch("/api/departments/all", {
    departments: [],
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return <DepartmentsSection departments={departments} />;
}
