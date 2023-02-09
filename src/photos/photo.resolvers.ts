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
    comments: ({ id }, _, { client }) => {
      return client.comment.count({
        where: {
          photoId: id,
        },
      });
    },
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser || !loggedInUser.id) return false;
      return userId === loggedInUser.id;
    },
  },
};

export default resolvers;
