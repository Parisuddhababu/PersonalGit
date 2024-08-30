import { gql } from '@apollo/client';
export const GET_MANUAL_CATEGORIES_PAGINATION = gql `
query GetManualCategories($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
  getManualCategories(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
    message
    data {
      manualCategories {
        uuid
        name
        description
        image_url
      
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

export const GET_PARENT_MANUAL_CATEGORIES_ID = gql `
  query GetManualParentCategoryById($manualCategoryId: String!) {
    getManualParentCategoryById(manualCategoryId: $manualCategoryId) {
      message
      data {
        uuid
        name
        description
        image_url
        children {
          uuid
          name
          description
          image_url
        }
      }
    }
  }`