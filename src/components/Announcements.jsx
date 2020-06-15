import PropTypes from "prop-types";
import React from "react";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";

const propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export function AnnouncementsSection(props) {
  // TODO: Implement Announcements
  const { messages } = props;
  return <div>{messages}</div>;
}

AnnouncementsSection.propTypes = propTypes;

export default function Announcements() {
  const {
    data: { messages },
    isLoading,
    isError,
  } = useDataFetch("/api/announcements/all", {
    messages: [],
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return <AnnouncementsSection messages={messages} />;
}
