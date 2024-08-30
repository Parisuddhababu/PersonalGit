import { gql } from '@apollo/client';

export const LIST_TAG = gql`
query GetTags {
    getTags {
      message
      data {
        uuid
        title
        description
        image
        type
      }
    }
  }`