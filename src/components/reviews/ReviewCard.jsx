import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react";
import {
  Container,
  Header,
  Image,
  Grid,
  Message,
  Icon,
} from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";
import downvoteClickedIcon from "icons/blue-downvote.png";
import upvoteClickedIcon from "icons/blue-upvote.png";
import downvoteIcon from "icons/downvote.png";
import funnyIcon from "icons/funny.png";
import upvoteIcon from "icons/upvote.png";

function VotesContainer({
  reviewId,
  initUpvoteCount,
  initDownvoteCount,
  initFunnyCount,
  upvoteClickedProp,
  downvoteClickedProp,
  funnyClickedProp,
}) {
  // function for adding / revoking a vote for a review
  const changeVoteCount = async (voteType, action) => {
    const req = await fetch("/api/vote/change", {
      method: "POST",
      body: JSON.stringify({
        action,
        voteType,
        reviewId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      return await req.json();
    } catch (err) {
      return { error: err };
    }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "RESET_CLICKED_STATE":
        return {
          ...state,
          upvoteClicked: upvoteClickedProp,
          downvoteClicked: downvoteClickedProp,
          funnyClicked: funnyClickedProp,
        };
      case "RESET_VOTE_COUNT":
        return {
          ...state,
          upvoteCount: initUpvoteCount,
          downvoteCount: initDownvoteCount,
          funnyCount: initFunnyCount,
        };
      case "TOGGLE_UPVOTE":
        changeVoteCount("agree", state.upvoteClicked ? "revoke" : "add");
        return {
          ...state,
          upvoteCount: state.upvoteClicked
            ? state.upvoteCount - 1
            : state.upvoteCount + 1,
          upvoteClicked: !state.upvoteClicked,
        };
      case "TOGGLE_DOWNVOTE":
        changeVoteCount("disagree", state.downvoteClicked ? "revoke" : "add");
        return {
          ...state,
          downvoteCount: state.downvoteClicked
            ? state.downvoteCount - 1
            : state.downvoteCount + 1,
          downvoteClicked: !state.downvoteClicked,
        };
      case "TOGGLE_FUNNY":
        changeVoteCount("funny", state.funnyClicked ? "revoke" : "add");
        return {
          ...state,
          funnyCount: state.funnyClicked
            ? state.funnyCount - 1
            : state.funnyCount + 1,
          funnyClicked: !state.funnyClicked,
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    upvoteClicked: false,
    downvoteClicked: false,
    funnyClicked: false,
    upvoteCount: initUpvoteCount,
    downvoteCount: initDownvoteCount,
    funnyCount: initFunnyCount,
  });

  useEffect(() => {
    dispatch({ type: "RESET_CLICKED_STATE" });
  }, [upvoteClickedProp, downvoteClickedProp, funnyClickedProp]);

  // update vote counts when the vote counts fetched from the db has changed
  useEffect(() => {
    dispatch({ type: "RESET_VOTE_COUNT" });
  }, [initUpvoteCount, initDownvoteCount, initFunnyCount]);

  // ensure that up/downvotes are mutually exclusive
  const handleUpDownvote = (type) => {
    dispatch({ type: `TOGGLE_${type.toUpperCase()}`})
    if (state.upvoteClicked !== state.downvoteClicked) {
         dispatch({type: type === "upvote" ? 'TOGGLE_DOWNVOTE' : 'TOGGLE_UPVOTE'})
    }
  }
  return (
    <Container>
      <Grid centered style={{ padding: "30px 10px", height: "100%" }}>
        <Grid.Row style={{ paddingBottom: 0, overflow: "show" }}>
          <Image
            src={state.upvoteClicked ? upvoteClickedIcon : upvoteIcon}
            onClick={() => handleUpDownvote("upvote")}
          />
        </Grid.Row>
        <Grid.Row style={{ padding: 0, color: "white" }}>
          <strong>{state.upvoteCount}</strong>
        </Grid.Row>
        <Grid.Row style={{ paddingBottom: 0 }}>
          <Image
            src={state.downvoteClicked ? downvoteClickedIcon : downvoteIcon}
            onClick={() => handleUpDownvote("downvote")}
          />
        </Grid.Row>
        <Grid.Row style={{ padding: 0, color: "white" }}>
          <strong>{state.downvoteCount}</strong>
        </Grid.Row>
        <Grid.Row style={{ paddingBottom: 0 }}>
          <Image
            src={funnyIcon}
            onClick={() => dispatch({ type: "TOGGLE_FUNNY" })}
          />
        </Grid.Row>
        <Grid.Row style={{ padding: 0, color: "white" }}>
          <strong>{state.funnyCount}</strong>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

const votesContainerPropTypes = {
  initUpvoteCount: PropTypes.number.isRequired,
  initDownvoteCount: PropTypes.number.isRequired,
  initFunnyCount: PropTypes.number.isRequired,
  reviewId: PropTypes.string.isRequired,
  upvoteClickedProp: PropTypes.bool,
  downvoteClickedProp: PropTypes.bool,
  funnyClickedProp: PropTypes.bool,
};

const votesContainerDefaultProps = {
  upvoteClickedProp: false,
  downvoteClickedProp: false,
  funnyClickedProp: false,
};

VotesContainer.propTypes = votesContainerPropTypes;
VotesContainer.defaultProps = votesContainerDefaultProps;

export default function ReviewCard({
  workload,
  onlyProf,
  onlyCourse,
  submissionDate,
  reviewId,
  initUpvoteCount,
  initDownvoteCount,
  initFunnyCount,
  profFirstName,
  profLastName,
  deprecated,
  courseCode,
  courseName,
  content,
}) {
  // get clicked state of each button for this specific user
  const {
    data: { upvoteClicked, downvoteClicked, funnyClicked },
    isLoading,
    isError,
  } = useDataFetch(`/api/vote/get_clicked_state?reviewId=${reviewId}`, {
    upvoteClicked: false,
    downvoteClicked: false,
    funnyClicked: false,
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <Container fluid>
      <Grid>
        <Grid.Column
          key={1}
          style={{ backgroundColor: "#F2F2F2", padding: "30px" }}
          width={14}
        >
          <Container fluid>
            {deprecated && (
              <Message style={{ backgroundColor: "#FFF1F1" }}>
                <Icon color="red" name="warning circle" />
                Please keep in mind that this review is more than 5 years old.
              </Message>
            )}
            <div style={{ position: "relative" }}>
              {!onlyProf && (
                <ProfessorDisplayName
                  as="h3"
                  firstName={profFirstName}
                  lastName={profLastName}
                />
              )}
              {!onlyCourse && (
                <CourseDisplayName
                  as="h3"
                  code={courseCode}
                  name={courseName}
                />
              )}
              <Header as="h5">{submissionDate}</Header>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  fontSize: "16px",
                }}
              >
                ID: {reviewId}
              </div>
            </div>
            <p>{content}</p>
            <Header as='h5'>Workload</Header>
            <p>{workload}</p>
          </Container>
        </Grid.Column>
        <Grid.Column
          key={2}
          style={{ backgroundColor: "#004E8D", paddingLeft: 0 }}
          width={2}
        >
          <VotesContainer
            downvoteClickedProp={downvoteClicked}
            funnyClickedProp={funnyClicked}
            initDownvoteCount={initDownvoteCount}
            initFunnyCount={initFunnyCount}
            initUpvoteCount={initUpvoteCount}
            reviewId={reviewId}
            upvoteClickedProp={upvoteClicked}
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

const reviewCardPropTypes = {
  workload: PropTypes.string,
  onlyProf: PropTypes.bool.isRequired,
  onlyCourse: PropTypes.bool.isRequired,
  submissionDate: PropTypes.string.isRequired,
  reviewId: PropTypes.string.isRequired,
  initDownvoteCount: PropTypes.number.isRequired,
  initUpvoteCount: PropTypes.number.isRequired,
  initFunnyCount: PropTypes.number.isRequired,
  profFirstName: PropTypes.string.isRequired,
  profLastName: PropTypes.string.isRequired,
  deprecated: PropTypes.bool,
  courseCode: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  content: PropTypes.string,
};

const reviewCardDefaultProps = {
    workload: "",
    deprecated: false,
    content: ""
}

ReviewCard.propTypes = reviewCardPropTypes;
ReviewCard.defaultProps = reviewCardDefaultProps;