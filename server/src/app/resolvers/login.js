// 簡易登入，沒有密碼，只要輸入 uuid，之後要補 JWT
import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constant.js";

export const login = async (_, args, contextValue) => {
  try {
    return await contextValue.prisma.Member.findUnique({
      where: {
        uuid: args.uuid,
      },
    });
  } catch (error) {
    throw new GraphQLError(`login error: ${error}`, {
      extensions,
    });
  }
};
