import { gql } from '@apollo/client';

export const WHY_CHOOSE = gql`
query GetWhyChooseUsForWebsite {
    getWhyChooseUsForWebsite {
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