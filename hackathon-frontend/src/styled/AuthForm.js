import styled from "styled-components";

const AuthForm = styled.form`
  border: 1px solid black;
  border-radius: 5px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    margin: 0.5rem 0;
  }

  button {
    width: 100%;
    margin-top: 1rem;
  }
`;

export default AuthForm;
