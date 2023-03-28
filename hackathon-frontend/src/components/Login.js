import React from "react";
import AuthForm from "../styled/AuthForm";
import { useState } from "react";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });

  function submitHandler(e) {
    e.preventDefault();
  }

  function changeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  }

  return (
    <AuthForm onSubmit={submitHandler}>
      <div>
        <label htmlFor="email">Email: </label>
        <br />
        <input
          type="email"
          id="email"
          name="email"
          onChange={changeHandler}
          value={values.email}
        />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          onChange={changeHandler}
          value={values.password}
        />
      </div>
      <button type="submit">Login</button>
    </AuthForm>
  );
};

export default Login;
