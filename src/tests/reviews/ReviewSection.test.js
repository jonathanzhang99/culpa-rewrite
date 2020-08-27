import { act, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import ReviewSection from "components/reviews/ReviewSection"

const headersByType = [[
    {
        reviewId: 1,
        reviewType: 'professor',
        reviewHeader: {
            courseId: 1,
            courseName: 'Machine Learning',
            courseCode: 'COMS 4771'
        },
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
    }, {
        reviewId: 2,
        reviewType: 'professor',
        reviewHeader: {
            courseId: 5,
            courseName: 'Freedom of Speech and Press',
            courseCode: 'POLS 3285'    
        },
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
        deprecated: false
    }
], [{
        reviewId: 1,
        reviewType: 'course',
        reviewHeader: {
            profId: 1,
            profFirstName: 'Nakul',
            profLastName: 'Verma',
            uni: 'nv2274'
        },
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
    }, {
        reviewId: 2,
        reviewType: 'course',
        reviewHeader: {
            profId: 2,
            profFirstName: 'Lee',
            profLastName: 'Bollinger',
            uni: 'lcb50'    
        },        votes: {
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
        deprecated: false
    }
]]

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
        courseId: 2,
        courseName: 'Freedom of Speech and Press',
        courseCode: 'POLS 3285'
    }]
}

const singleDropdowns = [{
    name: "sortingDropdown",
    options: [
        {text: "Most Positive", value: "Most Positive"},
        {text: 'Most Negative', value: 'Most Negative'},
        {text: 'Newest', value: 'Newest'},
        {text: 'Oldest', value: 'Oldest'},
        {text: 'Most Agreed', value: 'Most Agreed'},
        {text: 'Most Disagreed', value: 'Most Disagreed'}
    ]
}, {
    name: "filteringSingleSelectDropdown",
    options: [
        {text: 'Written within 2 years', value: 2},
        {text: 'Written within 5 years', value: 5}
    ]
}]

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ reviews: headersByType[0]}),
  })
);
const pageId = 12345


describe("review section snapshot tests", () => {
    headersByType.forEach((reviews) => {
        const pageType = reviews[0].reviewType

        test(`${reviews[0].reviewType} page test`, () => {
            const snapshot = render(
                <MemoryRouter>
                    <ReviewSection 
                        assocList={assocLists[pageType]}
                        id={pageId}
                        initReviews={reviews}
                        pageType={pageType}
                    />
                </MemoryRouter>
            )
            expect(snapshot).toMatchSnapshot()
        })
    })
})


describe("filtering and sorting tests", () => {
    headersByType.forEach((reviews) => {
        const pageType = reviews[0].reviewType
        describe(`${pageType} page test`, () => {
            beforeEach(() => {
                render(
                    <MemoryRouter>
                        <ReviewSection 
                            assocList={assocLists[pageType]}
                            id={pageId}
                            initReviews={reviews}
                            pageType={pageType}
                        />
                    </MemoryRouter>
                )
            })
        
            singleDropdowns.forEach(({name, options}) => {
                options.forEach((option) => {
                    test(`choosing ${option.text} for ${name}`, async () => {
                        await act(async () => {fireEvent.click(screen.getByText(option.text))})

                        const sortingArg = name === 'sortingDropdown' ? option.value : ''
                        const filterSingleArg = name ==='filteringSingleSelectDropdown' ? option.value : null
                        const expectedUrl = `/api/review/get/${pageType}/${pageId}` +
                                            `?sorting=${sortingArg}` +
                                            `&filterList=` +
                                            `&filterYear=${filterSingleArg}`
                        expect(fetch).toHaveBeenCalledWith(
                            expectedUrl,
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                }
                            }
                        )
                    })
                })
                
            })

            assocLists[pageType].forEach((option) => {
                const text = pageType === 'professor' ? 
                    `[${option.courseCode}] ${option.courseName}` :
                    `${option.firstName} ${option.lastName}`
                const optionId = pageType === 'professor' ? option.courseId : option.professorId
                
                test(`testing single option '${text}' with multi selection`, async () => {
                    const elem = screen.getAllByRole('option').filter((item) => {
                        return item.textContent === text
                    })[0]
                    await act(async () => {fireEvent.click(elem)})
                    expect(fetch).toHaveBeenCalledWith(
                        `/api/review/get/${pageType}/${pageId}` +
                        `?sorting=&filterList=${optionId}&filterYear=null`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            }
                        }
                    )
                })
            })            
        })
    })
})