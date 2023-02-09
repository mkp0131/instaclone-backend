import * as jwt from 'jsonwebtoken';
import client from '../client';
import { Resolver } from '../types';

export const getUser = async (token) => {
  try {
    // 토큰이 없을시
    if (!token) return null;

    const verifiedToken: any = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY
    );

    if ('id' in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken['id'] },
      });
      if (user) {
        return user;
      }
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const protectResolver =
  (resolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === 'query';

      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: '인증 정보가 없습니다.',
        };
      }
    }

    return resolver(root, args, context, info);
  };
