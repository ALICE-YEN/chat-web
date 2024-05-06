import React, { useContext, useEffect } from "react";
import axios from "axios";
import useLocalStorage from "../hooks/useLocalStorage";
import { axiosUrl } from "../lib/constants.js";

const ContactsContext = React.createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({ id, children }) {
  // 原本都用 LocalStorage 當作 DB，之後要移除
  const [contacts, setContacts] = useLocalStorage("contacts", []);

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
        variables: { uuid: id },
      },
    }).then((res) => {
      const data = res?.data?.data?.getContactsByMemberUuid;
      if (data) {
        const uniqueContacts = new Map();

        data.forEach((item) => {
          let contactId, contactName;

          if (item.memberUuid === id) {
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

  function createContact(id, name) {
    setContacts((prevContacts) => {
      return [...prevContacts, { id, name }];
    });
  }

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
}
