import PropTypes from "prop-types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Header, Icon, Accordion, Grid } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import { DepartmentDisplayLink } from "components/common/DepartmentDisplay";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";
import ReviewCard from "components/reviews/ReviewCard";
import ReviewSection from "components/reviews/ReviewSection";

const MAX_NUM_PROFESSORS_IN_LIST = 5;

const propTypesCourseProfessors = {
  courseProfessors: PropTypes.arrayOf(
    PropTypes.shape({
      badges: PropTypes.arrayOf(PropTypes.number).isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      professorId: PropTypes.number.isRequired,
      professorDepartments: PropTypes.arrayOf(
        PropTypes.shape({
          professorDepartmentId: PropTypes.number.isRequired,
          professorDepartmentName: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    })
  ).isRequired,
};

function ProfessorsList({ courseProfessors }) {
  return (
    <div className="add-margin">
      <Header className="no-vertical-margin">Professors: </Header>
      {courseProfessors.map(
        ({ badges, firstName, lastName, professorId }, index) => {
          return (
            <span key={professorId}>
              <ProfessorDisplayLink
                badges={badges}
                firstName={firstName}
                lastName={lastName}
                professorId={professorId}
              />
              {index !== courseProfessors.length - 1 ? ", " : ""}
            </span>
          );
        }
      )}
    </div>
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
      badges: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
};

function ProfessorsAccordion({
  isAccordionActive,
  setAccordionActive,
  courseProfessors,
}) {
  return (
    <Accordion className="add-margin">
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

function CourseProfessorsGrid({ courseProfessors }) {
  return (
    <Grid columns={2}>
      {courseProfessors.map(
        ({
          badges,
          firstName,
          lastName,
          professorId,
          professorDepartments,
        }) => {
          return (
            <Grid.Row key={`${professorId}_row`}>
              <Grid.Column key={`${professorId}_link`}>
                <ProfessorDisplayLink
                  badges={badges}
                  firstName={firstName}
                  lastName={lastName}
                  professorId={professorId}
                />
              </Grid.Column>
              <Grid.Column key={`${professorId}_departments`}>
                {professorDepartments.map(
                  (
                    { professorDepartmentId, professorDepartmentName },
                    index
                  ) => {
                    return (
                      <span key={professorDepartmentName}>
                        <DepartmentDisplayLink
                          departmentId={professorDepartmentId}
                          departmentName={professorDepartmentName}
                        />
                        {professorDepartments.length - 1 !== index ? ", " : ""}
                      </span>
                    );
                  }
                )}
              </Grid.Column>
            </Grid.Row>
          );
        }
      )}
    </Grid>
  );
}

const propTypesCourseInfo = {
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
    })
  ).isRequired,
};

export function CourseInfo({
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
        className="block-display"
        courseCallNumber={courseCallNumber}
        courseName={courseName}
        size="huge"
      />
      <Header>Department: </Header>
      <DepartmentDisplayLink
        departmentId={departmentId}
        departmentName={departmentName}
      />
      <ProfessorsComponent
        courseProfessors={courseProfessors}
        isAccordionActive={isAccordionActive}
        setAccordionActive={setAccordionActive}
      />
      <CreateReviewButton
        relaxed
        color="orange"
        courseId={courseId}
        subject={courseName}
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
    badges: PropTypes.arrayOf(PropTypes.number).isRequired,
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
  courseReviewHighlight: PropTypes.arrayOf(reviewPropType).isRequired,
};

function DoubleCourseReviewHighlight({ courseReviewHighlight }) {
  return (
    <>
      <Grid columns={2}>
        <Grid.Column>
          <Header>Most Positive Review</Header>
          <CourseReviewCard review={courseReviewHighlight[0]} />
        </Grid.Column>
        <Grid.Column>
          <Header>Most Negative Review</Header>
          <CourseReviewCard review={courseReviewHighlight[1]} />
        </Grid.Column>
      </Grid>
    </>
  );
}

const propTypesSingleCourseReviewHighlight = {
  courseReviewHighlight: PropTypes.arrayOf(reviewPropType).isRequired,
};

function SingleCourseReviewHighlight({ courseReviewHighlight }) {
  return (
    <>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Header>Most Agreed Review</Header>
            <CourseReviewCard review={courseReviewHighlight[0]} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
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

ProfessorsAccordion.propTypes = propTypesProfessorsAccordion;

ProfessorsComponent.propTypes = propTypesProfessorsAccordion;

CourseProfessorsGrid.propTypes = propTypesCourseProfessors;

CourseInfo.propTypes = propTypesCourseInfo;

CourseReviewCard.propTypes = propTypesCourseReviewCard;

DoubleCourseReviewHighlight.propTypes = propTypesDoubleCourseReviewHighlight;

SingleCourseReviewHighlight.propTypes = propTypesSingleCourseReviewHighlight;

CourseReviewHighlight.propTypes = propTypesCourseReviewHighlight;
CourseReviewHighlight.defaultProps = defaultPropsCourseReviewHighlight;
