import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { id },
  { loggedInUser, client }
) => {
  try {
    // 사진이 있는지 체크
    const photo = await client.photo.findUnique({
      where: {
        id,
      },
    });

    if (!photo) {
      throw new Error('사진이 없습니다.');
    }

    // 현재 게시물에 Like 되어있는지 확인
    const like = await client.like.findUnique({
      where: {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      },
    });

    // Like 되어있다며 해제
    if (like) {
      await client.like.delete({
        where: {
          id: like.id,
        },
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id,
            },
          },
        },
      });
    }

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
    toggleLike: protectResolver(resolverFn),
  },
};

export default resolvers;
