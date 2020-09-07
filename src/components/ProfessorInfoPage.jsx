import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";

import { CourseDisplayLink } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";
import ReviewCard from "components/reviews/ReviewCard";
import ReviewSection from "components/reviews/ReviewSection";

const defaultPropsProfessorCourses = {
  courses: [],
};

const propTypesProfessorCourses = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseProfessorId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    }).isRequired
  ),
};

function ProfessorCourseList({ courses }) {
  return (
    <>
      <span>Courses: </span>
      {courses.map(
        ({ courseProfessorId, courseName, courseCallNumber }, index) => {
          return (
            <span key={courseProfessorId}>
              <CourseDisplayLink
                courseCallNumber={courseCallNumber}
                courseId={courseProfessorId}
                courseName={courseName}
              />
              {index !== courses.length - 1 ? ", " : ""}
            </span>
          );
        }
      )}
    </>
  );
}

const propTypesReviewProfessorButton = {
  professorId: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

function ReviewProfessorButton({ professorId, firstName, lastName }) {
  return (
    <CreateReviewButton color="yellow" professorId={professorId.toString()}>
      WRITE A REVIEW FOR {firstName} {lastName}
    </CreateReviewButton>
  );
}

const propTypesProfessorSummary = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseProfessorId: PropTypes.number.isRequired,
      courseName: PropTypes.string.isRequired,
      courseCallNumber: PropTypes.string.isRequired,
    }).isRequired
  ),
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  professorId: PropTypes.number.isRequired,
};

export function ProfessorSummary({
  courses,
  firstName,
  lastName,
  professorId,
}) {
  return (
    <>
      <ProfessorDisplayName
        as="header"
        firstName={firstName}
        lastName={lastName}
      />
      <Container>
        <ProfessorCourseList courses={courses} />
      </Container>
      <ReviewProfessorButton
        firstName={firstName}
        lastName={lastName}
        professorId={professorId}
      />
    </>
  );
}

const reviewPropType = PropTypes.shape({
  reviewType: PropTypes.string.isRequired,
  reviewHeader: PropTypes.shape({
    profId: PropTypes.number.isRequired,
    profFirstName: PropTypes.string.isRequired,
    profLastName: PropTypes.string.isRequired,
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
    <Grid relaxed columns={2}>
      <Grid.Column key="most_agreed_review_highlight">
        <h3>Most Agreed Review</h3>
        <ProfessorReviewCard review={review} />
      </Grid.Column>
    </Grid>
  );
}

const propTypesProfessorReviewHighlight = {
  professorReviewHighlight: PropTypes.arrayOf(reviewPropType),
};

const defaultPropsProfessorReviewHighlight = {
  professorReviewHighlight: [],
};

function DoubleProfessorReviewHighlight({ professorReviewHighlight }) {
  return (
    <Grid relaxed columns={2}>
      <Grid.Column key="most_positive_review_highlight">
        <h3>Most Positive Review</h3>
        <ProfessorReviewCard review={professorReviewHighlight[0]} />
      </Grid.Column>
      <Grid.Column key="most_negative_review_highlight">
        <h3>Most Negative Review</h3>
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
      <DoubleProfessorReviewHighlight reviews={professorReviewHighlight} />
    );
  }
  return <></>
}

export default function ProfessorInfoPage() {
  const { professorId } = useParams();
  const professorDataFetched = useDataFetch(`/api/professor/${professorId}`, {
    professorSummary: {
      firstName: "",
      lastName: "",
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
ProfessorCourseList.defaultProps = defaultPropsProfessorCourses;

ReviewProfessorButton.propTypes = propTypesReviewProfessorButton;

ProfessorSummary.propTypes = propTypesProfessorSummary;
ProfessorSummary.defaultProps = defaultPropsProfessorCourses;

ProfessorReviewCard.propTypes = propTypesReview;

SingleProfessorReviewHighlight.propTypes = propTypesReview;

DoubleProfessorReviewHighlight.propTypes = propTypesProfessorReviewHighlight;
DoubleProfessorReviewHighlight.defaultProps = defaultPropsProfessorReviewHighlight;

ProfessorReviewHighlight.propTypes = propTypesProfessorReviewHighlight;
ProfessorReviewHighlight.defaultProps = defaultPropsProfessorReviewHighlight;
