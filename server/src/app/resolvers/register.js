// 簡易註冊，沒有密碼
import { GraphQLError } from 'graphql';
import { v4 as uuidV4 } from "uuid";
import { extensions } from "../../utils/constant.js";

export const register = async (_, args, contextValue) => {
  const uuid = uuidV4();
  console.log("uuid", uuid);

  // const res = await contextValue.db.query(
  //   `INSERT INTO members (
  //         uuid,
  //         username,
  //         image,
  //         created_at,
  //         updated_at
  //     ) VALUES ($1, $2, $3, NOW(), NOW())`,
  //   [uuid, args?.name, args?.image]
  // );
  // console.log("res", res);
  try {
    const res = await contextValue.prisma.Member.create({
      data: {
        uuid,
        username: args?.name,
        image: args?.image,
      },
    });
    console.log("register res", res);

    return {
      uuid,
      name: args?.name,
      image: args?.image,
    };
  } catch (error) {
    throw new GraphQLError(`register error: ${error}`, {
      extensions,
    });
  }
};
