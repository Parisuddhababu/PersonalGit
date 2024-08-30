import { gql } from "@apollo/client";
export const CREATE_CATEGORY = gql`
  mutation CreateCategory(
    $categoryName: String
    $description: String
    $parentCategory: Int
    $status: Int
    $createdBy: Int
  ) {
    createCategory(
      category_name: $categoryName
      description: $description
      parent_category: $parentCategory
      status: $status
      created_by: $createdBy
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
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory(
    $updateCategoryId: Int
    $categoryName: String
    $parentCategory: Int
    $description: String
    $status: Int
    $createdBy: Int
  ) {
    updateCategory(
      id: $updateCategoryId
      category_name: $categoryName
      parent_category: $parentCategory
      description: $description
      status: $status
      created_by: $createdBy
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
    }
  }
`;

export const DELETE_CATEGORY_ID = gql`
  mutation DeleteCategory($deleteCategoryId: Int) {
    deleteCategory(id: $deleteCategoryId) {
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

export const CATEGORY_STATUS_UPDATE = gql`
  mutation CategoryStatusUpdate($categoryStatusUpdateId: Int, $status: Int) {
    categoryStatusUpdate(id: $categoryStatusUpdateId, status: $status) {
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
export const GROUP_DELETE_CATEGORY=gql`
mutation Mutation($categoryIds: [Int]) {
  groupDeleteCategories(categoryIds: $categoryIds) {
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
`