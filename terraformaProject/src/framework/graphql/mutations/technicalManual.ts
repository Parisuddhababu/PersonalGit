
import { gql } from '@apollo/client';
export const CREATE_MANUAL_CATEGORY = gql`
mutation CreateManualCategory($manualCategoryData: CreateManualCategoryDto!) {
    createManualCategory(manualCategoryData: $manualCategoryData) {
      message
      data {
        uuid
        name
        description
        image_url
        parent {
          uuid
          name
          description
          image_url
        }
      }
    }
  }
`;

export const UPDATE_MANUAL_CATEGORY= gql`
mutation UpdateManualCategory($categoryId: String!, $manualCategoryData: UpdateManualCategoryDto!) {
    updateManualCategory(categoryId: $categoryId, manualCategoryData: $manualCategoryData) {
      message
      data {
        uuid
        name
        description
        image_url
      }
    }
  }
`

export const DELETE_MANUAL_CATEGORY= gql`
mutation DeleteManualCategory($manualCategoryId: String!) {
  deleteManualCategory(manualCategoryId: $manualCategoryId) {
    message
    data {
      uuid
      name
      description
      image_url
      parent {
        uuid
        name
        description
        image_url
      }
    }
  }
}`