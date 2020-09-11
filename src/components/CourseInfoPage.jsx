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
import ReviewSection from "components/reviews/ReviewSection";

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

function ProfessorsList({ courseProfessors }) {
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

function ProfessorsAccordion({
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

function ProfessorsComponent({
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

function ProfessorDepartmentColumn({ professorId, professorDepartments }) {
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

function CourseProfessorsGrid({ courseProfessors }) {
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

function ReviewCourseButton({ courseId, courseName }) {
  return (
    <CreateReviewButton color="orange" courseId={courseId.toString()}>
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

const propTypesDoubleCourseReviewHighlight = {
  courseReviewHighlight: PropTypes.arrayOf(reviewPropType),
};

const defaultPropsDoubleCourseReviewHighlight = {
  courseReviewHighlight: [],
};

function DoubleCourseReviewHighlight({ courseReviewHighlight }) {
  return (
    <Container>
      <Grid relaxed columns={2}>
        <Grid.Column>
          <h3>Most Positive Review</h3>
          <CourseReviewCard review={courseReviewHighlight[0]} />
        </Grid.Column>
        <Grid.Column>
          <h3>Most Negative Review</h3>
          <CourseReviewCard review={courseReviewHighlight[1]} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

const propTypesSingleCourseReviewHighlight = {
  courseReviewHighlight: PropTypes.arrayOf(reviewPropType),
};

const defaultPropsSingleCourseReviewHighlight = {
  courseReviewHighlight: [],
};

function SingleCourseReviewHighlight({ courseReviewHighlight }) {
  return (
    <Container>
      <Grid relaxed columns={2}>
        <Grid.Row>
          <Grid.Column>
            <h3>Most Agreed Review</h3>
            <CourseReviewCard review={courseReviewHighlight[0]} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
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
    return (
      <DoubleCourseReviewHighlight
        courseReviewHighlight={courseReviewHighlight}
      />
    );
  }
  if (courseReviewHighlight.length === 1) {
    return (
      <SingleCourseReviewHighlight
        courseReviewHighlight={courseReviewHighlight}
      />
    );
  }

  return null;
}

export default function CourseInfoPage() {
  const { courseId } = useParams();

  const courseDataFetched = useDataFetch(`/api/course/${courseId}`, {
    courseSummary: {
      courseName: "",
      courseCallNumber: "",
      departmentId: 0,
      departmentName: "",
      courseProfessors: [],
    },
    courseReviewHighlight: [],
  });

  const { courseSummary, courseReviewHighlight } = courseDataFetched.data;
  const isCourseLoading = courseDataFetched.isLoading;
  const isCourseError = courseDataFetched.isError;

  const reviewDataFetched = useDataFetch(`/api/review/get/course/${courseId}`, {
    reviews: [],
  });

  const { reviews } = reviewDataFetched.data;
  const isReviewLoading = reviewDataFetched.isLoading;
  const isReviewError = reviewDataFetched.isError;

  if (isCourseLoading || isCourseError) {
    return isCourseLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  if (isReviewLoading || isReviewError) {
    return isReviewLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      <CourseInfo
        courseCallNumber={courseSummary.courseCallNumber}
        courseId={Number(courseId)}
        courseName={courseSummary.courseName}
        courseProfessors={courseSummary.courseProfessors}
        departmentId={courseSummary.departmentId}
        departmentName={courseSummary.departmentName}
      />
      <CourseReviewHighlight courseReviewHighlight={courseReviewHighlight} />
      <ReviewSection
        associatedEntities={courseSummary.courseProfessors}
        id={Number(courseId)}
        initReviews={reviews}
        pageType="course"
      />
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

DoubleCourseReviewHighlight.propTypes = propTypesDoubleCourseReviewHighlight;
DoubleCourseReviewHighlight.defaultProps = defaultPropsDoubleCourseReviewHighlight;

SingleCourseReviewHighlight.propTypes = propTypesSingleCourseReviewHighlight;
SingleCourseReviewHighlight.defaultProps = defaultPropsSingleCourseReviewHighlight;

CourseReviewHighlight.propTypes = propTypesCourseReviewHighlight;
CourseReviewHighlight.defaultProps = defaultPropsCourseReviewHighlight;
