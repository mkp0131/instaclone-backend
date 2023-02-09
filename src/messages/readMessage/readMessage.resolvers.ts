import { Room } from '@prisma/client';
import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { messageId },
  { loggedInUser, client }
) => {
  try {
    const message = await client.message.findFirst({
      where: {
        id: messageId,
        userId: {
          not: loggedInUser.id,
        },
        room: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      throw new Error('메세지가 없습니다.');
    }

    await client.message.update({
      where: {
        id: messageId,
      },
      data: {
        read: true,
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
    readMessage: protectResolver(resolverFn),
  },
};

export default resolvers;
