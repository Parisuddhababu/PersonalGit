import { gql } from '@apollo/client';

export const MANAGE_STEPS = gql`
query GetStepsForWebsite {
    getStepsForWebsite {
      message
      data {
        uuid
        title
        image
        description
        order
      }
    }
  }`