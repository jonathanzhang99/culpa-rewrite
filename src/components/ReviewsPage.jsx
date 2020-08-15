import React from "react";
import { Container } from "semantic-ui-react"

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import useDataFetch from "components/common/useDataFetch";
import ReviewSection from "components/reviews/ReviewSection"

export default function ReviewsPage() {
    // example courseId and sorting for testing
    const professorId = 40
    const exampleAssocList = [{
        'courseId': 38,
        'courseCode': 'COMS W4170',
        'courseName': 'User Interface Design'
    }]
    
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
        <Container style={{minHeight: '100vh'}}>
            <p>placeholder for other components</p>
            <ReviewSection assocList={exampleAssocList}
                           id={40} 
                           initReviews={reviews}
                           pageType="professor" />
        </Container>
    )
}
