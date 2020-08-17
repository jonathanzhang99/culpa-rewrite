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
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import downvoteClickedIcon from "icons/blue-downvote.png";
import upvoteClickedIcon from "icons/blue-upvote.png";
import downvoteIcon from "icons/downvote.png";
import funnyIcon from "icons/funny.png";
import upvoteIcon from "icons/upvote.png";

const propTypesVotesContainer = {
  reviewId: PropTypes.number.isRequired,
  votes: PropTypes.shape({
    initUpvoteCount: PropTypes.number.isRequired,
    initDownvoteCount: PropTypes.number.isRequired,
    initFunnyCount: PropTypes.number.isRequired,
    upvoteClicked: PropTypes.bool.isRequired,
    downvoteClicked: PropTypes.bool.isRequired,
    funnyClicked: PropTypes.bool.isRequired,
  }).isRequired,
};

export function VotesContainer({
  reviewId,
  votes
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
          upvoteClicked: votes.upvoteClicked,
          downvoteClicked: votes.downvoteClicked,
          funnyClicked: votes.funnyClicked,
        };
      case "RESET_VOTE_COUNT":
        return {
          ...state,
          upvoteCount: votes.initUpvoteCount,
          downvoteCount: votes.initDownvoteCount,
          funnyCount: votes.initFunnyCount,
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
    upvoteClicked: votes.upvoteClicked,
    downvoteClicked: votes.downvoteClicked,
    funnyClicked: votes.funnyClicked,
    upvoteCount: votes.initUpvoteCount,
    downvoteCount: votes.initDownvoteCount,
    funnyCount: votes.initFunnyCount,
  });

  // update votes when prop changes are detected
  // TODO: examine if this is actually necessary (wouldn't prop change directly trigger re-render?)
  useEffect(() => {
    dispatch({ type: "RESET_CLICKED_STATE" });
  }, [votes.upvoteClicked, votes.downvoteClicked, votes.funnyClicked]);

  useEffect(() => {
    dispatch({ type: "RESET_VOTE_COUNT" });
  }, [votes.initUpvoteCount, votes.initDownvoteCount, votes.initFunnyCount]);

  // ensure that up/downvotes are mutually exclusive
  const handleUpDownvote = (type) => {
    if (type === 'upvote' && state.downvoteClicked && !state.upvoteClicked){
      dispatch({type: 'TOGGLE_DOWNVOTE'})
    } else if (type === 'downvote' && state.upvoteClicked && !state.downvoteClicked){
      dispatch({type: 'TOGGLE_UPVOTE'})
    }
    dispatch({ type: `TOGGLE_${type.toUpperCase()}`})
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

VotesContainer.propTypes = propTypesVotesContainer;

const propTypesReviewCard = {
  reviewType: PropTypes.oneOf(['professor', 'course']).isRequired,
  reviewHeader: PropTypes.oneOfType([
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCode: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      profId: PropTypes.number.isRequired,
      profFirstName: PropTypes.string.isRequired,
      profLastName: PropTypes.string.isRequired,
      uni: PropTypes.string.isRequired
    }),
  ]).isRequired,
  votes: PropTypes.shape({
    initUpvoteCount: PropTypes.number.isRequired,
    initDownvoteCount: PropTypes.number.isRequired,
    initFunnyCount: PropTypes.number.isRequired,
    upvoteClicked: PropTypes.bool.isRequired,
    downvoteClicked: PropTypes.bool.isRequired,
    funnyClicked: PropTypes.bool.isRequired,
  }).isRequired,
  workload: PropTypes.string,
  submissionDate: PropTypes.string.isRequired,
  reviewId: PropTypes.number.isRequired,
  deprecated: PropTypes.bool,
  content: PropTypes.string,
};

const defaultPropsReviewCard = {
    workload: "",
    deprecated: false,
    content: ""
}

export default function ReviewCard({
  reviewType,
  reviewHeader,
  votes,
  workload,
  submissionDate,
  reviewId,
  deprecated,
  content
}) {

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
              {reviewType === 'professor' ? (
                <ProfessorDisplayName
                  as="h3"
                  firstName={reviewHeader.profFirstName}
                  lastName={reviewHeader.profLastName}
                />
              ) : (
                <CourseDisplayName
                  as="h3"
                  code={reviewHeader.courseCode}
                  name={reviewHeader.courseName}
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
            reviewId={reviewId}
            votes={votes}
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

ReviewCard.propTypes = propTypesReviewCard;
ReviewCard.defaultProps = defaultPropsReviewCard;