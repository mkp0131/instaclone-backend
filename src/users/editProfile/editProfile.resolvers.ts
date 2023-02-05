import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { protectResolver } from '../users.utils';
import { Resolver, Resolvers } from '../../types';
const { GraphQLUpload } = require('graphql-upload');

const resolverFn: Resolver = async (
  _,
  {
    firstName,
    lastName,
    username,
    email,
    password: newPassword,
    bio,
    avatar,
  },
  // context 에서 token 으로 접근
  { loggedInUser, client }
) => {
  try {
    console.log(avatar);

    // 비밀번호 암호화
    let hashNewPassword = null;
    if (newPassword) {
      hashNewPassword = await bcrypt.hash(newPassword, 15);
    }

    const updatedUser = await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        firstName,
        lastName,
        username,
        email,
        ...(hashNewPassword && {
          password: hashNewPassword,
        }), // 조건문
      },
    });

    // 업데이트 성공시
    if (updatedUser) {
      return {
        ok: true,
      };
    } else {
      throw new Error('업데이트에 실패하였습니다.');
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error.toString(),
    };
  }
};

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
};

export default resolvers;