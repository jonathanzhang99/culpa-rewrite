import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesProfessorDisplayName = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const propTypesProfessorDisplayLink = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["header", "text"]),
};

const defaultProps = {
  type: "text",
};

export function ProfessorDisplayName({ firstName, lastName, type }) {
  const Display = type === "header" ? Header : "span";
  return (
    <Display>
      {firstName} {lastName}
    </Display>
  );
}

export function ProfessorDisplayLink({
  firstName,
  lastName,
  professorId,
  type,
}) {
  return (
    <Link
      to={{
        pathname: `/professor/${professorId}`,
      }}
    >
      <ProfessorDisplayName
        firstName={firstName}
        lastName={lastName}
        type={type}
      />
    </Link>
  );
}

ProfessorDisplayName.propTypes = propTypesProfessorDisplayName;
ProfessorDisplayName.defaultProps = defaultProps;

ProfessorDisplayLink.propTypes = propTypesProfessorDisplayLink;
ProfessorDisplayLink.defaultProps = defaultProps;
