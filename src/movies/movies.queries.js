import client from "../client";

export default {
  // Query 은 (root, args, context, info) 를 파라미터로 받는다. (Mutation 과 동일하다.)
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_, { id }) =>
      client.movie.findUnique({
        where: {
          id,
        },
      }),
  },
};
