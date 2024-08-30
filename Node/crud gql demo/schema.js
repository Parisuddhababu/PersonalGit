// schema.js
export const typeDefs = `#graphql
  type Company {
  companyname: String!
  employeeID: String!
  skills: [String!]!
  }
  type User {
  id: ID!
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  company: Company
}

input CompanyInput {
  companyname: String!
  employeeID: String!
  skills: [String!]!
}
type QueryResponse {
  statusCode: Int!
  status: String!
  message: String!
  totalRecords: Int
  users: [User]
  user: User
}

type MutationResponse {
  statusCode: Int!
  status: String!
  message: String!
  user: User
}
   type Query {
     users: [User]
     user(id: ID!): QueryResponse
   }

  type Mutation {
  createUser(
    firstname: String!
    lastname: String!
    email: String!
    phone: String
    company: CompanyInput
  ): User

  updateUser(
    id: ID!
    firstname: String
    lastname: String
    email: String
    phone: String
    company: CompanyInput
  ): MutationResponse

  deleteUser(id: ID!): User
}

`;
