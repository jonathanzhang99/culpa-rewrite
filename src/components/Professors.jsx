import PropTypes from 'prop-types';
import React from 'react';

import ErrorComponent from 'components/common/ErrorComponent';
import LoadingComponent from 'components/common/LoadingComponent';
import useDataFetch from 'components/common/useDataFetch';

const propTypes = {
  professors: PropTypes.arrayOf(
    PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }).isRequired
  ).isRequired,
};

export function ProfessorsSection(props) {
  // TODO: Implement Professor Section
  const { professors } = props;

  return (
    <ul>
      {professors.map((professor) => {
        const { firstName, lastName } = professor;
        return (
          <li key={`${firstName}_${lastName}`}>
            {firstName}, {lastName}
          </li>
        );
      })}
    </ul>
  );
}

ProfessorsSection.propTypes = propTypes;

export default function Professors() {
  const {
    data: { professors },
    isLoading,
    isError,
  } = useDataFetch('/api/professors/', {
    professors: [],
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return <ProfessorsSection professors={professors} />;
}
