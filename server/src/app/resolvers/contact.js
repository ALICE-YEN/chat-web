// 要記得剔除重複 memberUuid, contactMemberUuid
import { GraphQLError } from "graphql";
import { extensions } from "../../utils/constant.js";

export const getContactsByMemberUuid = async (_, args, contextValue) => {
  try {
    return await contextValue.prisma.Contact.findMany({
      where: {
        OR: [{ memberUuid: args.uuid }, { contactMemberUuid: args.uuid }],
      },
    });
  } catch (error) {
    throw new GraphQLError(`getContactsByMemberUuid error: ${error}`, {
      extensions,
    });
  }
};

export const connectContact = async (_, args, contextValue) => {
  const { memberUuid, contactMemberUuid } = args;

  try {
    return await contextValue.prisma.Contact.create({
      data: {
        memberUuid,
        contactMemberUuid,
      },
    });
  } catch (error) {
    throw new GraphQLError(`getContactsByMemberUuid error: ${error}`, {
      extensions,
    });
  }
};
