import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    createdAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): User
  }
`;
