import { Resolver, Resolvers } from '../../types';

const resolverFn: Resolver = async (
  _,
  { keyword },
  { loggedInUser, client }
) => {
  const users = await client.user.findMany({
    where: {
      username: {
        startsWith: keyword,
      },
    },
  });

  console.log(users);
  return users;
};

const resolvers: Resolvers = {
  Query: {
    searchUsers: resolverFn,
  },
};

export default resolvers;
