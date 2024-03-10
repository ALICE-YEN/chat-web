import { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
// import { useContacts } from "../contexts/ContactsProvider";
import { axiosUrl } from "../lib/Constant.js";

export default function Contacts({ uuid }) {
  const [contacts, setContacts] = useState([]);
  // const { contacts } = useContacts();

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
    <ListGroup variant="flush">
      {contacts.map((contact) => (
        <ListGroup.Item key={contact.id}>
          {contact.name ?? contact.id}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
