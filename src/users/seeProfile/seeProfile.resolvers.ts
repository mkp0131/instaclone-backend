import { Resolvers } from '../../types';
import { protectResolver } from '../users.utils';

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectResolver(
      (_, { username }, { client }) => {
        return client.user.findUnique({
          where: { username },
        });
      }
    ),
  },
};

export default resolvers;
