import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../users.utils';

const resolverFn: Resolver = async (
  _,
  { username, page },
  { loggedInUser, client }
) => {
  try {
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

    const totalFollowers = await client.user.count({
      where: {
        followings: {
          some: {
            username,
          },
        },
      },
    });

    const followers = await client.user
      .findUnique({
        where: {
          username,
        },
      })
      .followers({
        take: TAKE_ROW,
        skip: TAKE_ROW * (page - 1),
      });

    return {
      ok: true,
      followers,
      totalPages: Math.ceil(totalFollowers / TAKE_ROW),
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
    seeFollowers: protectResolver(resolverFn),
  },
};

export default resolvers;
