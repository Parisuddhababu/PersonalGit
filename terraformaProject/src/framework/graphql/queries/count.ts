import { gql } from '@apollo/client';

export const GET_COUNT = gql`
query GetStatisticsForWebsite {
    getStatisticsForWebsite {
      message
      data {
        uuid
        title
        description
        order
        type
      }
    }
  }`

