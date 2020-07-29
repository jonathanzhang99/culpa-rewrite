import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const propTypesName = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const propTypesLink = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

export function ProfessorDisplayName({ firstName, lastName }) {
  return (
    <div>
      {firstName} {lastName}
    </div>
  );
}

export function ProfessorDisplayLink({ professorId, firstName, lastName }) {
  return (
    <Link
      to={{
        pathname: `/professors/${professorId}`,
      }}
    >
      {firstName} {lastName}
    </Link>
  );
}

ProfessorDisplayName.propTypes = propTypesName;
ProfessorDisplayLink.propTypes = propTypesLink;
