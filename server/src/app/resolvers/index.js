import { getMember, getMembers } from "./member.js";
import { login } from "./login.js";
import { register } from "./register.js";
import { getContactsByMemberUuid, connectContact } from "./contact.js";
import { createChat } from "./chat.js";
import {
  getChatRoomByMembers,
  createChatRoom,
  getOrCreateChatRoom,
  getChatRoomsByMemberUuid,
} from "./chatRoom.js";

export const resolvers = {
  Query: {
    getMember,
    getMembers,
    getContactsByMemberUuid,
    getChatRoomByMembers,
    getChatRoomsByMemberUuid,
  },
  Mutation: {
    login,
    register,
    connectContact,
    createChat,
    createChatRoom,
    getOrCreateChatRoom,
  },
  // 一定要寫此 apollo graphql studio 才會顯示關聯
  Member: {
    contactsSent: (parent, _args, context) => {
      return context.prisma.Member.findUnique({
        where: { id: parent?.id },
      }).contactsSent();
    },
    contactsReceived: (parent, _args, context) => {
      return context.prisma.Member.findUnique({
        where: { id: parent?.id },
      }).contactsReceived();
    },
    chatSender: (parent, _args, context) => {
      return context.prisma.Member.findUnique({
        where: { id: parent?.id },
      }).chatSender();
    },
    chatRecipients: (parent, _args, context) => {
      return context.prisma.Member.findUnique({
        where: { id: parent?.id },
      }).chatRecipients();
    },
    chatRooms: (parent, _args, context) => {
      return context.prisma.Member.findUnique({
        where: { id: parent?.id },
      }).chatRooms();
    },
  },
  Contact: {
    sentContact: (parent, _args, context) => {
      return context.prisma.Contact.findUnique({
        where: { id: parent?.id },
      }).sentContact();
    },
    receivedContact: (parent, _args, context) => {
      return context.prisma.Contact.findUnique({
        where: { id: parent?.id },
      }).receivedContact();
    },
  },
  ChatRoom: {
    members: (parent, _args, context) => {
      return context.prisma.ChatRoom.findUnique({
        where: { id: parent?.id },
      }).members();
    },
    chat: (parent, _args, context) => {
      return context.prisma.ChatRoom.findUnique({
        where: { id: parent?.id },
      }).chat();
    },
  },
  Chat: {
    chatRoom: (parent, _args, context) => {
      return context.prisma.Chat.findUnique({
        where: { id: parent?.id },
      }).chatRoom();
    },
    chatSender: (parent, _args, context) => {
      return context.prisma.Chat.findUnique({
        where: { id: parent?.id },
      }).chatSender();
    },
    recipients: (parent, _args, context) => {
      return context.prisma.Chat.findUnique({
        where: { id: parent?.id },
      }).recipients();
    },
  },
};
