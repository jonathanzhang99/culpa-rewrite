import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import ReviewCard from "components/reviews/ReviewCard";

describe("ReviewCard tests setup", () => {
  const testParams = [{
     testName: "complete & normal",
     onlyProf: true, 
     onlyCourse: true, 
     reviewId: "12345",
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
     reviewId: "12345",
     submissionDate: "2020-02-01",
     upvotes: 10,
     downvotes: 2,
     funnys: 3,
     profFirstName: "",
     profLastName: "",
     courseCode: "COMS1004",
     courseName: "Intro to Programming", 
     content: "an interesting class"
  }, {
     testName: "courseCard",
     onlyProf: false, 
     onlyCourse: true, 
     reviewId: "12345",
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
  testParams.forEach(({testName, onlyProf, onlyCourse, reviewId, submissionDate, upvotes, downvotes, funnys, 
                       profFirstName, profLastName, courseCode, courseName, content}) => {
      test(testName, () => {
          const snapshot = render(
              <MemoryRouter>
                  <ReviewCard onlyProf={onlyProf}
                              onlyCourse={onlyCourse}
                              reviewId={reviewId}
                              submissionDate={submissionDate}
                              upvotes={upvotes} downvotes={downvotes} funnys={funnys}
                              profFirstName={profFirstName} profLastName={profLastName}
                              courseCode={courseCode} courseName={courseName}
                              content={content} />
              </MemoryRouter>
          )
          expect(snapshot).toMatchSnapshot()
      });
  });
});
