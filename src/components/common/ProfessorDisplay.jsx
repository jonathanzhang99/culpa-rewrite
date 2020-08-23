import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesProfessorDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const propTypesProfessorDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

const defaultProps = {
  as: "text",
};

export function ProfessorDisplayName({ firstName, lastName, as }) {
  const ProfessorName = as === "header" ? Header : "span";
  return (
    <ProfessorName>
      {firstName} {lastName}
    </ProfessorName>
  );
}

export function ProfessorDisplayLink({
  as,
  firstName,
  lastName,
  professorId,
}) {
  return (
    <Link to={`/professor/${professorId}`}>
      <ProfessorDisplayName
        as={as}
        firstName={firstName}
        lastName={lastName}
      />
    </Link>
  );
}

ProfessorDisplayName.propTypes = propTypesProfessorDisplayName;
ProfessorDisplayName.defaultProps = defaultProps;

ProfessorDisplayLink.propTypes = propTypesProfessorDisplayLink;
ProfessorDisplayLink.defaultProps = defaultProps;
