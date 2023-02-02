import client from '../../client';
import bcrypt from 'bcrypt';

export default {
  Mutation: {
    createdAccount: async (
      _,
      { firstName, lastName, username, email, password }
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
          throw new Error('이미 가입된 계정 입니다.');
        }

        // 비밀번호 암호화
        const hashPassword = await bcrypt.hash(
          password,
          15
        );
        return client.user.create({
          data: {
            firstName,
            username,
            email,
            password: hashPassword,
            lastName,
          },
        });
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  },
};
