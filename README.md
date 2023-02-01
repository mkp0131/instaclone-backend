# 리액트 인스타 백엔드

## [GraphQl] Apollo Server 기본사용

- Apollo Server: 커뮤니티에서 관리하는 오픈 소스 GraphQL 서버

### 설치

- Apollo Server, graql 함께 설치

```
npm i apollo-server@2.25.2 graphql
```

- 기본코드(버전 2 기준)
- 버전2 공식문서: https://www.apollographql.com/docs/apollo-server/v2/getting-started
- 버전2 참조 github 문서: https://github.com/apollographql/apollo-server/tree/4612a01ba3e4b6482607cc40bc14eb6afbb28b23#installation-standalone

```js
import { ApolloServer, gql } from "apollo-server";

// The GraphQL schema
const typeDefs = gql`
  type Movie {
    title: String
    year: Int
  }

  type Query {
    movies: [Movie]
    movie: Movie
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    movies: () => [],
    movie: () => {title: 'Iron man', year: 2021}
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

### graphql 쿼리 예제

#### 조회

- 원하는 쿼리와 원하는 컬럼 명을 작성

```js
{
  movies {
    title
  }
}
```

#### 데이터 베이스 생성

- `mutation` 을 사용
- 뒤에 obj 는 생성된 db의 정보

```js
mutation {
  createMovie(title: "어벤져스", year: 2020, genre: "액션"){
    id,
    title,
    year,
    genre,
    createdAt,
    updatedAt,
  }
}
```

#### 조회

```js
{
  movies {
    id
    title
    year
    updatedAt,
    createdAt
  }
}
```

#### 업데이트

```js
mutation {
  updateMovie(id: 2, year: 1999) {
    id
    title
    year
  }
}
```

## [prisma] prisma + graphql 모듈화

### Step 1

- `client.js` 파일을 생성

```js
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default client;
```

- `schema.js` 파일을 생성
- typeDefs, resolvers 를 옮겨준다.

```js
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
```

- `server.js` 에서는 서버를 만들고 실행만 한다.

```js
import { ApolloServer, gql } from "apollo-server";
import { typeDefs, resolvers } from "./schema";

// 선언한 타입과 구현부를 서버에 넣어준다.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 서버 시작
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

### Step 2
