import React from "react";

import Form from "components/common/Form";
import { Submit, Input } from "components/common/Inputs";

function onSubmitForm(url) {
  return async (data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const result = await response.json();
    window.location = `reviews/${result.id}`;
  };
}

export default function ReviewForm() {
  return (
    <Form onSubmit={onSubmitForm("/api/review/submit")}>
      <Input
        name="review"
        required={{ value: true, message: "Write something!" }}
      />
      <Submit value="Submit" />
    </Form>
  );
}
