import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) => {
      return client.user.findUnique({
        where: {
          id: userId,
        },
      });
    },
    hashtags: ({ id }, _, { client }) => {
      return client.photo
        .findUnique({
          where: {
            id,
          },
        })
        .hashtags();
    },

    likes: ({ id }, _, { client }) => {
      return client.like.count({
        where: {
          photoId: id,
        },
      });
    },
  },
};

export default resolvers;
