import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "semantic-ui-react";

import { AuthContext } from "components/common/Authentication";
import Form from "components/common/Form";
import { TextInput, PasswordInput, Submit } from "components/common/Inputs";

export default function Login() {
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const onSuccess = () => {
    history.push("/admin");
  };
  return (
    <Grid columns={3}>
      <Grid.Column>
        <h1>Login</h1>
        <Form onSubmit={login} onSuccess={onSuccess}>
          <TextInput
            label="Username"
            name="username"
            requiredOptions={{
              required: { value: true, message: "Missing username" },
            }}
          />
          <PasswordInput
            label="Password"
            name="password"
            requiredOptions={{
              required: { value: true, message: "Missing password" },
            }}
          />
          <Submit />
        </Form>
      </Grid.Column>
    </Grid>
  );
}
