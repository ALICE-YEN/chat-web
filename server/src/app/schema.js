export const typeDefs = `
  type Query {
    getMember(uuid: String!): Member
    getMembers: [Member!]
    getContactsByMemberUuid(uuid: String!): [Contact!]
    getChatRoomByMembers(members: [String!]): ChatRoom
    getChatRoomsByMemberUuid(memberUuid: String!): Member
  }

  type Mutation {
    login(account: String!, password: String!): LoginOutput
    register(data: registerInput): Member
    connectContact(memberUuid: String!, contactMemberUuid: String!): Contact
    createChat(data: createChatInput): Chat
    createChatRoom(members: [String!]): ChatRoom
    getOrCreateChatRoom(members: [String!]): ChatRoom
  }

  type Member {
    uuid: String!
    account: String!
    username: String
    image: String
    createdAt: DateTime!
    updatedAt: DateTime!
    contactsSent: [Contact!]
    contactsReceived: [Contact!]
    chatSender: [Chat!]
    chatRecipients: [Chat!]
    chatRooms: [ChatRoom!]
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

  type LoginOutput {
    member: Member
    token: String
  }

  input registerInput {
    account: String!
    password: String!
    username: String!
    image: String
  }

  input createChatInput {
    sender: String!
    recipients: [String!]
    content: String!
    chatRoomId: Int!
  }

  scalar DateTime
`;
