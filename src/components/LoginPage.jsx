import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

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
    <>
      <h1>Login</h1>
      <Form onSubmit={login} onSuccess={onSuccess}>
        <TextInput
          width={5}
          label="Username"
          name="username"
          rules={{ required: "Missing username" }}
        />
        <PasswordInput
          width={5}
          label="Password"
          name="password"
          rules={{ required: "Missing password" }}
        />
        <Submit />
      </Form>
    </>
  );
}
