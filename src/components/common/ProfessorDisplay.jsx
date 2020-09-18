import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";

import Badge from "components/common/Badge";

const propTypesProfessorDisplayName = {
  as: PropTypes.oneOf(["header", "text"]),
  badges: PropTypes.arrayOf(PropTypes.number),
  firstName: PropTypes.string,
  fullName: PropTypes.string,
  lastName: PropTypes.string,
};

const propTypesProfessorDisplayLink = {
  as: PropTypes.oneOf(["header", "text"]),
  badges: PropTypes.arrayOf(PropTypes.number),
  firstName: PropTypes.string,
  fullName: PropTypes.string,
  lastName: PropTypes.string,
  professorId: PropTypes.number.isRequired,
};

const defaultProps = {
  as: "text",
  badges: [],
  firstName: "",
  fullName: "",
  lastName: "",
};

export function ProfessorDisplayName({
  as,
  badges,
  firstName,
  fullName,
  lastName,
}) {
  const ProfessorName = as === "header" ? Header : "span";
  return (
    <>
      <ProfessorName>
        {fullName || (
          <>
            {firstName} {lastName}
          </>
        )}
      </ProfessorName>
      {badges.map((badgeId) => (
        <Badge badgeId={badgeId} key={`badge-${badgeId}`} />
      ))}
    </>
  );
}

export function ProfessorDisplayLink({
  as,
  badges,
  firstName,
  fullName,
  lastName,
  professorId,
}) {
  return (
    <>
      <Link to={`/professor/${professorId}`}>
        <ProfessorDisplayName
          as={as}
          firstName={firstName}
          fullName={fullName}
          lastName={lastName}
        />
      </Link>
      {badges.map((badgeId) => (
        <Badge badgeId={badgeId} key={`badge-${badgeId}`} />
      ))}
    </>
  );
}

ProfessorDisplayName.propTypes = propTypesProfessorDisplayName;
ProfessorDisplayName.defaultProps = defaultProps;

ProfessorDisplayLink.propTypes = propTypesProfessorDisplayLink;
ProfessorDisplayLink.defaultProps = defaultProps;
