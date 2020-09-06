import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "components/common/Authentication";
import Form, { Submit } from "components/common/Form";
import { TextInput, PasswordInput } from "components/common/Inputs";

export default function LoginPage() {
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const onSuccess = () => {
    history.push("/admin");
  };
  return (
    <>
      <h1>Login</h1>
      <Form onSubmit={login} onSuccess={onSuccess}>
        <TextInput
          label="Username"
          name="username"
          rules={{ required: "Missing username" }}
          width={5}
        />
        <PasswordInput
          label="Password"
          name="password"
          rules={{ required: "Missing password" }}
          width={5}
        />
        <Submit />
      </Form>
    </>
  );
}
