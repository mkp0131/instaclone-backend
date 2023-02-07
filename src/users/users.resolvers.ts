import { Resolvers } from '../types';

const resolvers: Resolvers = {
  User: {
    photos: async ({ id }, _, { client }) => {
      const TAKE_ROW = 5;

      return client.user
        .findUnique({
          where: {
            id,
          },
        })
        .photos();
    },
    totalFollowings: async ({ id }, _, { client }) => {
      const total = await client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      });

      return total;
    },
    totalFollowers: async ({ id }, _, { client }) => {
      const total = await client.user.count({
        where: {
          followings: {
            some: {
              id,
            },
          },
        },
      });

      return total;
    },
    isMe: async ({ id }, _, { loggedInUser }) => {
      if (id === loggedInUser.id) {
        return true;
      }
      return false;
    },
    isFollowing: async (
      { id },
      _,
      { loggedInUser, client }
    ) => {
      if (!loggedInUser) {
        return false;
      }
      try {
        const result = await client.user
          .findUnique({
            where: {
              username: loggedInUser.username,
            },
          })
          .followings({
            where: {
              id,
            },
          });

        return result.length !== 0;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

export default resolvers;
