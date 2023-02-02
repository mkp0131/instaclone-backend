import client from '../../client';
import bcrypt from 'bcrypt';

export default {
  Mutation: {
    editProfile: async (
      _,
      {
        firstName,
        lastName,
        username,
        email,
        password: newPassword,
      }
    ) => {
      try {
        // 비밀번호 암호화
        let hashNewPassword = null;
        if (newPassword) {
          hashNewPassword = await bcrypt.hash(
            newPassword,
            15
          );
        }

        const updatedUser = await client.user.update({
          where: {
            id: 1,
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
          return {
            ok: false,
            error: '업데이트에 실패하였습니다.',
          };
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
