import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { photoId, payload },
  { loggedInUser, client }
) => {
  try {
    const photo = await client.photo.findUnique({
      where: {
        id: photoId,
      },
      select: {
        id: true,
      },
    });

    if (!photo) {
      throw new Error('사진이 없습니다.');
    }

    const createdComment = await client.comment.create({
      data: {
        payload,
        photo: {
          connect: {
            id: photoId,
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
    createComment: protectResolver(resolverFn),
  },
};

export default resolvers;
