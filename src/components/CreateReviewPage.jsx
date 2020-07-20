import React from "react";

import Form from "components/common/Form";
import {
  RadioInputGroup,
  Submit,
  TextInput,
  TextAreaInput,
  SearchInput,
} from "components/common/Inputs";

export default function ReviewForm() {
  const evaluationTexts = [
    "One of the worst experiences at Columbia. Avoid at all costs",
    "Strongly negative experience. Take only if necessary",
    "Both negatives and positives much like life itself",
    "Strong positive experience. Take if possible",
    "A Columbia gem. Life-changing moments await",
  ];

  const evaluationLabels = evaluationTexts.map((label, idx) => {
    return {
      label,
      key: idx + 1,
    };
  });

  const onSubmitReview = async (data) => {
    const response = await fetch("/api/review/submit", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    try {
      const result = await response.json();
      if (result.error) {
        return result.error;
      }
    } catch (err) {
      throw new Error(err);
    }
    return null;
  };

  const onSubmitReviewSuccess = (data) => {
    alert(data);
  };

  return (
    <>
      <h1>Write a Review</h1>
      <Form onSubmit={onSubmitReview} onSuccess={onSubmitReviewSuccess}>
        <SearchInput
          width={6}
          name="professor"
          label="Professor"
          rules={{ required: "Please select a professor" }}
        />
        <TextInput
          width={6}
          name="course"
          label="Course"
          rules={{ required: "Please select a matching course" }}
        />

        <TextAreaInput
          name="content"
          label="Content"
          rules={{ required: "Please describe the professor and course" }}
          rows={5}
        />
        <TextAreaInput
          name="workload"
          label="Workload"
          rules={{ required: "Please describe the workload!" }}
          rows={5}
        />
        <RadioInputGroup name="evaluation" labels={evaluationLabels} />
        <Submit value="Submit" />
      </Form>
    </>
  );
}
