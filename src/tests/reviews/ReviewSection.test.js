import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import ReviewSection from "components/reviews/ReviewSection"

describe("review section snapshot test", () => {
    const headersByType = [[
        {
            reviewType: 'professor',
            reviewHeader: {
                courseId: 1,
                courseName: 'Machine Learning',
                courseCode: 'COMS 4771'
            }
        }, {
            reviewType: 'professor',
            reviewHeader: {
                courseId: 5,
                courseName: 'Freedom of Speech and Press',
                courseCode: 'POLS 3285'    
            }
        }
    ], [{
            reviewType: 'course',
            reviewHeader: {
                profId: 1,
                profFirstName: 'Nakul',
                profLastName: 'Verma',
                uni: 'nv2274'
            }
        }, {
            reviewType: 'course',
            reviewHeader: {
                profId: 2,
                profFirstName: 'Lee',
                profLastName: 'Bollinger',
                uni: 'lcb50'    
            }
        }
    ]]

    const basicInfo = {
        votes: {
            initUpvoteCount: 3,
            initDownvoteCount: 2,
            initFunnyCount: 1,
            upvoteClicked: true,
            downvoteClicked: false,
            funnyClicked: true
        },
        content: "demo content",
        workload: "demo workload",
        submissionDate: "2020-01-01",
        deprecated: true
    }

    const assocLists = {
        course: [{
            professorId: 1,
            firstName: 'Nakul',
            lastName: 'Verma'
        }, {
            professorId: 2,
            firstName: 'Lee',
            lastName: 'Bollinger'
        }],
        professor: [{
            courseId: 1,
            courseName: 'Machine Learning',
            courseCode: 'COMS 4771'
        }, {
            courseId: 5,
            courseName: 'Freedom of Speech and Press',
            courseCode: 'POLS 3285'
        }]
    }
    headersByType.forEach((reviews) => {
        reviews.forEach((item, reviewId) => {
            item = Object.assign(item, basicInfo)
            item.reviewId = reviewId
        })
        test("snapshot test", () => {
            const snapshot = render(
                <MemoryRouter>
                    <ReviewSection 
                        initReviews={reviews}
                        pageType={reviews[0].reviewType}
                        id={1}
                        assocList={assocLists[reviews[0].reviewType]}
                    />
                </MemoryRouter>
            )
            expect(snapshot).toMatchSnapshot()
        })
    })
})