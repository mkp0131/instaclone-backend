import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  __,
  { loggedInUser, client }
) => {
  return client.photo.findMany({
    where: {
      OR: [
        {
          user: {
            followers: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        },
        {
          userId: loggedInUser.id,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectResolver(resolverFn),
  },
};

export default resolvers;
