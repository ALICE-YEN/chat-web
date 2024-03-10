// 可以縮寫 rfc，產生模板

import React, { useRef,useEffect } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import {  axiosUrl } from "../lib/Constant.js";

export default function Login({ onIdSubmit }) {
  const idRef = useRef();
  useEffect(()=>{
    console.log("idRef.current.value", idRef.current?.value);
  })

  async function handleSubmit(e) {
    e.preventDefault(); // prevent the page from refreshing

    // 判斷登入是否成功
    const res = await axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `mutation Login($uuid: String!) {
          login(uuid: $uuid) {
            image
            username
            uuid
          }
        }
        `,
        variables: { uuid: idRef.current.value },
      },
    });

    if (res?.data?.data?.login) {
      onIdSubmit(idRef.current.value);
    } else {
      window.alert("Incorrect ID. Please check your input and try again.");
    }
  }

  async function createNewId() {
    // 註冊
    const res = await axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `mutation Register {
          register {
            uuid
          }
        }`,
      },
    });

    const uuid = res?.data?.data?.register.uuid;
    if (uuid) {
      onIdSubmit(uuid);
    }
  }

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group>
          <Form.Label>Enter Your Id</Form.Label>
          <Form.Control type="text" ref={idRef} required />
        </Form.Group>
        <Button type="submit" className="mr-2">
          Login
        </Button>
        <Button onClick={createNewId} variant="secondary">
          Create A New Id
        </Button>
      </Form>
    </Container>
  );
}
