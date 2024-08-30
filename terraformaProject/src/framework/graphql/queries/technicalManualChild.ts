import { gql } from '@apollo/client';
export const GET_MANUAL_CATEGORIES_PAGINATION_CHILD = gql `
query GetAllChildCategories($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
  getAllChildCategories(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
    message
    data {
      childCategories {
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
      count
    }
  }
}
  `
  export const GET_PARENT_CATEGORIES = gql `
  query GetAllParentCategory {
    getAllParentCategory {
      message
      data {
        uuid
        name
        description
        image_url
      }
    }
  }`

  export const GET_MANUAL_CATEGORIES_ID = gql `
  query GetManualCategoryById($manualCategoryId: String!) {
    getManualCategoryById(manualCategoryId: $manualCategoryId) {
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