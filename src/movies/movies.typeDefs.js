import { gql } from "apollo-server";

// The GraphQL schema
// 필요한 타입들을 선언한다.
// Apollo 에서 타입의 컬럼들이 기본적으로 optional 이다
// required 는 '!' 를 suffix 로 붙여준다.
export default gql`
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
