import client from '../../client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      try {
        // 1. 유저 정보가져오기 없으면 없다고 에러내기
        const existingUser = await client.user.findUnique({
          where: {
            username,
          },
        });

        if (!existingUser) {
          return {
            ok: false,
            error: '유저 정보가 없습니다.',
          };
        }

        // 2. 유저정보의 비밀번호와 입력한 비밀번호 비교
        const verifyPassword = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!verifyPassword) {
          return {
            ok: false,
            error: '비밀번호가 맞지 않습니다.',
          };
        }

        const token = jwt.sign(
          { id: existingUser.id },
          process.env.TOKEN_SECRET_KEY,
          {
            expiresIn: '1h',
          }
        );

        // 3. 성공하면 로그인, 실패하면 에러
        return {
          ok: true,
          token,
        };
      } catch (error) {
        console.error(error);
        return {
          ok: false,
          error,
        };
      }
    },
  },
};
