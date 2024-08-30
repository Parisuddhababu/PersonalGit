import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

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

