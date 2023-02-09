import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { photoId },
  { loggedInUser, client }
) => {
  try {
    const photo = await client.photo.findFirst({
      where: {
        id: photoId,
        userId: loggedInUser.id,
      },
      select: {
        id: true,
      },
    });

    if (!photo) throw new Error('사진이 없습니다.');

    const deletedPhoto = await client.photo.delete({
      where: {
        id: photoId,
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
    deletePhoto: protectResolver(resolverFn),
  },
};

export default resolvers;
