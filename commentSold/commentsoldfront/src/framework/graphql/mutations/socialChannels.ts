import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_SOCIAL_PAGES = gql`
  ${META_FRAGMENT}
  mutation GetUserSocialPages($accessToken: String, $facebookId: String) {
    getUserSocialPages(accessToken: $accessToken, facebook_id: $facebookId) {
      data {
        uuid
        user_id
        social_connection_id
        social_page_id
        social_page_title
        page_token_expires_at
        facebook_id
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const DISCONNECT_FB = gql`
  ${META_FRAGMENT}
  mutation DisconnectFacebook {
    disconnectFacebook {
      data
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const DISCONNECT_YOUTUBE = gql`
  ${META_FRAGMENT}
  mutation DisconnectYoutube {
    disconnectYoutube {
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const SELECT_SOCIAL_PAGE = gql`
  ${META_FRAGMENT}
  mutation SelectSocialPage($selectSocialPageId: String) {
    selectSocialPage(id: $selectSocialPageId) {
      data
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const CONNECT_TIK_TOK_AUTHORIZATION = gql`
  ${META_FRAGMENT}
  mutation ConnectTikTokAuthorization($connectTikTokAuthorizationInputParameters: connectTikTokAuthorizationInputParameters) {
    connectTikTokAuthorization(connectTikTokAuthorizationInputParameters: $connectTikTokAuthorizationInputParameters) {
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

export const DISCONNECT_TIK_TOK = gql`
  ${META_FRAGMENT}
  mutation DisconnectTikTokAuthorizationData {
    disconnectTikTokAuthorizationData {
      meta {
        ...MetaFragment
      }
    }
  }
`;


export const CONNECT_LINKEDIN_AUTHORIZATION = gql`
  ${META_FRAGMENT}
  mutation ConnectLinkendInAuthorization($connectLinkendInAuthorizationInputParameters: connectLinkendInAuthorizationInputParameters) {
    connectLinkendInAuthorization(connectLinkendInAuthorizationInputParameters: $connectLinkendInAuthorizationInputParameters) {
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
