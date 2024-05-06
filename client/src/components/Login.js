// 可以縮寫 rfc，產生模板
// 待補錯誤處理

import React, { useRef } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { axiosUrl } from "../lib/constants.js";

export default function Login({ onIdSubmit, setShowLogin }) {
  const accountRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `mutation Login($account: String!, $password: String!) {
          login(account: $account, password: $password) {
            token
            member {
              uuid
              username
              updatedAt
              image
              createdAt
              account
            }
          }
        }
        `,
        variables: {
          account: accountRef.current.value,
          password: passwordRef.current.value,
        },
      },
    });
    const data = res?.data?.data?.login;
    if (data) {
      onIdSubmit(data.member.uuid);
    } else {
      window.alert("Incorrect ID. Please check your input and try again.");
    }
  }

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group>
          <Form.Label>Account</Form.Label>
          <Form.Control type="text" ref={accountRef} required />
          <Form.Label>Password</Form.Label>
          <Form.Control type="text" ref={passwordRef} required />
        </Form.Group>
        <Button type="submit" className="mr-2">
          Login
        </Button>
        <Button onClick={() => setShowLogin(false)} variant="secondary">
          Register
        </Button>
      </Form>
    </Container>
  );
}
