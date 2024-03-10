import React from "react";
import { ListGroup } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

export default function Conversations() {
  // recipients 相同的，沒有整併，會有多個，待處理
  const { conversations, selectConversationIndex } = useConversations();
  console.log("conversations", conversations);

  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => selectConversationIndex(index)} // setSelectedConversationIndex
          active={conversation.selected}
        >
          {conversation.recipients.map((r) => r.name).join(", ")}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
