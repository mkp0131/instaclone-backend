import { Resolvers } from '../../types';
import { protectResolver } from '../users.utils';

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectResolver(
      (_, { username }, { client }) => {
        return client.user.findUnique({
          where: { username },
          // relation 관계 모두 계산하여 가져오기
          include: {
            followers: true,
            followings: true,
          },
        });
      }
    ),
  },
};

export default resolvers;
