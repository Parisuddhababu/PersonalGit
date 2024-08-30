import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_PROFILE = gql`
  ${META_FRAGMENT}
  query GetProfile {
    getProfile {
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
        key_word_count
        key_words
        brand_id
        is_display_keyword
        primary_color
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_AUTHORIZATION_CODE = gql`
  ${META_FRAGMENT}
  query GetAuthorizationCode($authorizationCode: String) {
    getAuthorizationCode(authorization_code: $authorizationCode) {
      data {
        uuid
        user_id
        social_connection_id
        channel_name
        last_access
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_ALL_SOCIAL_CONNECTIONS = gql`
  ${META_FRAGMENT}
  query GetAllSocialConnections {
    getAllSocialConnections {
      data {
        uuid
        connection_name
        status
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

