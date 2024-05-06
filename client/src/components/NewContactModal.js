import React, { useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useContacts } from "../contexts/ContactsProvider";
import { PREFIX, axiosUrl } from "../lib/constants";

export default function NewContactModal({ closeModal }) {
  const idRef = useRef();
  console.log("idRef", idRef);
  const nameRef = useRef();
  const { createContact } = useContacts();
  const id = JSON.parse(localStorage.getItem(PREFIX + "id"));

  async function handleSubmit(e) {
    e.preventDefault();

    if (id) {
      const res = await axios({
        method: "post",
        url: axiosUrl,
        data: {
          query: `mutation ConnectContact($memberUuid: String!, $contactMemberUuid: String!) {
            connectContact(memberUuid: $memberUuid, contactMemberUuid: $contactMemberUuid) {
              createdAt
              updatedAt
              receivedContact {
                uuid
              }
              sentContact {
                uuid
              }
              memberUuid
              contactMemberUuid
            }
          }`,
          variables: {
            memberUuid: id,
            contactMemberUuid: idRef?.current?.value,
          },
        },
      });
      console.log("res", res?.data?.data?.connectContact);

      if (res?.data?.data?.connectContact) {
        createContact(idRef?.current?.value, nameRef?.current?.value);
      } else {
        window.alert(
          "The contact with the provided UUID does not exist. Please check your input and try again."
        );
      }
    }

    closeModal();
  }

  return (
    <>
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Uuid</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          {/* 還沒有處理取聯絡人名字，是用原本的 member，猶豫是否要可以改名 */}
          {/* <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group> */}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
}
