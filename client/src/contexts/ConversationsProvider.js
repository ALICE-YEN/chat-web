import React, { useContext, useState, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
// import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";
import { axiosUrl } from "../lib/Constant.js";

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [contacts, setContacts] = useState([]);
  // const { contacts } = useContacts();
  const socket = useSocket();

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

  function createConversation(recipients) {
    setConversations((prevConversations) => {
      console.log("prevConversations", prevConversations);
      return [...prevConversations, { recipients, messages: [] }];
    });
  }

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prevConversations) => {
        // madeChange 判斷 conversation 是否是新的
        let madeChange = false;
        const newMessage = { sender, text };
        const newConversations = prevConversations.map((conversation) => {
          // recipients 是原本就有的
          if (arrayEquality(conversation.recipients, recipients)) {
            madeChange = true;
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            };
          }

          return conversation;
        });

        if (madeChange) {
          return newConversations;
        } else {
          // 新的 conversation
          return [...prevConversations, { recipients, messages: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (socket == null) return;

    // 為 socket 設置一個事件監聽器
    socket.on("receive-message", addMessageToConversation);

    // 組件卸載時，這個清理函數會被調用。從 socket 上移除 "receive-message" 事件的監聽器。防止記憶體洩漏。
    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  function sendMessage(recipients, text) {
    // 通過 WebSocket 連接向伺服器發送一個 "send-message" 事件
    socket.emit("send-message", { recipients, text });

    addMessageToConversation({ recipients, text, sender: id });
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      console.log("recipient", recipient);
      console.log("contacts", contacts);
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      });
      const name = contact?.name ?? recipient;
      return { id: recipient, name };
    });

    // 給 name 已知的值 contact.name
    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => {
        return contact.id === message.sender;
      });
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe };
    });

    const selected = index === selectedConversationIndex;
    return { ...conversation, messages, recipients, selected };
  });

  const value = {
    conversations: formattedConversations, // Conversations
    selectedConversation: formattedConversations[selectedConversationIndex], // Dashboard、OpenConversation
    sendMessage, //OpenConversation
    selectConversationIndex: setSelectedConversationIndex, // Conversations
    createConversation, // NewConversationModal
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
}
