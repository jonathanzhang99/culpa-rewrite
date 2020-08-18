import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesProfessorDisplayName = {
  as: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const propTypesProfessorDisplayLink = {
  as: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

const defaultProps = {
  as: "p",
};

export function ProfessorDisplayName({ as, firstName, lastName }) {
  return (
    <Header as={as}>
      {firstName} {lastName}
    </Header>
  );
}

export function ProfessorDisplayLink({ as, professorId, firstName, lastName }) {
  return (
    <Link
      to={{
        pathname: `/professor/${professorId}`,
      }}
    >
      <ProfessorDisplayName as={as} firstName={firstName} lastName={lastName} />
    </Link>
  );
}

ProfessorDisplayName.propTypes = propTypesProfessorDisplayName;
ProfessorDisplayName.defaultProps = defaultProps;

ProfessorDisplayLink.propTypes = propTypesProfessorDisplayLink;
ProfessorDisplayLink.defaultProps = defaultProps;
