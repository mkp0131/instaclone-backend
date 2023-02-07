import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { hashtag },
  { loggedInUser, client }
) => {
  return client.hashtag.findUnique({
    where: {
      hashtag,
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    seeHashtag: protectResolver(resolverFn),
  },
  Hashtag: {
    photos: async (
      { id },
      { page },
      { loggedInUser, client }
    ) => {
      const TAKE_ROW = 5;
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos({
          take: TAKE_ROW,
          skip: TAKE_ROW * (page - 1),
        });
    },
    totalPhoto: async (
      { id },
      _,
      { loggedInUser, client }
    ) => {
      return client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      });
    },
  },
};

export default resolvers;
