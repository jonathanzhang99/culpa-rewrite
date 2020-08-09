import React from "react";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import ReviewSection from "components/reviews/ReviewSection"

export default function ReviewsPage() {
    // courseId for testing
    const courseId = 38
    const { 
        data : { reviews },
        isLoading,
        isError,
    } = useDataFetch(`/api/review/get?type=course&courseId=${courseId}`, {
        reviews: []
    })

    if (isLoading || isError) {
        return isLoading ? <LoadingComponent /> : <ErrorComponent />;
      }

    return (
        <div>
            <p>placeholder for other components</p>
            <ReviewSection reviews={reviews}/>
        </div>
    )
}