import { render } from "@testing-library/react";
import React from "react";

import Form, { Submit } from "components/common/Form";
import { TextInput } from "components/common/Inputs";

describe("Form Component Tests", () => {
  const onSubmit = jest.fn();
  const onSuccess = jest.fn();

  test("empty form", () => {
    const snapshot = render(<Form onSubmit={onSubmit} onSuccess={onSuccess} />);
    expect(snapshot).toMatchSnapshot();
  });

  test("form with single input", () => {
    const snapshot = render(
      <Form onSubmit={onSubmit} onSuccess={onSuccess}>
        <TextInput name="test1" />
      </Form>
    );
    expect(snapshot).toMatchSnapshot();
  });

  test("form with multiple inputs", () => {
    const snapshot = render(
      <Form onSubmit={onSubmit} onSuccess={onSuccess}>
        <TextInput name="test1" />
        <TextInput name="test2" />
      </Form>
    );
    expect(snapshot).toMatchSnapshot();
  });

  test("form with submit button", () => {
    const snapshot = render(
      <Form onSubmit={onSubmit} onSuccess={onSuccess}>
        <TextInput name="test1" />
        <Submit value="submit" />
      </Form>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
