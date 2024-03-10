// 怎麼對應到 chatRoomId，先用參數提供，後端要補檢查！！！
import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constant.js";

export const createChat = async (_, args, contextValue) => {
  const { sender, recipients, chatRoomId } = args.data;
  const content = args.data.content ?? "";

  try {
    if (chatRoomId) {
      return await contextValue.prisma.Chat.create({
        data: {
          chatRoomId,
          sender,
          recipients: {
            connect: recipients.map((uuid) => ({ uuid })),
          },
          content,
        },
      });
    } else {
      const chatRoom = await contextValue.prisma.ChatRoom.create({
        data: {
          members: {
            connect: [sender, ...recipients].map((uuid) => ({ uuid })),
          },
          selected: true, // 這可能要拿掉
          chat: {
            create: {
              sender,
              recipients: {
                connect: recipients.map((uuid) => ({ uuid })),
              },
              content,
            },
          },
        },
        include: {
          chat: {
            include: {
              recipients: true,
            },
          },
        },
      });
      // console.log("chatRoom", chatRoom);

      return chatRoom.chat[0]; // 假设每个 ChatRoom 创建时只会创建一个 Chat，返回这个 Chat
    }

    // const selectedChatRoom = await contextValue.prisma.ChatRoom.findMany({
    //   where: {
    //     members: {
    //       some: {
    //         uuid: {
    //           in: [
    //             "d72680d3-6898-4978-8ee5-b0b9c69c12da",
    //             "8beb5990-599c-4bfe-9f76-e0f639b31d4b",
    //             "9f2c84e1-d5c0-45a1-88a1-53dd771e5fa4",
    //           ],
    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     members: true,
    //   },
    // });
    // console.log("selectedChatRoom", selectedChatRoom);
  } catch (error) {
    throw new GraphQLError(`createChat error: ${error}`, {
      extensions,
    });
  }
};
