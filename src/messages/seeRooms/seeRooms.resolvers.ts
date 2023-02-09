import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  __,
  { loggedInUser, client }
) => {
  return client.room.findMany({
    where: {
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
    seeRooms: protectResolver(resolverFn),
  },
};

export default resolvers;
