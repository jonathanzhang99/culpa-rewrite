import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";
import ReviewCard from "components/reviews/ReviewCard";
import ReviewSection from "components/reviews/ReviewSection";

const propTypesProfessorCourses = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function ProfessorCourseList({ courses }) {
  return (
    <div className="add-margin">
      <Header className="no-margin">Courses: </Header>
      {courses.map(({ courseId, courseName, courseCallNumber }, index) => (
        <span key={courseId}>
          <CourseDisplayLink
            courseCallNumber={courseCallNumber}
            courseId={courseId}
            courseName={courseName}
          />
          {index !== courses.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );
}

const propTypesProfessorSummary = {
  badges: PropTypes.arrayOf(PropTypes.number).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    })
  ).isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

export function ProfessorSummary({
  badges,
  courses,
  firstName,
  lastName,
  professorId,
}) {
  return (
    /* use div to move to a new line */
    <>
      <div>
        <ProfessorDisplayName
          as="header"
          badges={badges}
          firstName={firstName}
          lastName={lastName}
          size="huge"
        />
      </div>
      <div>
        <ProfessorCourseList courses={courses} />
      </div>
      <div>
        <CreateReviewButton
          relaxed
          color="orange"
          professorId={professorId}
          subject={`${firstName} ${lastName}`}
        />
      </div>
    </>
  );
}

const reviewPropType = PropTypes.shape({
  reviewType: PropTypes.string.isRequired,
  reviewHeader: PropTypes.shape({
    courseId: PropTypes.number.isRequired,
    courseName: PropTypes.string.isRequired,
    courseCallNumber: PropTypes.string.isRequired,
  }).isRequired,
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
});

const propTypesReview = {
  review: reviewPropType.isRequired,
};

function ProfessorReviewCard({ review }) {
  return (
    <ReviewCard
      content={review.content}
      deprecated={review.deprecated}
      reviewHeader={review.reviewHeader}
      reviewId={review.reviewId}
      reviewType={review.reviewType}
      submissionDate={review.submissionDate}
      votes={review.votes}
      workload={review.workload}
    />
  );
}

function SingleProfessorReviewHighlight({ review }) {
  return (
    <Grid columns={2}>
      <Grid.Column key="most_agreed_review_highlight">
        <Header>Most Agreed Review</Header>
        <ProfessorReviewCard review={review} />
      </Grid.Column>
    </Grid>
  );
}

const propTypesProfessorReviewHighlight = {
  professorReviewHighlight: PropTypes.arrayOf(reviewPropType).isRequired,
};

function DoubleProfessorReviewHighlight({ professorReviewHighlight }) {
  return (
    <Grid columns={2}>
      <Grid.Column key="most_positive_review_highlight">
        <Header>Most Positive Review</Header>
        <ProfessorReviewCard review={professorReviewHighlight[0]} />
      </Grid.Column>
      <Grid.Column key="most_negative_review_highlight">
        <Header>Most Negative Review</Header>
        <ProfessorReviewCard review={professorReviewHighlight[1]} />
      </Grid.Column>
    </Grid>
  );
}

function ProfessorReviewHighlight({ professorReviewHighlight }) {
  /* 
    professorReviewHighlight can have lengths 0-2:
      2: professorReviewHighlight[0] is the most positive review and
          professorReviewHighlight[1] the most negative review
      1: Either most positive and negative reviews are the same review
          or there is only one review for the course
      0: There are no reviews for the course
  */

  if (professorReviewHighlight.length === 1) {
    return (
      <SingleProfessorReviewHighlight review={professorReviewHighlight[0]} />
    );
  }
  if (professorReviewHighlight.length === 2) {
    return (
      <DoubleProfessorReviewHighlight
        professorReviewHighlight={professorReviewHighlight}
      />
    );
  }
  return <></>;
}

export default function ProfessorInfoPage() {
  const { professorId } = useParams();
  const professorDataFetched = useDataFetch(`/api/professor/${professorId}`, {
    professorSummary: {
      firstName: "",
      lastName: "",
      badges: [],
      courses: [],
    },
    professorReviewHighlight: [],
  });

  const reviewDataFetched = useDataFetch(
    `/api/review/get/professor/${professorId}`,
    {
      reviews: [],
    }
  );

  const {
    professorSummary,
    professorReviewHighlight,
  } = professorDataFetched.data;
  const isProfessorLoading = professorDataFetched.isLoading;
  const isProfessorError = professorDataFetched.isError;

  const { reviews } = reviewDataFetched.data;
  const isReviewLoading = reviewDataFetched.isLoading;
  const isReviewError = reviewDataFetched.isError;

  if (isProfessorLoading || isProfessorError) {
    return isProfessorLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  if (isReviewLoading || isReviewError) {
    return isReviewLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      <ProfessorSummary
        badges={professorSummary.badges}
        courses={professorSummary.courses}
        firstName={professorSummary.firstName}
        lastName={professorSummary.lastName}
        professorId={Number(professorId)}
      />
      <ProfessorReviewHighlight
        professorReviewHighlight={professorReviewHighlight}
      />
      <ReviewSection
        associatedEntities={professorSummary.courses}
        id={Number(professorId)}
        initReviews={reviews}
        pageType="professor"
      />
    </>
  );
}

ProfessorCourseList.propTypes = propTypesProfessorCourses;

ProfessorSummary.propTypes = propTypesProfessorSummary;

ProfessorReviewCard.propTypes = propTypesReview;

SingleProfessorReviewHighlight.propTypes = propTypesReview;

DoubleProfessorReviewHighlight.propTypes = propTypesProfessorReviewHighlight;

ProfessorReviewHighlight.propTypes = propTypesProfessorReviewHighlight;
