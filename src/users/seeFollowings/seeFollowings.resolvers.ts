import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../users.utils';

const resolverFn: Resolver = async (
  _,
  { username, lastId },
  { loggedInUser, client }
) => {
  try {
    console.log('----------------');

    const checkUser = await client.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!checkUser) {
      throw new Error('유저가 없습니다.');
    }

    const TAKE_ROW = 5;

    const followings = await client.user
      .findUnique({
        where: {
          username,
        },
      })
      .followings({
        take: TAKE_ROW,
        skip: lastId ? 1 : 0,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      });

    console.log(followings);

    return {
      ok: true,
      followings,
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
  Query: {
    seeFollowings: protectResolver(resolverFn),
  },
};

export default resolvers;
