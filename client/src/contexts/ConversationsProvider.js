import React, { useContext, useState, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
import { useSocket } from "./SocketProvider";
import { useContacts } from "./ContactsProvider";
import { axiosUrl } from "../lib/constants.js";

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
  const { contacts } = useContacts();
  const socket = useSocket();

  // GetContactsByMemberUuid、GetChatRoomsByMemberUuid 應該可以整併成一個 api，否則就失去 graphQL 的優勢
  // 用很醜的方式整理 contacts，這個要從後端檢查能否讓前端不要做這麼多處理(篩選出不重複的聯絡人)
  useEffect(() => {
    // 取得聊天室
    axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `query GetChatRoomsByMemberUuid($memberUuid: String!) {
          getChatRoomsByMemberUuid(memberUuid: $memberUuid) {
            uuid
            chatRooms {
              id
              members {
                uuid
              }
              chat {
                id
                content
                sender
                recipients {
                  uuid
                }
              }
            }
          }
        }`,
        variables: { memberUuid: id },
      },
    }).then((res) => {
      const data = res?.data?.data?.getChatRoomsByMemberUuid;
      const chatRooms = data.chatRooms.map((chatRoom) => {
        const recipients = chatRoom.members.reduce((acc, member) => {
          if (member.uuid !== id) {
            acc.push(member.uuid);
          }
          return acc;
        }, []);
        const messages = chatRoom.chat.map((chat) => {
          return {
            text: chat.content,
            sender: chat.sender,
          };
        });
        return { chatRoomId: chatRoom.id, recipients, messages };
      });

      setConversations(chatRooms);
    });
  }, []);

  function createConversation(recipients) {
    axios({
      method: "post",
      url: axiosUrl,
      data: {
        query: `mutation GetOrCreateChatRoom($members: [String!]) {
          getOrCreateChatRoom(members: $members) {
            id
            members {
              uuid
            }
            selected
            updatedAt
            createdAt
          }
        }`,
        variables: { members: [...recipients, id] },
      },
    }).then((res) => {
      const data = res?.data?.data?.getOrCreateChatRoom;

      setConversations((prevConversations) => {
        const newRecipientsSorted = [...recipients].sort().join(",");

        const alreadyExists = prevConversations.some((conversation) => {
          const currentRecipientsSorted = [...conversation.recipients]
            .sort()
            .join(",");
          return newRecipientsSorted === currentRecipientsSorted;
        });

        setSelectedConversationIndex(data.id);

        if (!alreadyExists) {
          return [
            ...prevConversations,
            { chatRoomId: data.id, recipients, messages: [] },
          ];
        }
        return prevConversations;
      });
    });
  }

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prevConversations) => {
        const newMessage = { sender, text };
        const newConversations = prevConversations.map((conversation) => {
          if (arrayEquality(conversation.recipients, recipients)) {
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            };
          }

          return conversation;
        });

        return newConversations;
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
    socket.emit("send-message", {
      chatRoomId: Number(selectedConversationIndex),
      recipients,
      text,
    });

    addMessageToConversation({ recipients, text, sender: id });
  }

  const formattedConversations = conversations.map((conversation) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      });
      const name = contact?.name ?? recipient;
      return { id: recipient, name };
    });

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => {
        return contact.id === message.sender;
      });
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe };
    });

    const selected = conversation.chatRoomId === selectedConversationIndex;
    return { ...conversation, messages, recipients, selected };
  });

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations.find(
      (conversation) => conversation.chatRoomId === selectedConversationIndex
    ),
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
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
