import gql from 'graphql-tag';

export const bannerTypeDefs = gql`
  type Banner {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    banners: [Banner]
    banner(id: ID!): Banner
  }

  type Mutation {
    createBanner(title: String!, description: String!): Banner
    updateBanner(id: ID!, title: String, description: String): Banner
    deleteBanner(id: ID!): Banner
  }
`;
