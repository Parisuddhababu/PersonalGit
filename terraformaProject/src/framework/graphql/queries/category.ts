import { gql } from '@apollo/client';

export const FETCH_SUB_CATEGORY = gql`
  query GetSubCategories($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getSubCategories(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      data {
        subCategories {
          uuid
          name
          image_url
          description
          status
          category {
            uuid
            name
            description
            image_url
            status
          }
        }
        count
      }
    }
  }
  `

export const FETCH_CATEGORY = gql`
    query GetCategories($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
      getCategories(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
        data {
          categories {
            description
            image_url
            name
            uuid
            status
          }
          count
        }
        message
      }
    }
  `

export const GET_ACTIVE_CATEGORY = gql`
  query GetActiveCategories($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getActiveCategories(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      data {
        categories {
          description
          image_url
          name
          uuid
          status
        }
        count
      }
      message
    }
  }
`

export const GET_CATEGORIES_AND_COURSE_COUNT_WITH_PAGINATION = gql`
  query GetCategoriesAndCourseCountWithPagination($limit: Float!, $page: Float!, $search: String!) {
    getCategoriesAndCourseCountWithPagination(limit: $limit, page: $page, search: $search) {
      message
      data {
        count
        categories {
          uuid
          status
          name
          description
          image_url
          course_count
        }
      }
    }
  }
`

export const GET_SUB_CATEGORY_BY_ID = gql`
  query GetSubCategoryById($getSubCategoryByIdId: String!) {
    getSubCategoryById(id: $getSubCategoryByIdId) {
      data {
        uuid
        name
        image_url
        description
        status
        category {
          name
          uuid
          image_url
          status
        }
      }
      message
    }
  }
`

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($categoryId: String!) {
    getCategoryById(categoryId: $categoryId) {
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
export const GET_ACTIVE_SUB_CATEGORIES_BY_CATEGORY_ID = gql`
query GetActiveSubCategoriesByCategoryId($categoryId: String!) {
  getActiveSubCategoriesByCategoryId(category_id: $categoryId) {
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