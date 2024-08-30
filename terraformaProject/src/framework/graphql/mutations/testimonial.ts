import { gql } from '@apollo/client';

export const LIST_TESTIMONIALS = gql`
query GetTestimonialsForWebsite {
    getTestimonialsForWebsite {
      message
      data {
        title
        uuid
        order
        landing_page_testimonials {
          uuid
          name
          description
          image
          order
          tag
          type
        }
       
      }
    }
  }`
  