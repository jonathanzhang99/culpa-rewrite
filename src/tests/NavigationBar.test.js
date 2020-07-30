import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "components/common/Authentication";
import NavigationBar from "components/NavigationBar";

describe("Navbar Component Tests", () => {
  test("navbar snapshot test", () => {
    const snapshot = render(
      <AuthProvider>
        <MemoryRouter>
          <NavigationBar />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
