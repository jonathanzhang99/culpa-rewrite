import React from "react";

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import ReviewSection from "components/reviews/ReviewSection"

export default function ReviewsPage() {
    // example courseId and sorting for testing
    const professorId = 40
    const { 
        data : { reviews },
        isLoading,
        isError,
    } = useDataFetch(`/api/review/get?type=professor&professorId=${professorId}`, {
        reviews: []
    })

    if (isLoading || isError) {
        return isLoading ? <LoadingComponent /> : <ErrorComponent />;
      }

    return (
        <div>
            <p>placeholder for other components</p>
            <ReviewSection assocList={[]}
                           id={40} 
                           initReviews={reviews}
                           pageType="professor" />
        </div>
    )
}
