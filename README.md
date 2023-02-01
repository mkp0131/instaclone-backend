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
