import { render } from "@testing-library/react";
import React from "react";

import Form from "components/common/Form";
import { Input, Submit } from "components/common/Inputs";

function onSubmit() {}

describe("Form Component", () => {
  test("empty form", () => {
    const snapshot = render(<Form onSubmit={onSubmit} />);
    expect(snapshot).toMatchSnapshot();
  });

  test("form with single input", () => {
    const snapshot = render(
      <Form onSubmit={onSubmit}>
        <Input name="test1" />
      </Form>
    );
    expect(snapshot).toMatchSnapshot();
  });

  test("form with multiple inputs", () => {
    const snapshot = render(
      <Form onSubmit={onSubmit}>
        <Input name="test1" />
        <Input name="test2" />
      </Form>
    );
    expect(snapshot).toMatchSnapshot();
  });

  test("form with submit button", () => {
    const snapshot = render(
      <Form onSubmit={onSubmit}>
        <Input name="test1" />
        <Submit value="submit" />
      </Form>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
