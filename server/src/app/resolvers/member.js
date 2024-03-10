import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constant.js";

export const getMember = async (_, args, contextValue) => {
  try {
    return await contextValue.prisma.Member.findUnique({
      where: {
        uuid: args.uuid,
      },
    });
  } catch (error) {
    throw new GraphQLError(`getMembers error: ${error}`, {
      extensions,
    });
  }
};


export const getMembers = async (_, args, contextValue) => {
  try {
    return await contextValue.prisma.Member.findMany({
      orderBy: {
        id: 'asc'
      },
    });
  } catch (error) {
    throw new GraphQLError(`getMembers error: ${error}`, {
      extensions,
    });
  }
};
