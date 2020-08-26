import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Divider, List } from "semantic-ui-react";

import Form from "components/common/Form";
import {
  DropdownInput,
  RadioInputGroup,
  TextAreaInput,
  SearchInput,
  SubmitConfirm,
} from "components/common/Inputs";

export default function CreateReviewPage() {
  const [professorSelected, setProfessorSelected] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const history = useHistory();

  const evaluationTexts = [
    "One of the worst experiences at Columbia. Avoid at all costs",
    "Strong negative experience. Take only if necessary",
    "Both negatives and positives much like life itself",
    "Strong positive experience. Take if possible",
    "A Columbia gem. Life-changing moments await",
  ];

  const confirmContent = (
    <>
      Your review <u>will not be published if it is</u>
      <List bulleted>
        <List.Item>Discriminatory or inappropriate</List.Item>
        <List.Item>About a nonexisting professor or course</List.Item>
        <List.Item>Libelous or defamatory</List.Item>
      </List>
      CULPA maintains the right to reject or remove all reviews.
    </>
  );

  const evaluationLabels = evaluationTexts.map((label, idx) => {
    return {
      label,
      key: idx + 1,
    };
  });

  /* * * * * * * * * * * * * * * * *
   * Dropdown methods              *
   * * * * * * * * * * * * * * * * */

  const onResultSelect = async ({ id : professorId }) => {
    setProfessorSelected(true);
    const response = await fetch(`/api/professor/${professorId}/courses`, {
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    });

    try {
      const { courses } = await response.json();
      if (response.ok) {
        setCourseOptions(courses);
      }
    } catch (err) {
      return { error: err };
    }
    return null;
  };

  const onSearchChange = () => {
    setProfessorSelected(false);
  };

  /* * * * * * * * * * * * * * * * *
   * Form methods                  *
   * * * * * * * * * * * * * * * * */
  const onSubmitReview = async (data) => {
    const response = await fetch("/api/review/submit", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    try {
      return await response.json();
    } catch (err) {
      return { error: err };
    }
  };

  const onSubmitReviewSuccess = () => {
    // TODO: redirect to the Review page
    history.push(`/`);
  };

  return (
    <>
      <h1>Write a Review</h1>
      <Form
        mode="onChange"
        onSubmit={onSubmitReview}
        onSuccess={onSubmitReviewSuccess}
      >
        <SearchInput
          label="Professor"
          name="professor"
          rules={{ required: "Please select a professor" }}
          searchEntity="professors"
          width={6}
          onResultSelect={onResultSelect}
          onSearchChange={onSearchChange}
        />
        <DropdownInput
          disabled={!professorSelected}
          label="Course"
          name="course"
          options={courseOptions}
          placeholder={
            professorSelected ? "" : "Please select a Professor first"
          }
          rules={{ required: "Please select a matching course" }}
          width={6}
        />
        <Divider section />
        <TextAreaInput
          label="Content"
          name="content"
          rows={8}
          rules={{ required: "Please describe the professor and course" }}
        />
        <TextAreaInput
          label="Workload"
          name="workload"
          rows={8}
          rules={{ required: "Please describe the workload" }}
        />
        <RadioInputGroup labels={evaluationLabels} name="evaluation" />
        <SubmitConfirm
          content={confirmContent}
          header="Are you sure you want to submit this review?"
        />
      </Form>
    </>
  );
}
