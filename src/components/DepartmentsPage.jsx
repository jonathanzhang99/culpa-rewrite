import PropTypes from "prop-types";
import React from "react";
import { Header, List } from "semantic-ui-react";

import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";

const propTypes = {
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      departmentId: PropTypes.number.isRequired,
      departmentName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export function Departments({ departments }) {
  return (
    // TODO: Add styling into two columns with alphabetical sections
    <div>
      <Header>List of Departments</Header>
      <List>
        {departments.map(({ departmentId, departmentName }) => {
          return (
            <List.Item key={departmentId}>
              <DepartmentDisplayLink
                departmentId={departmentId}
                departmentName={departmentName}
              />
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}

export default function DepartmentsPage() {
  const {
    data: { departments },
    isLoading,
    isError,
  } = useDataFetch("/api/department/all", {
    departments: [],
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return <Departments departments={departments} />;
}

Departments.propTypes = propTypes;
