import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesProfessorDisplayName = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const propTypesProfessorDisplayLink = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

export function ProfessorDisplayName({ firstName, lastName }) {
  return (
    <Header as="h3">
      {firstName} {lastName}
    </Header>
  );
}

export function ProfessorDisplayLink({ professorId, firstName, lastName }) {
  return (
    <Link
      to={{
        pathname: `/professors/${professorId}`,
      }}
    >
      <ProfessorDisplayName firstName={firstName} lastName={lastName} />
    </Link>
  );
}

ProfessorDisplayName.propTypes = propTypesProfessorDisplayName;
ProfessorDisplayLink.propTypes = propTypesProfessorDisplayLink;
