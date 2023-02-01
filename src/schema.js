import { gql } from "apollo-server";
import client from "./client";

// The GraphQL schema
// 필요한 타입들을 선언한다.
// Apollo 에서 타입의 컬럼들이 기본적으로 optional 이다
// required 는 '!' 를 suffix 로 붙여준다.
export const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }

  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int!, year: Int!): Movie
  }
`;

// A map of functions which return data for the schema.
// 타입에서 선언한 Query 와 Mutation 구현부
export const resolvers = {
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
