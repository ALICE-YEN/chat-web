// 可以縮寫 rfc，產生模板

import React, { useRef } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { axiosUrl } from "../lib/constants.js";

export default function Login({ onIdSubmit }) {
  const accountRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `mutation Register($data: registerInput) {
          register(data: $data) {
            uuid
            username
            updatedAt
            image
            account
            createdAt
          }
        }`,
        variables: {
          data: {
            account: accountRef.current.value,
            password: passwordRef.current.value,
            username: usernameRef.current.value,
          },
        },
      },
    });

    const data = res?.data?.data?.register;
    if (data.uuid) {
      onIdSubmit(data.uuid);
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
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" ref={usernameRef} required />
        </Form.Group>
        <Button type="submit" className="mr-2">
          Register
        </Button>
      </Form>
    </Container>
  );
}
