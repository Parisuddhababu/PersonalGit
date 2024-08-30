import gql from "graphql-tag";

export const SubAdminTypeDefs = gql`
  type Meta {
    message: String!
    messagecode: String!
    status: String!
  }

  input CompanyInput {
    companyName: String!
    employeeId: String!
    skills: [String!]!
  }
  type Company {
    companyName: String!
    employeeId: String!
    skills: [String!]!
  }
  type SubAdmin {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNo: String!
    company: Company!
    meta:Meta
  }

  type Query {
    subAdmins: [SubAdmin]
    subAdmin(id: ID!): SubAdmin
  }

  type Mutation {
    createSubAdmin(
      firstName: String!
      lastName: String!
      email: String!
      phoneNo: String!
      company: CompanyInput!
    ): SubAdmin

    updateSubAdmin(
      id: ID!
      firstName: String
      lastName: String
      email: String
      phoneNo: String
      company: CompanyInput
    ): SubAdmin

    deleteSubAdmin(id: ID!): SubAdmin
  }
`;
