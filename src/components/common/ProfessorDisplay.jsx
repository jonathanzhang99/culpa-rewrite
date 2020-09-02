import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

const propTypesProfessorDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  firstName: PropTypes.string,
  fullName: PropTypes.string,
  lastName: PropTypes.string,
};

const propTypesProfessorDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  firstName: PropTypes.string,
  fullName: PropTypes.string,
  lastName: PropTypes.string,
  professorId: PropTypes.number.isRequired,
};

const defaultProps = {
  as: "text",
  firstName: "",
  fullName: "",
  lastName: "",
};

export function ProfessorDisplayName({ as, firstName, fullName, lastName }) {
  const ProfessorName = as === "header" ? Header : "span";
  return (
    <ProfessorName className="display-header">
      {fullName || (
        <>
          {firstName} {lastName}
        </>
      )}
    </ProfessorName>
  );
}

export function ProfessorDisplayLink({
  as,
  firstName,
  fullName,
  lastName,
  professorId,
}) {
  return (
    <Link to={`/professor/${professorId}`}>
      <ProfessorDisplayName
        as={as}
        firstName={firstName}
        fullName={fullName}
        lastName={lastName}
      />
    </Link>
  );
}

ProfessorDisplayName.propTypes = propTypesProfessorDisplayName;
ProfessorDisplayName.defaultProps = defaultProps;

ProfessorDisplayLink.propTypes = propTypesProfessorDisplayLink;
ProfessorDisplayLink.defaultProps = defaultProps;
