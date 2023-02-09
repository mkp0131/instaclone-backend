import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { protectResolver } from '../users.utils';
import { Resolver, Resolvers } from '../../types';
import { createWriteStream, ReadStream } from 'fs';
import { uploadToS3 } from '../../shared/shared.utils';

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
    if (!loggedInUser || !loggedInUser.id) {
      throw new Error('인증 정보가 없습니다.');
    }

    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadToS3(avatar, loggedInUser.id);
    }

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
        ...(avatarUrl && { avatar: avatarUrl }),
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
