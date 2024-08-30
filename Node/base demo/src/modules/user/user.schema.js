import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    phone: String!
    company: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(firstname: String!, lastname: String!, email: String!, phone: String!, company: String!): User
    updateUser(id: ID!, firstname: String, lastname: String, email: String, phone: String, company: String): User
    deleteUser(id: ID!): User
  }
`;
