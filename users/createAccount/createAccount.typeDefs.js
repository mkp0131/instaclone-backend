import { gql } from 'apollo-server';

export default gql`
  type CreatedAccountResult {
    ok: Boolean!
    error: String
  }

  type Mutation {
    createdAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): CreatedAccountResult
  }
`;
