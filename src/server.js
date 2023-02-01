import { ApolloServer, gql } from "apollo-server";
import schema from "./schema";

// 선언한 타입과 구현부를 서버에 넣어준다.
const server = new ApolloServer({
  schema,
});

// 서버 시작
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
