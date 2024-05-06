import { GraphQLError } from "graphql";
import { v4 as uuidV4 } from "uuid";
import { hashPassword } from "../../utils/helpers.js";
import { extensions } from "../../utils/constants.js";

export const register = async (_, args, contextValue) => {
  const uuid = uuidV4();
  const { account, password, username, image } = args.data;
  const hashedPassword = await hashPassword(password);

  try {
    return await contextValue.prisma.Member.create({
      data: {
        uuid,
        account,
        password: hashedPassword,
        username,
        image,
      },
    });
  } catch (error) {
    throw new GraphQLError(`register error: ${error}`, {
      extensions,
    });
  }
};
