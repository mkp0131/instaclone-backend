import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
  try {
    // 토큰이 없을시
    if (!token) return null;

    const { id } = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY
    );
    const user = await client.user.findUnique({
      where: { id },
    });
    if (user) {
      return user;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const protectResolver =
  (resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: '인증 정보가 없습니다.',
      };
    }

    return resolver(root, args, context, info);
  };
