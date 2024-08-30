import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const LIST_OF_SOCIAL_PAGES = gql`
  ${META_FRAGMENT}
  query ListSocialPages {
    listSocialPages {
      data {
        uuid
        user_id
        social_connection_id
        facebook_id
        social_page_id
        social_page_title
        page_token_expires_at
        is_selected
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const FETCH_SOCIAL_CONNECTION_DETAILS = gql`
  ${META_FRAGMENT}
  query FetchSocialConnectionDetails {
    fetchSocialConnectionDetails {
      data {
        connection_name
        client_key
        scope
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_INSTA_ACCOUNT = gql`
  ${META_FRAGMENT}
  query GetInstaAccount($socialPageUuid: String) {
    getInstaAccount(social_page_uuid: $socialPageUuid) {
      data {
        uuid
        user_id
        social_connection_id
        facebook_id
        social_page_id
        social_page_title
        page_token_expires_at
        is_selected
        instagram_account_id
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const LIST_OF_YOUTUBE_CHANNELS = gql`
  ${META_FRAGMENT}
  query ListYouTubeChannels {
    listYouTubeChannels {
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

export const GET_SOCIAL_CONNECTION = gql`
  ${META_FRAGMENT}
  query GetSocialConnection($connectionName: String) {
    getSocialConnection(connection_name: $connectionName) {
      data {
        uuid
        application_key
        connection_name
        client_key
        client_secret
        status
        scope
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_TIK_TOK_AUTHORIZATION_DATA = gql`
  ${META_FRAGMENT}
  query GetTikTokAuthorizationData {
    getTikTokAuthorizationData {
      data {
        uuid
        user_id
        channel_name
        channel_id
        social_connection_id
        facebook_id
        last_access
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_LINKEDIN_AUTHORIZATION_DATA = gql`
  ${META_FRAGMENT}
  query GetLinkendInAuthorizationData {
    getLinkendInAuthorizationData {
      data {
        uuid
        user_id
        channel_name
        channel_id
        social_connection_id
        facebook_id
        last_access
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const DISCONNECT_LINKEDIN = gql`
  ${META_FRAGMENT}
  mutation DisconnectLinkendInAuthorizationData {
    disconnectLinkendInAuthorizationData {
      meta {
        ...MetaFragment
      }
    }
  }
`;