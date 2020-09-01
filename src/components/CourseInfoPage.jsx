import PropTypes from "prop-types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Icon, Accordion, Grid, Container } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";
import ReviewCard from "components/reviews/ReviewCard";

const MAX_NUM_PROFESSORS_IN_LIST = 5;

const defaultProps = {
  courseProfessors: [],
};

const propTypesCourseProfessors = {
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ),
};

export function ProfessorsList({ courseProfessors }) {
  return (
    <>
      <span>Professors: </span>
      {courseProfessors.map(({ firstName, lastName, professorId }, index) => {
        return (
          <span key={professorId}>
            <ProfessorDisplayLink
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
            />
            {index !== courseProfessors.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </>
  );
}

const propTypesProfessorsAccordion = {
  isAccordionActive: PropTypes.bool.isRequired,
  setAccordionActive: PropTypes.func.isRequired,
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ),
};

export function ProfessorsAccordion({
  isAccordionActive,
  setAccordionActive,
  courseProfessors,
}) {
  return (
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
        <CourseProfessorsGrid courseProfessors={courseProfessors} />
      </Accordion.Content>
    </Accordion>
  );
}

export function ProfessorsComponent({
  isAccordionActive,
  setAccordionActive,
  courseProfessors,
}) {
  return courseProfessors.length > MAX_NUM_PROFESSORS_IN_LIST ? (
    <ProfessorsAccordion
      courseProfessors={courseProfessors}
      isAccordionActive={isAccordionActive}
      setAccordionActive={setAccordionActive}
    />
  ) : (
    <ProfessorsList courseProfessors={courseProfessors} />
  );
}

const propTypesProfessorDepartmentColumn = {
  professorId: PropTypes.number.isRequired,
  professorDepartments: PropTypes.arrayOf(
    PropTypes.shape({
      professorDepartmentId: PropTypes.number.isRequired,
      professorDepartmentName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export function ProfessorDepartmentColumn({
  professorId,
  professorDepartments,
}) {
  return (
    <Grid.Column key={`${professorId}_departments`}>
      {professorDepartments.map(
        ({ professorDepartmentId, professorDepartmentName }, index) => {
          return (
            <div key={professorDepartmentName}>
              <DepartmentDisplayLink
                departmentId={professorDepartmentId}
                departmentName={professorDepartmentName}
              />
              {professorDepartments.length - 1 !== index ? ", " : ""}
            </div>
          );
        }
      )}
    </Grid.Column>
  );
}

export function CourseProfessorsGrid({ courseProfessors }) {
  return (
    <Grid columns={2}>
      {courseProfessors.map(
        ({ firstName, lastName, professorId, professorDepartments }) => {
          return (
            <Grid.Row key={`${professorId}_row`}>
              <Grid.Column key={`${professorId}_link`}>
                <ProfessorDisplayLink
                  firstName={firstName}
                  lastName={lastName}
                  professorId={professorId}
                />
              </Grid.Column>
              <ProfessorDepartmentColumn
                professorDepartments={professorDepartments}
                professorId={professorId}
              />
            </Grid.Row>
          );
        }
      )}
    </Grid>
  );
}

const propTypesReviewCourseButton = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
};

export function ReviewCourseButton({ courseId, courseName }) {
  return (
    <CreateReviewButton color="yellow" courseId={courseId.toString()}>
      WRITE A REVIEW FOR {courseName}
    </CreateReviewButton>
  );
}

const propTypesCourseInfo = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  courseCallNumber: PropTypes.string.isRequired,
  departmentId: PropTypes.number.isRequired,
  departmentName: PropTypes.string.isRequired,
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ),
};

export function CourseInfo({
  courseId,
  courseName,
  courseCallNumber,
  departmentId,
  departmentName,
  courseProfessors,
}) {
  const [isAccordionActive, setAccordionActive] = useState(false);
  return (
    <>
      <CourseDisplayName
        as="header"
        courseCallNumber={courseCallNumber}
        courseName={courseName}
      />
      <Container>
        <Container>
          <span>Department: </span>
          <DepartmentDisplayLink
            departmentId={departmentId}
            departmentName={departmentName}
          />
        </Container>
        <ProfessorsComponent
          courseProfessors={courseProfessors}
          isAccordionActive={isAccordionActive}
          setAccordionActive={setAccordionActive}
        />
      </Container>
      <ReviewCourseButton courseId={courseId} courseName={courseName} />
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

const propTypesCourseReviewHighlight = {
  courseReviewHighlight: PropTypes.arrayOf(reviewPropType),
};

const defaultPropsCourseReviewHighlight = {
  courseReviewHighlight: [],
};

function CourseReviewHighlight({ courseReviewHighlight }) {
  /* 
      NOTE: courseReviewHighlight[0] is the most positive and
            [1] the most negative (when the length is 2)

      courseReviewHighlight can have lengths 0-2:
        2: There are most positive and negative reviews
        1: Either most positive and negative reviews are the same review
           or there is only one review for the course
        0: There are no reviews for the course
  */

  if (courseReviewHighlight.length === 2) {
    const positiveReview = courseReviewHighlight[0];
    const negativeReview = courseReviewHighlight[1];
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
  if (courseReviewHighlight.length === 1) {
    const mostAgreedReview = courseReviewHighlight[0];
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

  return null;
}

export default function CourseInfoPage() {
  const { courseId } = useParams();
  const {
    data: { courseInfo, courseReviewHighlight },
    isLoading,
    isError,
  } = useDataFetch(`/api/course/${courseId}`, {
    courseInfo: {
      courseName: "",
      courseCallNumber: "",
      departmentId: 0,
      departmentName: "",
      courseProfessors: [],
    },
    courseReviewHighlight: [],
  });
  // TODO: load and return Review Summary data here

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      <CourseInfo
        courseCallNumber={courseInfo.courseCallNumber}
        courseId={Number(courseId)}
        courseName={courseInfo.courseName}
        courseProfessors={courseInfo.courseProfessors}
        departmentId={courseInfo.departmentId}
        departmentName={courseInfo.departmentName}
      />
      <CourseReviewHighlight courseReviewHighlight={courseReviewHighlight} />
    </>
  );
}
ProfessorsList.propTypes = propTypesCourseProfessors;
ProfessorsList.defaultProps = defaultProps;

ProfessorsAccordion.propTypes = propTypesProfessorsAccordion;
ProfessorsAccordion.defaultProps = defaultProps;

ProfessorsComponent.propTypes = propTypesProfessorsAccordion;
ProfessorsComponent.defaultProps = defaultProps;

CourseProfessorsGrid.propTypes = propTypesCourseProfessors;
CourseProfessorsGrid.defaultProps = defaultProps;

ProfessorDepartmentColumn.propTypes = propTypesProfessorDepartmentColumn;

ReviewCourseButton.propTypes = propTypesReviewCourseButton;

CourseInfo.propTypes = propTypesCourseInfo;
CourseInfo.defaultProps = defaultProps;

CourseReviewCard.propTypes = propTypesCourseReviewCard;

CourseReviewHighlight.propTypes = propTypesCourseReviewHighlight;
CourseReviewHighlight.defaultProps = defaultPropsCourseReviewHighlight;
