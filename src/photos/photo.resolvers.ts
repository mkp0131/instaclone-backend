import client from '../client';
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
    isLike: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
  },
};

export default resolvers;
