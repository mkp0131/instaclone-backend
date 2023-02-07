import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { keyword },
  { loggedInUser, client }
) => {
  return client.photo.findMany({
    where: {
      caption: {
        contains: keyword,
      },
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    searchPhotos: protectResolver(resolverFn),
  },
};

export default resolvers;
