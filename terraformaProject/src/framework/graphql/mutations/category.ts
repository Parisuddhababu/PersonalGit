import { gql } from '@apollo/client';

export const UPDATE_CATEGORY=gql`
mutation UpdateCategory($categoryData: UpdateCategoryDto!) {
  updateCategory(categoryData: $categoryData) {
      data {
        description
        image_url
        name
        uuid
        status
      }
      message
    }
  }
`
export const UPDATE_SUB_CATEGORY=gql`
mutation updateSubCategory($subCategoryData: UpdateSubCategoryDto!) {
    updateSubCategory(subCategoryData: $subCategoryData) {
      data {
        description
        image_url
        name
        uuid
        status
      }
      message
    }
  }
`

export const UPDATE_SUB_CATEGORY_STATUS=gql`
mutation ActiveDeActiveSubCategory($status: Float!, $subCategoryId: String!) {
  activeDeActiveSubCategory(status: $status, subCategoryId: $subCategoryId) {
    data {
      uuid
      status
      name
      image_url
      description
    }
    message
  }
}
`

export const UPDATE_CATEGORY_STATUS=gql`
mutation ActiveDeActiveCategory($status: Float!, $categoryId: String!) {
  activeDeActiveCategory(status: $status, categoryId: $categoryId) {
    data {
      uuid
      status
      name
      image_url
      description
    }
    message     
  }
}
`
export const DELETE_SUB_CATEGORY=gql`
mutation deleteSubCategory($subCategoryId: String!) {
  deleteSubCategory(subCategoryId: $subCategoryId) {
    data {
      uuid
      name
      image_url
      description
    }
    message
  }
}
`
export const DELETE_CATEGORY=gql`
mutation DeleteCategory($categoryId: String!) {
  deleteCategory(categoryId: $categoryId) {
    data {
      uuid
      name
      image_url
      description
    }
    message
  }
}
`

export const CREATE_SUB_CATEGORY=gql`
mutation CreateSubCategory($subCategoryData: CreateSubCategoryDto!) {
  createSubCategory(subCategoryData: $subCategoryData) {
    data {
      uuid
      name
      image_url
      description
    }
    message
  }
}
`

export const CREATE_CATEGORY=gql`
mutation CreateCategory($categoryData: CreateCategoryDto!) {
  createCategory(categoryData: $categoryData) {
    data {
      uuid
      name
      image_url
      description
      status
    }
    message
  }
}
`

export const GROUP_DELETE_CATEGORY=gql`
mutation GroupDeleteCategories($groupDeleteCategoriesId: [Int]) {
  groupDeleteCategories(id: $groupDeleteCategoriesId) {
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
}`