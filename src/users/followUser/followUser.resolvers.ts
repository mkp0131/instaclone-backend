import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../users.utils';

const resolverFn: Resolver = async (
  _,
  { username },
  { loggedInUser, client }
) => {
  try {
    if (loggedInUser.username === username) {
      throw new Error('자기 자신을 추가 할 수 없습니다.');
    }

    const checkUser = await client.user.findUnique({
      where: {
        username,
      },
    });

    if (!checkUser) {
      throw new Error('사용자가 없습니다.');
    }

    const updatedUser = await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        followings: {
          connect: {
            username,
          },
        },
      },
    });
    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error.toString(),
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectResolver(resolverFn),
  },
};

export default resolvers;
