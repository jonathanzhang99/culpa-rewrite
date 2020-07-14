import React from "react";

import Form from "components/common/Form";
import { Submit, TextInput } from "components/common/Inputs";

function onSubmitReview(url) {
  return async (data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    try {
      const result = await response.json();

      if (result.error) {
        return result.error;
      }
    } catch (err) {
      return err;
    }
    return null;
  };
}

export default function ReviewForm() {
  return (
    <Form onSubmit={onSubmitReview("/api/review/submit")}>
      <TextInput
        name="review"
        required={{ value: true, message: "Write something!" }}
      />
      <Submit value="Submit" />
    </Form>
  );
}
