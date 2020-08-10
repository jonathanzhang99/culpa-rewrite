import React from "react";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import ReviewSection from "components/reviews/ReviewSection"

export default function ReviewsPage() {
    // example courseId and sorting for testing
    // valid values for sorting: best, worst, oldest, newest, most disagreed
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
            <ReviewSection assocList={[]}
                           idProp={38} 
                           initReviews={reviews}
                           pageTypeProp="course" />
        </div>
    )
}