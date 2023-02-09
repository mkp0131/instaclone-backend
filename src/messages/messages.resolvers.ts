import client from '../client';
import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Room: {
    users: ({ id }, _, { client }) =>
      client.room
        .findUnique({
          where: {
            id,
          },
        })
        .users(),
    messages: ({ id }, _, { client }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          roomId: id,
          read: false,
          userId: {
            not: loggedInUser.id,
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }, _, { client }) => {
      return client.message
        .findUnique({
          where: {
            id,
          },
        })
        .user();
    },
  },
};

export default resolvers;
