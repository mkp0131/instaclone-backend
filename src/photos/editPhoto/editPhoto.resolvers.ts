import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';
import { generateHashtagObj } from '../photo.utils';

const resolverFn: Resolver = async (
  _,
  { id, caption },
  { loggedInUser, client }
) => {
  try {
    // 사용자의 사진인지 확인
    const photo = await client.photo.findFirst({
      where: {
        id,
        userId: loggedInUser.id,
      },
      include: {
        hashtags: {
          select: {
            hashtag: true,
          },
        },
      },
    });

    if (!photo) {
      throw new Error('권한이 없습니다.');
    }

    const hashtagObjs = generateHashtagObj(caption);

    // 기존 hash태그 삭제 및 재연결
    const updatedPhoto = await client.photo.update({
      where: {
        id,
      },
      data: {
        caption,
        hashtags: {
          disconnect: photo.hashtags,
          connectOrCreate: hashtagObjs,
        },
      },
    });

    if (updatedPhoto) {
      return {
        ok: true,
      };
    }

    throw new Error('에러가 발생 했습니다.');
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
    editPhoto: protectResolver(resolverFn),
  },
};

export default resolvers;
