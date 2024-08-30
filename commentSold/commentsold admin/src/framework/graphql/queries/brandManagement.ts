import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const FETCH_BRAND_USERS_REQUEST = gql`
${META_FRAGMENT}
query FetchBrandUserRequests($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
  fetchBrandUserRequests(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      brandUserRequestData {
        uuid
        brand_name
        first_name
        last_name
        phone_number
        country_code_id
        brand_email
        request_status
        influencer_count
        session_count
        created_at
        updated_at
        company_name
      }
      count
    }
    meta {
      ...MetaFragment
    }
  }
}
`;

export const GET_SINGLE_BRAND_USER_REQUEST = gql`
${META_FRAGMENT}
query FetchBrandUserRequest($uuid: UUID) {
  fetchBrandUserRequest(uuid: $uuid) {
    data {
      uuid
      brand_name
      first_name
      last_name
      phone_number
      country_code_id
      brand_email
      request_status
      influencer_count
      session_count
      created_at
      updated_at
      company_name
    }
    meta {
      ...MetaFragment
    }
  }
}
`;



