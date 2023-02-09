import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
  _,
  { commentId },
  { loggedInUser, client }
) => {
  try {
    if (!loggedInUser || !loggedInUser.id) {
      throw new Error('유저 정보가 없습니다.');
    }

    const comment = await client.comment.findFirst({
      where: {
        id: commentId,
        userId: loggedInUser.id,
      },
    });

    if (!comment) {
      throw new Error('댓글이 없습니다.');
    }

    const deleteComment = await client.comment.delete({
      where: {
        id: commentId,
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
    deleteComment: protectResolver(resolverFn),
  },
};

export default resolvers;
