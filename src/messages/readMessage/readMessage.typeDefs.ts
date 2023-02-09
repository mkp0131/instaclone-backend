import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    readMessage(messageId: Int!): MutationResponse!
  }
`;
