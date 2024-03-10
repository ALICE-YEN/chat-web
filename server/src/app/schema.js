export const typeDefs = `
  type Query {
    getMember(uuid: String!): Member
    getMembers: [Member!]
    getContactsByMemberUuid(uuid: String!): [Contact!]
  }

  type Mutation {
    login(uuid: String!): Member
    register(name: String, image: String, contacts: [String!]): Member
    connectContact(memberUuid: String!, contactMemberUuid: String!): Contact
    createChat(data: createChatInput): Chat
  }

  type Member {
    uuid: String!
    username: String
    image: String
    createdAt: DateTime!
    updatedAt: DateTime!
    contactsSent: [Contact!]
    contactsReceived: [Contact!]
    chatSender: [Chat!]
    chatRecipients: [Chat!]
    chatRoomMembers: [ChatRoom!]
  }

  type Contact {
    memberUuid: String!
    contactMemberUuid: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    sentContact: Member
    receivedContact: Member
  }

  type ChatRoom {
    id: ID!
    selected: Boolean
    createdAt: DateTime!
    updatedAt: DateTime!
    members: [Member!]
    chat: [Chat!]
  }

  type Chat {
    id: ID!
    chatRoomId: Int
    sender: String!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    chatRoom: ChatRoom!
    chatSender: Member!
    recipients: [Member!]
  }

  input createChatInput {
    sender: String!
    recipients: [String!]
    content: String
    chatRoomId: Int
  }

  scalar DateTime
`;
