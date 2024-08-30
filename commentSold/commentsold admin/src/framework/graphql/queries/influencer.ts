import { gql } from '@apollo/client'
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_INFLUENCER = gql`
${META_FRAGMENT}

query FetchInfluencers($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
  fetchInfluencers(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      influencerData {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
        status
        created_at
        updated_at
      }
      count
    }
    meta {  ...MetaFragment }
  }
}
`;

export const GET_SINGLE_INFLUENCER = gql`
${META_FRAGMENT}
query FetchInfluencer($uuid: UUID) {
  fetchInfluencer(uuid: $uuid) {
    data {
      uuid
      first_name
      last_name
      email
      gender
      phone_number
      user_type
      country_code_id
      status
      created_at
      updated_at
    }
    meta {  ...MetaFragment }
    
  }
}
`;


export const FETCH_INFLUENCER_PRODUCTS = gql`
${META_FRAGMENT}
query FetchInfluencerProducts($page: Int, $limit: Int, $userId: String, $search: String, $sortBy: String, $sortOrder: String) {
  fetchInfluencerProducts(page: $page, limit: $limit, user_id: $userId, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      productData {
        uuid
        name
        description
        url
        sku
        color
        size
        price
        images {
          uuid
          url
        }
        productUser {
          first_name
          last_name
          email
          status
        }
      }
      count
    }
    meta {  ...MetaFragment }
  }
}
`;


