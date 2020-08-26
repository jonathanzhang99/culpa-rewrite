import PropTypes from "prop-types";
import React, { useState } from "react";
import { Icon, Accordion, Table, Grid, Container } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import ReviewCard from "components/reviews/ReviewCard";

const reviewPropType = PropTypes.shape({
  reviewType: PropTypes.string.isRequired,
  reviewHeader: PropTypes.shape({
    courseId: PropTypes.number.isRequired,
    courseName: PropTypes.string.isRequired,
    courseCode: PropTypes.string.isRequired,
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

const defaultReview = {
  reviewType: "course",
  reviewHeader: {
    courseId: 0,
    courseName: "Course Name",
    courseCode: "Course Code",
  },
  votes: {
    initUpvoteCount: 0,
    initDownvoteCount: 0,
    initFunnyCount: 0,
    upvoteClicked: false,
    downvoteClicked: false,
    funnyClicked: false,
  },
  workload: "",
  submissionDate: "",
  reviewId: 0,
  deprecated: false,
  content: "This is a review.",
};

const propTypesCourseSummary = {
  courseId: PropTypes.string.isRequired,
  courseSummary: PropTypes.shape({
    courseName: PropTypes.string.isRequired,
    courseCallNumber: PropTypes.string.isRequired,
    departmentName: PropTypes.string.isRequired,
    associatedProfessors: PropTypes.array.isRequired,
  }).isRequired,
  reviewSummary: PropTypes.shape({
    positiveReview: reviewPropType,
    negativeReview: reviewPropType,
  }),
};

const defaultPropsCourseSummary = {
  reviewSummary: {
    positiveReivew: defaultReview,
    negativeReview: defaultReview,
  },
};

export default function CourseSummary({
  courseId,
  courseSummary,
  reviewSummary,
}) {
  return (
    <Grid>
      <Grid.Row>
        <CourseHeader courseId={courseId} courseSummary={courseSummary} />
      </Grid.Row>
      <Grid.Row>
        <ReviewSummary reviewSummary={reviewSummary} />
      </Grid.Row>
    </Grid>
  );
}

CourseSummary.propTypes = propTypesCourseSummary;
CourseSummary.defaultProps = defaultPropsCourseSummary;

const propTypesCourseHeader = {
  courseId: PropTypes.string.isRequired,
  courseSummary: PropTypes.shape({
    courseName: PropTypes.string.isRequired,
    courseCallNumber: PropTypes.string.isRequired,
    departmentName: PropTypes.string.isRequired,
    associatedProfessors: PropTypes.array.isRequired,
  }).isRequired,
};

export function CourseHeader({ courseId, courseSummary }) {
  const [isAccordionActive, setAccordionActive] = useState(false);
  const {
    courseName,
    courseCallNumber,
    departmentName,
    associatedProfessors,
  } = courseSummary;

  const displayAccordion = associatedProfessors.length > 5;

  const ProfessorAccordion = (
    <Accordion>
      <Accordion.Title
        active={isAccordionActive}
        onClick={() => setAccordionActive(!isAccordionActive)}
      >
        <Icon name={!isAccordionActive ? "angle down" : "angle up"} />
        {!isAccordionActive ? "Show" : "Hide"} all professors who teach this
        course
      </Accordion.Title>
      <Accordion.Content active={isAccordionActive}>
        <Table basic="very" textAlign="left">
          <tbody>
            {/* this is to prevent bugs from browser inserting <tbody> */}
            {associatedProfessors.map((professor) => {
              const {
                firstName,
                lastName,
                professorId,
                profDepartments,
              } = professor;
              return (
                <Table.Row key={professorId}>
                  <Table.Cell key={professorId}>
                    <ProfessorDisplayLink
                      firstName={firstName}
                      lastName={lastName}
                      professorId={professorId}
                    />
                  </Table.Cell>
                  <Table.Cell key={`${professorId}_departments`}>
                    {profDepartments.map((department, index) => {
                      const {
                        profDepartmentId,
                        profDepartmentName,
                      } = department;
                      return (
                        <span key={profDepartmentId}>
                          {profDepartmentId}: {profDepartmentName}
                          {profDepartments.length - 1 !== index ? ", " : ""}
                        </span>
                      );
                    })}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </tbody>
        </Table>
      </Accordion.Content>
    </Accordion>
  );

  const ProfessorList = (
    <div>
      Professors:{" "}
      {associatedProfessors.map((professor, index) => {
        const { firstName, lastName, professorId } = professor;
        return (
          <span key={`${lastName}_${professorId}`}>
            <ProfessorDisplayLink
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
            />
            {associatedProfessors.length - 1 !== index ? ", " : ""}
          </span>
        );
      })}
    </div>
  );

  // TODO: Integrate DepartmentDisplay
  return (
    <Container>
      <CourseDisplayName
        as="header"
        courseCallNumber={courseCallNumber}
        courseName={courseName}
      />
      <div> Department: {departmentName} </div>

      {displayAccordion ? ProfessorAccordion : ProfessorList}

      <CreateReviewButton compact color="yellow" courseId={courseId.toString()}>
        WRITE A REVIEW FOR {courseName}
      </CreateReviewButton>
    </Container>
  );
}

CourseHeader.propTypes = propTypesCourseHeader;

const propTypesReviewSummary = {
  reviewSummary: PropTypes.oneOfType([
    PropTypes.shape({
      positiveReview: reviewPropType,
      negativeReview: reviewPropType,
    }),
    PropTypes.shape({
      mostAgreedReview: reviewPropType,
    }),
  ]),
};

const defaultPropsReviewSummary = {
  reviewSummary: {
    positiveReivew: defaultReview,
    negativeReview: defaultReview,
  },
};

function ReviewSummary({ reviewSummary }) {
  if ("mostAgreedReview" in reviewSummary) {
    const { mostAgreedReview } = reviewSummary;
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={14}>
              <h3>Most Agreed Review</h3>
              <CourseReviewCard review={mostAgreedReview} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  if ("positiveReview" in reviewSummary && "negativeReview" in reviewSummary) {
    const { positiveReview, negativeReview } = reviewSummary;
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <h3>Most Positive Review</h3>
              <CourseReviewCard review={positiveReview} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={7}>
              <h3>Most Negative Review</h3>
              <CourseReviewCard review={negativeReview} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  return null;
}

ReviewSummary.propTypes = propTypesReviewSummary;
ReviewSummary.defaultProps = defaultPropsReviewSummary;

const propTypesCourseReviewCard = {
  review: reviewPropType.isRequired,
};

function CourseReviewCard({ review }) {
  const {
    reviewType,
    reviewHeader,
    votes,
    workload,
    submissionDate,
    reviewId,
    deprecated,
    content,
  } = review;

  return (
    <ReviewCard
      content={content}
      deprecated={deprecated}
      reviewHeader={reviewHeader}
      reviewId={reviewId}
      reviewType={reviewType}
      submissionDate={submissionDate}
      votes={votes}
      workload={workload}
    />
  );
}

CourseReviewCard.propTypes = propTypesCourseReviewCard;
