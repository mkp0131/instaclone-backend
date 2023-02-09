import { Room } from '@prisma/client';
import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { roomId },
  { loggedInUser, client }
) => {
  return client.room.findFirst({
    where: {
      id: roomId,
      users: {
        some: {
          id: loggedInUser.id,
        },
      },
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectResolver(resolverFn),
  },
};

export default resolvers;
