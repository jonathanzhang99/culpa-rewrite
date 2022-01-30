import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react";
import { Header, Image, Grid, Message, Icon } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import downvoteClickedIcon from "icons/blue-downvote.svg";
import upvoteClickedIcon from "icons/blue-upvote.svg";
import downvoteIcon from "icons/downvote.svg";
import funnyIcon from "icons/funny.svg";
import upvoteIcon from "icons/upvote.svg";

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

export function VotesContainer({ reviewId, votes }) {
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
    if (type === "upvote" && state.downvoteClicked && !state.upvoteClicked) {
      dispatch({ type: "TOGGLE_DOWNVOTE" });
    } else if (
      type === "downvote" &&
      state.upvoteClicked &&
      !state.downvoteClicked
    ) {
      dispatch({ type: "TOGGLE_UPVOTE" });
    }
    dispatch({ type: `TOGGLE_${type.toUpperCase()}` });
  };

  return (
    <Grid centered stackable>
      <Grid.Row className="votes-container-icon-row">
        <Image
          size="mini"
          src={state.upvoteClicked ? upvoteClickedIcon : upvoteIcon}
          onClick={() => handleUpDownvote("upvote")}
        />
      </Grid.Row>
      <Grid.Row className="votes-container-number-row">
        {state.upvoteCount}
      </Grid.Row>
      <Grid.Row className="votes-container-icon-row">
        <Image
          size="mini"
          src={state.downvoteClicked ? downvoteClickedIcon : downvoteIcon}
          onClick={() => handleUpDownvote("downvote")}
        />
      </Grid.Row>
      <Grid.Row className="votes-container-number-row">
        {state.downvoteCount}
      </Grid.Row>
      <Grid.Row className="votes-container-icon-row">
        <Image
          size="mini"
          src={funnyIcon}
          onClick={() => dispatch({ type: "TOGGLE_FUNNY" })}
        />
      </Grid.Row>
      <Grid.Row className="votes-container-number-row">
        {state.funnyCount}
      </Grid.Row>
    </Grid>
  );
}

VotesContainer.propTypes = propTypesVotesContainer;

const propTypesReviewCard = {
  reviewType: PropTypes.oneOf(["professor", "course", "all"]).isRequired,
  reviewHeader: PropTypes.oneOfType([
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      profId: PropTypes.number.isRequired,
      profFirstName: PropTypes.string.isRequired,
      profLastName: PropTypes.string.isRequired,
      uni: PropTypes.string.isRequired,
      badges: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    PropTypes.shape({
      course: PropTypes.shape({
        courseId: PropTypes.number.isRequired,
        courseName: PropTypes.string.isRequired,
        courseCode: PropTypes.string.isRequired,
      }),
      professor: PropTypes.shape({
        profId: PropTypes.number.isRequired,
        profFirstName: PropTypes.string.isRequired,
        profLastName: PropTypes.string.isRequired,
        uni: PropTypes.string.isRequired,
        badges: PropTypes.arrayOf(PropTypes.number).isRequired,
      }),
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
  content: "",
};

export default function ReviewCard({
  reviewType,
  reviewHeader,
  votes,
  workload,
  submissionDate,
  reviewId,
  deprecated,
  content,
}) {
  return (
    <Grid className="add-margin fluid">
      <Grid.Column className="review-card-left-column">
        {deprecated && (
          <Message color="red">
            <Icon color="red" name="warning circle" />
            Please keep in mind that this review is more than 5 years old.
          </Message>
        )}
        <Grid columns={2}>
          {reviewType === "professor" && (
            <Grid.Column width={12}>
              <CourseDisplayName
                as="header"
                className="no-vertical-margin review-card-header"
                courseCallNumber={reviewHeader.courseCallNumber}
                courseName={reviewHeader.courseName}
              />
            </Grid.Column>
          )}
          {reviewType === "course" && (
            <Grid.Column width={12}>
              <ProfessorDisplayName
                as="header"
                badges={reviewHeader.badges}
                className="no-vertical-margin review-card-header"
                firstName={reviewHeader.profFirstName}
                lastName={reviewHeader.profLastName}
              />
            </Grid.Column>
          )}
          {reviewType === "all" && (
            <Grid.Column width={12}>
              <div>
                <ProfessorDisplayName
                  as="header"
                  badges={reviewHeader.professor.badges}
                  className="no-vertical-margin review-card-header"
                  firstName={reviewHeader.professor.profFirstName}
                  lastName={reviewHeader.professor.profLastName}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <CourseDisplayName
                  as="header"
                  className="no-vertical-margin review-card-header"
                  courseCallNumber={reviewHeader.course.courseCode}
                  courseName={reviewHeader.course.courseName}
                />
              </div>
            </Grid.Column>
          )}
          <Grid.Column textAlign="right" width={4}>
            ID: {reviewId}
          </Grid.Column>
        </Grid>
        <Header size="small">{submissionDate}</Header>
        <p>{content}</p>
        <Header size="small">Workload</Header>
        <p>{workload}</p>
      </Grid.Column>
      <Grid.Column className="review-card-right-column">
        <VotesContainer reviewId={reviewId} votes={votes} />
      </Grid.Column>
    </Grid>
  );
}

ReviewCard.propTypes = propTypesReviewCard;
ReviewCard.defaultProps = defaultPropsReviewCard;
