# 리액트 인스타 백엔드

## [GraphQl] Apollo Server 기본사용

- 참고 깃허브: https://github.com/mkp0131/instaclone-backend/commit/6c8a9521c86fac1321d2ca6985ab5502e12eef05
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

- 깃허브: https://github.com/mkp0131/instaclone-backend/tree/032b8bdc4976126576a3fed0f1a7097c931683c4

- `client.js` 파일을 생성

```js
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export default client;
```

- `schema.js` 파일을 생성
- typeDefs, resolvers 를 옮겨준다.

```js
import { gql } from 'apollo-server';
import client from './client';

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
    createMovie(
      title: String!
      year: Int!
      genre: String
    ): Movie
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
    createMovie: (
      _,
      { title, year, genre },
      context,
      info
    ) => {
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
import { ApolloServer, gql } from 'apollo-server';
import { typeDefs, resolvers } from './schema';

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

#### 도메인 별로 폴더를 만들어 나누어 준다.

- 깃허브: https://github.com/mkp0131/instaclone-backend/commit/afd26bcfc2417b7320f5c0df16d7b41e5cf8d1e9

- `graphql-tools` 를 설치
- 공식문서: https://the-guild.dev/graphql/tools/docs/generate-schema

```js
npm install @graphql-tools/schema @graphql-tools/load-files @graphql-tools/merge
```

- `도메인폴더/도메인.queries.js`, `도메인폴더/도메인.mutations.js`, `도메인폴더/도메인.typeDefs.js` 생성
- 각각의 파일에 코드를 분리한다.

- `schema.js` 에서 `graphql-tools` 을 이용해서 모든 파일을 합쳐줌.

```js
import { loadFilesSync } from '@graphql-tools/load-files';
import {
  mergeResolvers,
  mergeTypeDefs,
} from '@graphql-tools/merge';
import { makeExecutableSchema } from 'apollo-server';

// 현재 앱이 실행되는 곳의 모든 폴더, 모든 *.typeDefs.js 파일을 하나로 묶어준다.
// 1. 파일을 읽고
const loadedTypes = loadFilesSync(
  `${__dirname}/**/*.typeDefs.js`
);
const loadedResolvers = loadFilesSync(
  `${__dirname}/**/*.{queries,mutations}.js`
);

// 2. 파일을 합친다.
const typeDefs = mergeTypeDefs(loadedTypes);
const resolvers = mergeResolvers(loadedResolvers);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
```

- server.js 에 적용

```js
import { ApolloServer, gql } from 'apollo-server';
import schema from './schema';

// 선언한 타입과 구현부를 서버에 넣어준다.
const server = new ApolloServer({
  schema,
});

// 서버 시작
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

--- 여기까지 완료

## [prisma] 쿼리 예시 / where, or, count, relation, select

- where, or (`OR`은 꼭 대문자!)

```js
const existingUser = client.user.findFirst({
  where: {
    OR: [
      {
        username,
      },
      {
        email,
      },
    ],
  },
});
```

- findUnique: @unique 로 정한것들만 검색이 가능한다

```js
return client.user.findUnique({
  where: { username },
});
```

- select 옵션을 활용하여 원하는 컬럼만 가져올 수 있다.

```js
const checkUser = await client.user.findUnique({
  where: {
    username,
  },
  // id 만 가져옴
  select: {
    id: true,
  },
});
```

- count: 총 줄 수를 반환

```js
const totalFollowers = await client.user.count({
  where: {
    followings: {
      some: {
        username,
      },
    },
  },
});
```

- relation 관계 가져오기

```js
const followers = await client.user
  .findUnique({
    where: {
      username,
    },
  })
  .followers({
    take: TAKE_ROW,
    skip: TAKE_ROW * (page - 1),
  });
```

- relation 관계만 있는 db 가져오기
- 예) 나를 팔로워로 가지고 있는 user 카운트

```js
const total = await client.user.count({
  where: {
    followers: {
      some: {
        id,
      },
    },
  },
});
```

- relation 관계만 있는 db 넣기

```js
return client.photo.create({
  data: {
    file: fileUrl,
    caption,
    user: {
      connect: {
        id: loggedInUser.id,
      },
    },
    ...(hashtagObjs && {
      hashtags: {
        connectOrCreate: hashtagObjs,
      },
    }),
  },
});
```

- relation 관계 수정시 => 관계를 삭제하고 다시 생성

```js
// 기존 hash태그 삭제 및 재연결
const updatedPhoto = await client.photo.update({
  where: {
    id,
  },
  data: {
    caption,
    hashtags: {
      disconnect: photo.hashtags,
      connectOrCreate: hashtagObjs,
    },
  },
});
```

## [prisma] @relation 관계 모두 계산하여 가져오기

- prisma 에서 @relation 관계는 연산 비용이 많이 들기 때문에, 설정을 해주어야한다.

### include VS resolver 차이

반환하는 데이터 값 자체는 동일합니다.
즉, '항상' hashtags와 user의 전체 데이터가 필요하다면
include를 사용하면 좋을 수 있을거에요.

하지만, 그저 include: { hashtags: true, user:true } 로 설정을 해 두면
hashtags나 user를 호출하든 호출하지 않던 데이터를 일단 가져 옵니다.

반면에, user와 hashtags를 include하지 않고 resolver로 만들어둔다면
프론트엔드에서 user와 hashtags를 달라고 요청할 때에
resolver가 user와 hashtags를 resolver에 찾아 들어가서 데이터를 구해오고
반환 합니다.

### resolver

- `users.resolvers.ts` 파일을 생성

```ts
import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) => {
      return client.user.findUnique({
        where: {
          id: userId,
        },
      });
    },
    hashtags: ({ id }, _, { client }) => {
      return client.photo
        .findUnique({
          where: {
            id,
          },
        })
        .hashtags();
    },
  },
};

export default resolvers;
```

### include 사용(비추)

- 쿼리를 업데이트 할때는 include 를 사용한다

#### 기본사용

```ts
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
```

#### 쿼리에서 사용

- select 를 활용해 특정한 컬럼만 가져온다.

```js
// 사용자의 사진인지 확인
const photo = await client.photo.findFirst({
  where: {
    id,
    userId: loggedInUser.id,
  },
  include: {
    hashtags: {
      select: {
        hashtag: true,
      },
    },
  },
});
```

## [graphql] 페이지네이션 정리

### 1. 오프셋 기반 페이지네이션(Offset-based Pagination)

- DB의 offset쿼리를 사용하여 ‘페이지’ 단위로 구분하여 요청/응답
- 순차적으로 db를 불러온다.

```ts
const resolverFn: Resolver = async (
  _,
  { username, page },
  { loggedInUser, client }
) => {
  try {
    const checkUser = await client.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!checkUser) {
      throw new Error('유저가 없습니다.');
    }

    const TAKE_ROW = 5;

    const totalFollowers = await client.user.count({
      where: {
        followings: {
          some: {
            username,
          },
        },
      },
    });

    const followers = await client.user
      .findUnique({
        where: {
          username,
        },
      })
      .followers({
        take: TAKE_ROW,
        skip: TAKE_ROW * (page - 1),
      });

    return {
      ok: true,
      followers,
      totalPages: Math.ceil(totalFollowers / TAKE_ROW),
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error.toString(),
    };
  }
};
```

### 2. 커서 기반 페이지네이션(Cursor-based Pagination)

- Cursor 개념을 사용하여 사용자에게 응답해준 마지막 데이터 기준으로 다음 n개 요청/응답

```ts
const resolverFn: Resolver = async (
  _,
  { username, lastId },
  { loggedInUser, client }
) => {
  try {
    console.log('----------------');

    const checkUser = await client.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!checkUser) {
      throw new Error('유저가 없습니다.');
    }

    const TAKE_ROW = 5;

    const followings = await client.user
      .findUnique({
        where: {
          username,
        },
      })
      .followings({
        take: TAKE_ROW,
        skip: lastId ? 1 : 0,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      });

    console.log(followings);

    return {
      ok: true,
      followings,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error.toString(),
    };
  }
};
```

### 각각의 필드도 args 를 받을 수 있다.

```js
  type Hashtag {
    id: Int!
    hashtags: String!
    photos(page: Int!): [Photo]
    totalPhoto: Int!
    createdAt: String!
    updatedAt: String!
  }
```

```js
const resolvers: Resolvers = {
  Query: {
    seeHashtag: protectResolver(resolverFn),
  },
  Hashtag: {
    photos: async (
      { id },
      { page },
      { loggedInUser, client }
    ) => {
      const TAKE_ROW = 5;
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos({
          take: TAKE_ROW,
          skip: TAKE_ROW * (page - 1),
        });
    },
```

## [prisma] 두가지 필드 한번에 unique 설정

멋진 기능이네요. 동시에 한묶음으로 unique 생성하면 userId 와 photoId 중 어느 하나는 꼭 다른 포토 이거나 유저여야 되니까. 같은 사람이 동일한 포토를 라이크 할 수 없겠네요. 또 규칙 하나 추가하자면 userId나 photoId 중 어느하나가 null이 될 수도 없네요. 즉 like에서 유저나 포토를 disconnect 할 수 없으므로 그냥 삭제 해야 되네요. disconnect가 될 경우 버려져서 쌓이는 db가 나도 모르는 사이 늘어날 수도 있는데 깔끔하게 삭제 해버리니까 참 괜찮은 방법인것 같아요. 이런거 누가 개발하는지 모르겠지만 아마도 개발자들은 전부 천재인듯... 하 이거 잘만 활용하면 ondelete 기능 없이 db 구축이 가능할 것 같은데요.. 그래서 지원 안해주나..

```js
model Like {
  id        Int      @id @default(autoincrement())
  photo     Photo    @relation(fields: [photoId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  photoId   Int
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([photoId, userId])
}
```
