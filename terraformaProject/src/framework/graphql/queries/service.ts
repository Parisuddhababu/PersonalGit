import { gql } from '@apollo/client';

export const SERVICE_DETAIL = gql`
query GetServicesForWebsite {
    getServicesForWebsite {
      message
      data {
        uuid
        title
        description
        image
        order
        type
        landing_page_services {
          uuid
          title
          description
          image
          order
          type
        }
      }
    }
  }`

  