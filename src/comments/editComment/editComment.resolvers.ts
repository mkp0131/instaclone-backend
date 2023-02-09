import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { commentId, payload },
  { loggedInUser, client }
) => {
  try {
    if (!loggedInUser || !loggedInUser.id)
      throw new Error('유저 정보가 없습니다.');

    const comment = await client.comment.findFirst({
      where: {
        id: commentId,
        userId: loggedInUser.id,
      },
      select: {
        id: true,
      },
    });

    if (!comment) throw new Error('댓글이 없습니다.');

    const updatedComment = await client.comment.update({
      where: {
        id: commentId,
      },
      data: {
        payload,
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
    editComment: protectResolver(resolverFn),
  },
};

export default resolvers;
