import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constant.js";

export const createChat = async (_, args, contextValue) => {
  const { sender, recipients, content, chatRoomId } = args.data;

  try {
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
  } catch (error) {
    throw new GraphQLError(`createChat error: ${error}`, {
      extensions,
    });
  }
};
