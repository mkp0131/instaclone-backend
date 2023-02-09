import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { id },
  { loggedInUser, client }
) => {
  const likers = await client.like.findMany({
    where: {
      photoId: id,
    },
    select: {
      user: true,
    },
  });
  const result = likers.map((liker) => liker.user);

  return result;
};

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: protectResolver(resolverFn),
  },
};
export default resolvers;
