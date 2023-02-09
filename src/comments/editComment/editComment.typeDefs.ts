import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    editComment(
      commentId: Int!
      payload: String!
    ): MutationResponse!
  }
`;
