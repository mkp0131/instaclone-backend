require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import schema from './schema';
import { getUser } from './users/users.utils';

// 선언한 타입과 구현부를 서버에 넣어준다.
const server = new ApolloServer({
  schema,
  // 모든 resolver 에서 접근 가능한 context
  // express 의 res,req 에 접근 가능
  context: async ({ req }) => {
    // console.log('💎Token: ', req.headers.token);
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const PORT = process.env.PORT || 4000;

// 서버 시작
server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
