import { gql } from '@apollo/client'
import { META_FRAGMENT } from '../fragments';

export const GET_INFLUENCER = gql`
   ${META_FRAGMENT}
   query FetchFrontInfluencers($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String,  $isAllInfluencers: Boolean) {
    fetchFrontInfluencers(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder,isAllInfluencers: $isAllInfluencers) {
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
          UserBrandDomainData {
            uuid
            domain_name
            status
          }
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
   query FetchFrontInfluencer($uuid: UUID) {
    fetchFrontInfluencer(uuid: $uuid) {
      data {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
        UserBrandDomainData {
          uuid
          domain_name
          status
        }
        status
        created_at
        updated_at
      }
      meta {  ...MetaFragment }
    }
  }
`;


