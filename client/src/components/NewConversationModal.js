import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
// import { useContacts } from "../contexts/ContactsProvider";
import { useConversations } from "../contexts/ConversationsProvider";
import { axiosUrl } from "../lib/Constant.js";

export default function NewConversationModal({ closeModal, uuid }) {
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  console.log("selectedContactIds", selectedContactIds);
  const [contacts, setContacts] = useState([]);
  // const { contacts } = useContacts();
  const { createConversation } = useConversations();

  function handleSubmit(e) {
    e.preventDefault();

    createConversation(selectedContactIds);
    closeModal();
  }

  function handleCheckboxChange(contactId) {
    setSelectedContactIds((prevSelectedContactIds) => {
      if (prevSelectedContactIds.includes(contactId)) {
        return prevSelectedContactIds.filter((prevId) => {
          return contactId !== prevId;
        });
      } else {
        return [...prevSelectedContactIds, contactId];
      }
    });
  }

  // 用很醜的方式整理 contacts，這個要從後端檢查能否讓前端不要做這麼多處理(篩選出不重複的聯絡人)
  useEffect(() => {
    axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `query GetContactsByMemberUuid($uuid: String!) {
            getContactsByMemberUuid(uuid: $uuid) {
              memberUuid
              contactMemberUuid
              createdAt
              receivedContact {
                username
                uuid
              }
              sentContact {
                uuid
                username
              }
            }
          }`,
        variables: { uuid: uuid },
      },
    }).then((res) => {
      const data = res?.data?.data?.getContactsByMemberUuid;
      if (data) {
        const uniqueContacts = new Map();

        data.forEach((item) => {
          let contactId, contactName;

          if (item.memberUuid === uuid) {
            contactId = item.receivedContact.uuid;
            contactName = item.receivedContact.username;
          } else {
            contactId = item.sentContact.uuid;
            contactName = item.sentContact.username;
          }

          uniqueContacts.set(contactId, contactName);
        });

        const contactIds = Array.from(uniqueContacts).map(([id, name]) => ({
          id,
          name,
        }));

        setContacts(contactIds);
      }
    });
  }, []);

  return (
    <>
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                value={selectedContactIds.includes(contact.id)}
                label={contact.name ?? contact.id}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
}
