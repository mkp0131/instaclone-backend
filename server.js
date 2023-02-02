require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import schema from './schema';

// 선언한 타입과 구현부를 서버에 넣어준다.
const server = new ApolloServer({
  schema,
});

const PORT = process.env.PORT || 4000;

// 서버 시작
server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
