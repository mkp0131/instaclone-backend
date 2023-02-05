require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import client from './client';
import { resolvers, typeDefs } from './schema';
import { getUser } from './users/users.utils';
import * as express from 'express';
const {
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
import * as morgan from 'morgan';
import path = require('path');

const startApolloServer = async () => {
  // 선언한 타입과 구현부를 서버에 넣어준다.
  const server = new ApolloServer({
    resolvers: resolvers,
    typeDefs: typeDefs,
    // 모든 resolver 에서 접근 가능한 context
    // express 의 res,req 에 접근 가능
    context: async ({ req }) => {
      // console.log('💎Token: ', req.headers.token);
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });

  await server.start();
  const app = express();
  app.use(
    express.static(path.join(__dirname, '..', 'uploads'))
  );
  app.use(graphqlUploadExpress());
  app.use(morgan('dev'));

  // 생성한 아폴로서버에 express 추가
  server.applyMiddleware({ app });

  // 서버 시작
  const PORT = process.env.PORT || 4000;
  app.listen({ port: PORT }, () => {
    console.log(
      `🚀Server is running on http://localhost:${PORT} ✅`
    );
  });
};

startApolloServer();
