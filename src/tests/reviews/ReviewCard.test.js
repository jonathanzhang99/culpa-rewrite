import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "components/common/Authentication";
import ReviewCard from "components/reviews/ReviewCard";

jest.mock('components/common/useDataFetch')

describe("ReviewCard tests setup", () => {
  const testParams = [{
     testName: "complete & normal",
     onlyProf: true, 
     onlyCourse: true, 
     reviewId: 12345,
     submissionDate: "2020-02-01",
     upvotes: 10,
     downvotes: 2,
     funnys: 3,
     profFirstName: "Adam",
     profLastName: "Canon",
     courseCode: "COMS1004",
     courseName: "Intro to Programming", 
     content: "an interesting class"
  }, {
     testName: "profCard",
     onlyProf: true, 
     onlyCourse: false, 
     reviewId: 12345,
     submissionDate: "2020-02-01",
     upvotes: 10,
     downvotes: 2,
     funnys: 3,
     profFirstName: "",
     profLastName: "",
     courseCode: "COMS1004",
     courseName: "Intro to Programming", 
     content: "an interesting class",
  }, {
     testName: "courseCard",
     onlyProf: false, 
     onlyCourse: true, 
     reviewId: 12345,
     submissionDate: "2020-02-01",
     upvotes: 10,
     downvotes: 2,
     funnys: 3,
     profFirstName: "Adam",
     profLastName: "Canon",
     courseCode: "",
     courseName: "", 
     content: "an interesting class"
  }]

  const clickedStates = [{
     upvoteClicked: true,
     downvoteClicked: false,
     funnyClicked: true,
  }, {
     upvoteClicked: true,
     downvoteClicked: true,
     funnyClicked: true,
  }, {
     upvoteClicked: false,
     downvoteClicked: false,
     funnyClicked: false,
  }]

  testParams.forEach(({testName, onlyProf, onlyCourse, reviewId, submissionDate, upvotes, downvotes, funnys, 
                       profFirstName, profLastName, courseCode, courseName, content}) => {
      clickedStates.forEach(({upvoteClicked, downvoteClicked, funnyClicked}) => {
        test(testName, () => {
            const snapshot = render(
                <AuthProvider>
                  <MemoryRouter>
                      <ReviewCard deprecated
                                  content={content}
                                  courseCode={courseCode} courseName={courseName}
                                  downvoteClicked={downvoteClicked}
                                  funnyClicked={funnyClicked}
                                  initDownvoteCount={downvotes}
                                  initFunnyCount={funnys} initUpvoteCount={upvotes} onlyCourse={onlyCourse}
                                  onlyProf={onlyProf} profFirstName={profFirstName}
                                  profLastName={profLastName} reviewId={reviewId}
                                  submissionDate={submissionDate} 
                                  upvoteClicked={upvoteClicked}/>
                  </MemoryRouter>
                </AuthProvider>
            )
            expect(snapshot).toMatchSnapshot()
        });
      })
  });
});
