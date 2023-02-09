import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { photoId },
  { loggedInUser, client }
) => {
  return client.comment.findMany({
    where: {
      photoId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: protectResolver(resolverFn),
  },
};

export default resolvers;
