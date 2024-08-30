import { gql } from "@apollo/client";
export const FETCH_CATEGORIES = gql`
  query FetchCategory(
    $page: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    fetchCategory(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
      data {
        Categorydata {
          id
          uuid
          category_name
          parent_category
          description
          status
          created_by
          created_at
          updated_at
          parentData {
            id
            uuid
            category_name
            parent_category
            description
            status
            created_by
            created_at
            updated_at
          }
        }
        count
      }
    }
  }
`;

export const GET_SINGLE_CATEGORY_DATA_BY_ID = gql`
  query GetSingleCategory($getSingleCategoryId: ID) {
    getSingleCategory(id: $getSingleCategoryId) {
      data {
        id
        uuid
        category_name
        parent_category
        description
        status
        created_by
        created_at
        updated_at
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;
