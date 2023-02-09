import { Room } from '@prisma/client';
import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { payload, roomId, userId },
  { loggedInUser, client }
) => {
  try {
    let room: Partial<Room> = null;
    if (userId) {
      const user = await client.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new Error('유저가 없습니다.');
      }

      room = await client.room.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: userId,
                },
              },
            },
            {
              users: {
                some: {
                  id: loggedInUser.id,
                },
              },
            },
          ],
        },
      });

      if (!room) {
        room = await client.room.create({
          data: {
            users: {
              connect: [
                {
                  id: userId,
                },
                {
                  id: loggedInUser.id,
                },
              ],
            },
          },
        });
      }
    } else if (roomId) {
      room = await client.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
        },
      });
      if (!room) {
        throw new Error('채팅방이 없습니다.');
      }
    }

    const newMessage = await client.message.create({
      data: {
        payload,
        room: {
          connect: {
            id: room.id,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error.toString(),
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectResolver(resolverFn),
  },
};

export default resolvers;
