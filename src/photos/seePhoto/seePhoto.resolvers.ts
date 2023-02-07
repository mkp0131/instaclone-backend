import { Resolver, Resolvers } from '../../types';

const resolverFn: Resolver = async (
  _,
  { id },
  { loggedInUser, client }
) => {
  return client.photo.findUnique({
    where: {
      id,
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    seePhoto: resolverFn,
  },
};

export default resolvers;
