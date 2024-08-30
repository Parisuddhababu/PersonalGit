import { gql } from '@apollo/client';
export const GET_ABOUT_US = gql`
query GetAboutUsDetailsForWebsite {
    getAboutUsDetailsForWebsite {
      message
      data {
        uuid
        title
        order
        description
        image
        landing_page_points {
          uuid
          title
          order
          type
        }
      }
    }
  }`