import client from "../client";

export default {
  Mutation: {
    // Mutation 은 (root, args, context, info) 를 파라미터로 받는다.
    // root 는 일반적으로 사용하지 않음. (_ 로 명명)
    // args 는 graphQl 에서 보낸 값. 예) { title: 'hello' }
    // args 는 mutation 에서 정의한 파라미터
    // args 구조분해 할당으로 값을 받는다.
    createMovie: (_, { title, year, genre }, context, info) => {
      return client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      });
    },
    deleteMovie: (_, { id }) => {
      return client.movie.delete({ where: { id } });
    },
    updateMovie: (_, { id, year }) => {
      return client.movie.update({
        where: {
          id,
        },
        data: {
          year,
        },
      });
    },
  },
};
