import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const FETCH_BRAND_USERS = gql`
${META_FRAGMENT}
query FetchBrandUsers($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
  fetchBrandUsers(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      brandUserData {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
        status
        UserBrandDomainData {
          uuid
          domain_name
          status
          company_name
        }
        UserBrandSettingData {
          uuid
          influencer_count
          session_count
        }
        created_at
        updated_at
      }
      count
    }
    meta {
      ...MetaFragment
    }
  }
}`;


export const FETCH_SINGLE_BRAND_USER = gql`
${META_FRAGMENT}
query FetchBrandUser($uuid: UUID) {
  fetchBrandUser(uuid: $uuid) {
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
      UserBrandDomainData {
        uuid
        domain_name
        status
        company_name
      }
      UserBrandSettingData {
        uuid
        influencer_count
        session_count
        available_sessions
      }
    }
    meta {
      ...MetaFragment
    }
  }
}
`;

export const FETCH_BRAND_INFLUENCERS = gql`
${META_FRAGMENT}
query FetchBrandInfluencers($page: Int, $limit: Int, $brandId: String, $search: String, $sortBy: String, $sortOrder: String) {
  fetchBrandInfluencers(page: $page, limit: $limit, brand_id: $brandId, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      brandUserData {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
        status
        UserBrandDomainData {
          uuid
          domain_name
          status
        }
        UserBrandSettingData {
          uuid
          influencer_count
          session_count
        }
        created_at
        updated_at
      }
      count
    }
    meta {
      ...MetaFragment
    }
  }
}
`;
