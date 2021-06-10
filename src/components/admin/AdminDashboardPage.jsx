import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Segment,
} from "semantic-ui-react";

import { AuthContext } from "components/common/Authentication";
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";

const NUM_REVIEWS_PER_PAGE = 7;

function TopPanel() {
  return (
    <Grid columns={2}>
      <Grid.Column>
        <Header size="huge"> Welcome Back! </Header>
      </Grid.Column>
      <Grid.Column textAlign="right">Logout</Grid.Column>
    </Grid>
  );
}

function AdminDashboard({
  pendingReviewsCount,
  pendingProfessorsCount,
  pendingCoursesCount,
  pendingRelationshipsCount,
}) {
  return (
    <Grid columns={4} textAlign="center">
      <Grid.Row>
        <Grid.Column>
          <Header className="no-margin" color="blue" size="massive">
            {pendingReviewsCount}
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header className="no-margin" color="blue" size="massive">
            {pendingProfessorsCount}
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header className="no-margin" color="blue" size="massive">
            {pendingCoursesCount}
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header className="no-margin" color="blue" size="massive">
            {pendingRelationshipsCount}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Header className="no-margin" color="linkColor" size="huge">
            Reviews
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header className="no-margin" color="linkColor" size="huge">
            Professors
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header className="no-margin" color="linkColor" size="huge">
            Courses
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header className="no-margin" color="linkColor" size="huge">
            Course-Professor Relationships
          </Header>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

function PendingReviews({ reviews, pageNumber }) {
  /* as Segment because of styling */
  return reviews
    .slice(0, pageNumber * NUM_REVIEWS_PER_PAGE)
    .map(({ reviewId, reviewHeader }) => (
      <Link to={`/admin/${reviewId}`} key={reviewId}>
        <Button className="pending-review" as={Segment} fluid padded raised>
          <Grid>
            <Grid.Column textAlign="left" width={12}>
              {`[${reviewHeader.courseCallNumber}] ${reviewHeader.courseName}`}
            </Grid.Column>
            <Grid.Column textAlign="right" width={4}>
              {`ID: ${reviewId}`}
              <Icon color="blue" name="angle right" />
            </Grid.Column>
          </Grid>
        </Button>
      </Link>
    ));
}

export default function AdminDashboardPage() {
  const { logout } = useContext(AuthContext);

  const {
    data: {
      pendingReviewsCount,
      pendingProfessorsCount,
      pendingCoursesCount,
      pendingRelationshipsCount,
    },
    isDashboardLoading,
    isDashboardError,
  } = useDataFetch(`/api/admin/dashboard`, {
    pendingReviewsCount: 0,
    pendingProfessorsCount: 0,
    pendingCoursesCount: 0,
    pendingRelationshipsCount: 0,
  });

  const {
    data: { reviews },
    areReviewsLoading,
    areReviewsError,
  } = useDataFetch(`/api/review/pending`, {
    reviews: [],
  });

  /* * * * * * * * * * * * * * * * *
   * Pagination                    *
   * * * * * * * * * * * * * * * * */

  const [pageNumber, setPageNumber] = useState(1);
  const onClickPagButton = () => setPageNumber(pageNumber + 1);

  if (isDashboardLoading || isDashboardError) {
    return isDashboardLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  if (areReviewsLoading || areReviewsError) {
    return areReviewsLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <>
      <TopPanel />
      <Header className="block-display" size="huge" textAlign="center">
        Admin Dashboard
      </Header>
      <Divider section />
      <AdminDashboard
        pendingReviewsCount={pendingReviewsCount}
        pendingProfessorsCount={pendingProfessorsCount}
        pendingCoursesCount={pendingCoursesCount}
        pendingRelationshipsCount={pendingRelationshipsCount}
      />
      <Divider section />
      <Header className="block-display" size="huge" textAlign="center">
        Pending Reviews
      </Header>
      <Divider hidden />
      <PendingReviews reviews={reviews} pageNumber={pageNumber} />
      <Button
        fluid
        name="showMoreButton"
        size="large"
        onClick={onClickPagButton}
      >
        Show more <Icon name="arrow down" />
      </Button>
    </>
  );
}
