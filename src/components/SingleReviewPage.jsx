import PropTypes from "prop-types";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Header, Button } from "semantic-ui-react";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import ReviewCard from "components/reviews/ReviewCard";

const propTypesThankYouTextBox = {
  reviewId: PropTypes.number.isRequired,
};

export function ThankYouTextBox({ reviewId }) {
  return (
    <Container fluid style={{ margin: "20vh" }} textAlign="center">
      <div>
        <Header size="huge">Thank you!</Header>
      </div>
      <div>
        <Header>
          Please save your
          <span style={{ color: "#004E8D" }}> Review ID: {reviewId} </span>
          in case you need to refer to your submission in the future.
        </Header>
      </div>
      <div>
        <Link to="/review/submit">
          <Button className="relaxed" color="orange" size="huge">
            WRITE ANOTHER REVIEW
          </Button>
        </Link>
        <Link to="/">
          <Button className="relaxed" color="blue" size="huge">
            BACK TO HOMEPAGE
          </Button>
        </Link>
      </div>
    </Container>
  );
}

ThankYouTextBox.propTypes = propTypesThankYouTextBox;

export default function SingleReviewPage() {
  const { reviewId } = useParams();
  const {
    data: { review, flag },
    isLoading,
    isError,
  } = useDataFetch(`/api/review/${reviewId}`, {
    review: {},
    flag: "",
  });

  if (isLoading || isError) {
    return isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      {flag === "approved" ? (
        <ReviewCard
          content={review.content}
          deprecated={review.deprecated}
          rating={review.rating}
          reviewHeader={review.reviewHeader}
          reviewId={review.reviewId}
          reviewType={review.reviewType}
          submissionDate={review.submissionDate}
          votes={review.votes}
          workload={review.workload}
        />
      ) : (
        review.reviewId && <ThankYouTextBox reviewId={review.reviewId} />
      )}
    </>
  );
}
