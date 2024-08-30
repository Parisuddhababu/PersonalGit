import { gql } from '@apollo/client';

export const CLIENT_DETAIL = gql`
query GetClientsForWebsite {
    getClientsForWebsite {
      message
      data {
        uuid
        title
        description
        image
        order
        type
      }
    }
  }`