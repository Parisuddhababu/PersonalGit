import { gql } from '@apollo/client';
export const UPDATE_WEST_COLLECTION = gql`
mutation UpdateServiceDetailsForWebsite($inputData: UpdateLandingPageServiceDto!) {
    updateServiceDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`

export const UPDATE_WEST_COLLECTION_POINT = gql`
  mutation UpdateServicePointForWebsite($inputData: UpdateLandingPageServicePointDto!) {
    updateServicePointForWebsite(inputData: $inputData) {
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
