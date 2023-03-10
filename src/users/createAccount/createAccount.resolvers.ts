import * as bcrypt from 'bcrypt';
import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        // ✅ db 의 유니크 키가 중복되는게 없는지 먼저 확인한다.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });

        if (existingUser) {
          return {
            ok: false,
            error: '이미 가입된 계정 입니다.',
          };
        }

        // 비밀번호 암호화
        const hashPassword = await bcrypt.hash(
          password,
          15
        );
        const createdUser = await client.user.create({
          data: {
            firstName,
            username,
            email,
            password: hashPassword,
            lastName,
          },
        });

        if (createdUser) {
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
    },
  },
};

export default resolvers;
