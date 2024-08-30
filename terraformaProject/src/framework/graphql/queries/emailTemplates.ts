import { gql } from '@apollo/client';

export const GET_TEMPLATES_WITH_FILTER = gql`
  query GetTemplatesWithFilterAndPagination($sortOrder: String!, $limit: Float!, $page: Float!, $search: String!, $sortField: String!) {
    getTemplatesWithFilterAndPagination(sortOrder: $sortOrder, limit: $limit, page: $page, search: $search, sortField: $sortField) {
      message
      data {
        templates {
          uuid
          title
          description
          status
        }
        count
      }
    }
  }
`
export const GET_TEMPLATES_WITH_ID = gql`
  query GetTemplateById($getTemplateByIdId: String!) {
    getTemplateById(id: $getTemplateByIdId) {
      message
      data {
        description
        status
        title
        uuid
      }
    }
  }
`
export const GET_SYSTEM_TEMPLATES_WITH_FILTER = gql`
  query GetSystemEmailTemplatesWithPagination($filterData: SystemEmailTemplateListDto!) {
    getSystemEmailTemplatesWithPagination(filterData: $filterData) {
      message
      data {
        templates {
          uuid
          title
          description
          status
        }
        count
      }
    }
  }
`
export const GET_SYSTEM_TEMPLATES_WITH_ID = gql`
  query GetSystemEmailTemplateById($systemEmailTemplateId: String!) {
    getSystemEmailTemplateById(systemEmailTemplateId: $systemEmailTemplateId) {
      message
      data {
        uuid
        name
        title
        description
        status
      }
    }
  }
`
export const GET_USERS_FOR_ANNOUNCEMENT_PAGINATION = gql`
  query GetUsersForAnnouncementPagination($userType: [Int!]!, $sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getUsersForAnnouncementPagination(userType: $userType, sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        users {
          uuid
          first_name
          last_name
          email
          phone_number
          user_type
        }
        count
      }
    }
  }
`