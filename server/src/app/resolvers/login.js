// 之後前端、後端 api 要加上 JWT token 驗證
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "config";
import { extensions } from "../../utils/constants.js";

const jwtConfig = config.get("jwt");

export const login = async (_, args, contextValue) => {
  const { account, password } = args;

  try {
    const member = await contextValue.prisma.Member.findUnique({
      where: {
        account,
      },
    });
    if (!member) {
      throw new GraphQLError("No member found with this login account.");
    }

    const isValid = await bcrypt.compare(password, member.password);
    if (!isValid) {
      throw new GraphQLError("Invalid password.");
    }

    const token = jwt.sign({ account }, jwtConfig.secret, {
      expiresIn: "1h",
    });

    return { member, token };
  } catch (error) {
    throw new GraphQLError(`login error: ${error}`, {
      extensions,
    });
  }
};
