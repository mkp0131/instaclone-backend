import { gql } from 'apollo-server-express';

export default gql`
  type seeFollowingsResult {
    ok: Boolean!
    error: String
    followings: [User]
  }

  type Query {
    seeFollowings(
      username: String!
      lastId: Int
    ): seeFollowingsResult
  }
`;
