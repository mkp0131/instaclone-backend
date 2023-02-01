import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "apollo-server";

// 현재 앱이 실행되는 곳의 모든 폴더, 모든 *.typeDefs.js 파일을 하나로 묶어준다.
// 1. 파일을 읽고
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
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
