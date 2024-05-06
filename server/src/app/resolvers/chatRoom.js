import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constants.js";

export const getChatRoomsByMemberUuid = async (_, args, contextValue) => {
  try {
    const memberWithChatRooms = await contextValue.prisma.member.findUnique({
      where: {
        uuid: args.memberUuid,
      },
      include: {
        chatRooms: true,
      },
    });
    return memberWithChatRooms;
  } catch (error) {
    throw new GraphQLError(`getChatRoomsByMemberUuid error: ${error}`, {
      extensions,
    });
  }
};

export const getChatRoomByMembers = async (_, args, contextValue) => {
  if (args.members.length === 0) {
    return null;
  }
  try {
    const chatRooms = await contextValue.prisma.ChatRoom.findMany({
      where: {
        AND: [
          {
            members: {
              some: {}, // 確保 members 有值
            },
          },
          {
            members: {
              every: {
                // members [] 會符合，因為沒有元素違反條件
                uuid: {
                  in: args.members,
                },
              },
            },
          },
        ],
      },
      include: {
        members: true,
      },
    });
    console.log("chatRooms", chatRooms);

    const exactMatchChatRooms = chatRooms.filter((room) => {
      const roomMemberUuids = new Set(
        room.members.map((member) => member.uuid)
      );
      const argsMemberUuids = new Set(args.members);
      return roomMemberUuids.size === argsMemberUuids.size;
    });
    console.log("exactMatchChatRooms", exactMatchChatRooms);
    return exactMatchChatRooms[0];
  } catch (error) {
    throw new GraphQLError(`getChatRoomByMembers error: ${error}`, {
      extensions,
    });
  }
};

export const createChatRoom = async (_, args, contextValue) => {
  try {
    return await contextValue.prisma.ChatRoom.create({
      data: {
        members: {
          connect: args.members.map((uuid) => ({ uuid })),
        },
      },
    });
  } catch (error) {
    throw new GraphQLError(`createChatRoom error: ${error}`, {
      extensions,
    });
  }
};

export const getOrCreateChatRoom = async (_, args, contextValue) => {
  const chatRoom = await getChatRoomByMembers(_, args, contextValue);
  if (chatRoom) {
    return chatRoom;
  } else {
    return createChatRoom(_, args, contextValue);
  }
};
