import React from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
} from "semantic-ui-react";

import ErrorComponent from "components/common/ErrorComponent";
import Form from "components/common/Form";
import {
  RadioInputGroup,
  TextAreaInput,
  TextInput,
} from "components/common/Inputs";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";

function TopPanel() {
  return (
    <Grid columns={2}>
      <Grid.Column>
        <Link to="/admin">
          <Icon name="angle left" />
          <Header className="no-margin"> Back </Header>
        </Link>
      </Grid.Column>
      <Grid.Column textAlign="right">Logout</Grid.Column>
    </Grid>
  );
}

export default function AdminApprovalPage() {
  /* * * * * * * * * * * * * * * * *
   * Form contents                 *
   * * * * * * * * * * * * * * * * */

  const evaluationTexts = [
    "One of the worst experiences at Columbia. Avoid at all costs",
    "Strong negative experience. Take only if necessary",
    "Both negatives and positives much like life itself",
    "Strong positive experience. Take if possible",
    "A Columbia gem. Life-changing moments await",
  ];

  const decisionTexts = ["Publish", "Reject"];

  const generateRadioLabels = (texts) => {
    return texts.map((label, idx) => {
      return {
        label,
        key: idx + 1,
      };
    });
  };

  /* * * * * * * * * * * * * * * * *
   * Form methods                  *
   * * * * * * * * * * * * * * * * */

  const history = useHistory();

  const onSubmitReviewSuccess = () => {
    history.push(`/admin`);
  };

  /* * * * * * * * * * * * * * * * *
   * Review data                   *
   * * * * * * * * * * * * * * * * */

  const { reviewId } = useParams();

  const {
    data: { review, flag },
    isLoading,
    isError,
  } = useDataFetch(`/api/review/${reviewId}`, {
    review: {
      reviewHeader: {
        course: {},
        professor: {},
      },
    },
    flag: "pending",
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      {flag === "pending" ? (
        <>
          <TopPanel />
          <Header size="huge">Admin Approval Form</Header>
          <Divider />
          <Form
            mode="onSubmit"
            onSubmit={() => {}}
            onSuccess={onSubmitReviewSuccess}
          >
            <TextInput
              readOnly
              label="Professor"
              name="professor"
              value={`${review.reviewHeader.professor.profFirstName} ${review.reviewHeader.professor.profLastName}`}
              width={10}
            />
            <TextInput
              readOnly
              label="Course"
              name="course"
              value={`[${review.reviewHeader.course.courseCode}] ${review.reviewHeader.course.courseName}`}
              width={10}
            />
            <TextAreaInput
              readOnly
              label="General Review"
              name="general-review"
              rows={8}
              value={review.content}
            />
            <TextAreaInput
              readOnly
              label="Workload Review"
              name="workload-review"
              rows={8}
              value={review.workload}
            />
            <RadioInputGroup
              readOnly
              labels={generateRadioLabels(evaluationTexts)}
              name="evaluation"
              value={review.rating}
            />
            <Divider />
            <Header size="tiny">
              Would you like to publish or reject this review?
            </Header>
            <RadioInputGroup
              grouped
              labels={generateRadioLabels(decisionTexts)}
              name="decision"
              rules={{ required: "Please make the decision" }}
            />
            <Container textAlign="center">
              <Button name="submit" size="huge" type="submit">
                Complete Review
              </Button>
            </Container>
          </Form>
        </>
      ) : (
        <Redirect to="/admin" />
      )}
    </>
  );
}
