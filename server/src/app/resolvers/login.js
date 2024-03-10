// 簡易登入，沒有密碼，只要輸入 uuid
import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constant.js";

export const login = async (_, args, contextValue) => {
  // const res = await contextValue.db.query(
  //   "SELECT EXISTS (SELECT 1 FROM members WHERE uuid = $1)",
  //   [args.uuid]
  // );

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
