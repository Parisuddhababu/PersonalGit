import { gql } from '@apollo/client';
export const GET_CHILD_CATEGORIES_DROPDOWN=gql`
query GetManualCategories($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getManualCategories(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        manualCategories {
          name
          uuid
          children {
            name
            uuid
            image_url
          }
        }
        count
      }
    }
  }`

export const GET_ITEM_BY_CATEGORIES_PAGINATION=gql`
query GetItemByCategoriesPagination($itemCategoryId: String!, $sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
  getItemByCategoriesPagination(itemCategoryId: $itemCategoryId, sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
    message
    data {
      count
      itemByCategories {
        uuid
        name
        url
        image
      }
    }
  }
}`