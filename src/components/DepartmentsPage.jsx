import PropTypes from "prop-types";
import React from "react";
import { Header, List } from "semantic-ui-react";

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

export function DepartmentsSection({ departments }) {
  // TODO: Implement Department Section

  return (
    <div>
      <Header>List of Departments</Header>
      <List>
        {departments.map(({ name }) => {
          return <List.Item key={`${name}`}>{name}</List.Item>;
        })}
      </List>
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
