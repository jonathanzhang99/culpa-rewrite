import PropTypes from "prop-types";
import React, { useState } from "react";
import { Icon, Accordion, Table, Grid, Container } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay";
import CreateReviewButton from "components/common/CreateReviewButton";
import { ProfessorDisplayLink } from "components/common/ProfessorDisplay";
import ReviewCard from "components/reviews/ReviewCard";

const propTypes = {
  courseId: PropTypes.number.isRequired,
  courseSummary: PropTypes.shape({
    courseName: PropTypes.string.isRequired,
    courseCallNumber: PropTypes.string.isRequired,
    departmentName: PropTypes.string.isRequired,
    associatedProfessors: PropTypes.array.isRequired,
  }).isRequired,
};

export default function CourseSummary({ courseId, courseSummary }) {
  return (
    <Grid>
      <Grid.Row>
        <CourseHeader courseId={courseId} courseSummary={courseSummary} />
      </Grid.Row>
      <Grid.Row>
        <ReviewSummary />
      </Grid.Row>
    </Grid>
  );
}

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
        as="h3"
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
                      as="h5"
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
    <h3>
      Professors:{" "}
      {associatedProfessors.map((professor, index) => {
        const { firstName, lastName, professorId } = professor;
        return (
          <span key={`${lastName}_${professorId}`}>
            <ProfessorDisplayLink
              as="span"
              firstName={firstName}
              lastName={lastName}
              professorId={professorId}
            />
            {associatedProfessors.length - 1 !== index ? ", " : ""}
          </span>
        );
      })}
    </h3>
  );

  return (
    <Container>
      <h1>
        <CourseDisplayName code={courseCallNumber} name={courseName} />
      </h1>
      <h3>Department: {departmentName}</h3>

      {displayAccordion ? ProfessorAccordion : ProfessorList}

      <CreateReviewButton compact color="yellow" courseId={courseId.toString()}>
        WRITE A REVIEW FOR {courseName}
      </CreateReviewButton>
    </Container>
  );
}

function ReviewSummary({ reviewSummary }) {
  const { positiveReviewSummary, negativeReviewSummary } = reviewSummary;
  const positiveReviewSummary = {
    reviewType: "course",
    reviewHeader: {
      courseId: 1,
      courseName: "Machine Learning",
      courseCode: "COMS 4771",
    },
    votes: {
      initUpvoteCount: 10,
      initDownvoteCount: 2,
      initFunnyCount: 27,
      upvoteClicked: false,
      downvoteClicked: false,
      funnyClicked: false,
    },
    workload: "",
    submissionDate: "2020-01-15",
    reviewId: 1,
    deprecated: false,
    content: "This is a review.",
  };

  const negativeReviewSummary = {
    reviewType: "course",
    reviewHeader: {
      courseId: 1,
      courseName: "Machine Learning",
      courseCode: "COMS 4771",
    },
    votes: {
      initUpvoteCount: 10,
      initDownvoteCount: 2,
      initFunnyCount: 27,
      upvoteClicked: false,
      downvoteClicked: false,
      funnyClicked: false,
    },
    workload: "",
    submissionDate: "2020-01-15",
    reviewId: 1,
    deprecated: false,
    content: "This is a review.",
  };

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={7}>
            <h3>Most Positive Review</h3>
            <ReviewCard
              content={positiveReviewSummary.content}
              deprecated={positiveReviewSummary.deprecated}
              reviewHeader={positiveReviewSummary.reviewHeader}
              reviewId={positiveReviewSummary.reviewId}
              reviewType={positiveReviewSummary.reviewType}
              submissionDate={positiveReviewSummary.submissionDate}
              votes={positiveReviewSummary.votes}
              workload={positiveReviewSummary.workload}
            />
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={7}>
            <h3>Most Negative Review</h3>
            <ReviewCard {...negativeReviewSummary} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

CourseSummary.propTypes = propTypes;
CourseHeader.propTypes = propTypes;
